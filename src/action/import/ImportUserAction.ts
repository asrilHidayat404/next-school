// app/actions/importExcel.ts
"use server";

import * as XLSX from "xlsx";
import db from "@/src/lib/db";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import { copyDefaultAvatar } from "../AuthenticationAction";
import { revalidatePath } from "next/cache";

type RowExcel = { full_name: string; email: string; role: string };

export async function importExcelAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, message: "No file uploaded" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json<RowExcel>(worksheet);

  // Ambil role map
  const roles = await db.role.findMany();
  const roleMap: Record<string, number> = {};
  roles.forEach((r) => {
    roleMap[r.role_name.toLowerCase()] = r.id;
  });

  const password = await bcrypt.hash("password", 10);

  // Simpan path avatar hasil copy untuk cleanup kalau gagal
  const copiedFiles: string[] = [];

  try {
   await db.$transaction(async (tx) => {
  for (const row of json) {
    console.log(row);
    
    const user = await tx.user.upsert({
      where: { email: row.email },
      update: {
        full_name: row.full_name,
        role_id: roleMap[row.role.toLowerCase()] ?? roleMap["siswa"],
      },
      create: {
        full_name: row.full_name,
        email: row.email,
        password,
        role_id: roleMap[row.role.toLowerCase()] ?? roleMap["siswa"],
        avatar: "avatar/default.png", // sementara
      },
    });

    // kalau user baru dibuat (avatar masih default), copy avatar
    if (user.avatar === "avatar/default.png") {
      const avatarPath = await copyDefaultAvatar(
        "public/storage/avatar",
        user.id
      );
      copiedFiles.push(avatarPath);

      await tx.user.update({
        where: { id: user.id },
        data: { avatar: avatarPath },
      });
    }
  }
}, { timeout: 1000 * 60 });

    revalidatePath("/dashboard/users")
    return { success: true, count: json.length };
  } catch (err: any) {
    // rollback file copy manual
    for (const filePath of copiedFiles) {
      try {
        await fs.unlink(path.resolve(filePath));
      } catch {
        // abaikan error hapus file
      }
    }
    return { success: false, message: err.message };
  }
}
