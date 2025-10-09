"use server";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import db from "@/src/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query"); // ambil query parameter
    console.log("Query:", query);

    let whereClause = {};

    if (query?.trim()) {
      const role = await db.role.findUnique({
        where: { role_name: query },
      });
      if (role) {
        whereClause = { role_id: role.id };
      }
    }

    // Ambil data dari database
    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Konversi ke worksheet
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=users.xlsx",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 });
  }
}
