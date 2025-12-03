"use server";

import * as XLSX from "xlsx";
import db from "@/src/lib/db";
import { revalidatePath } from "next/cache";

export async function importStudentsAction(formData: FormData) {
  const file = formData.get("file") as File | null;

  if (!file) {
    return {
      success: false,
      message: "File tidak ditemukan.",
    };
  }

  // Validate file type
  if (!file.name.match(/\.(xlsx|xls)$/)) {
    return {
      success: false,
      message:
        "Format file tidak didukung. Harus file Excel (.xlsx atau .xls).",
    };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      message: "File terlalu besar. Maksimal 5MB.",
    };
  }

  function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    // Perhatikan timezone: Excel tidak simpan offset, jadi tambahkan sedikit koreksi
    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate()
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "", // biar kolom kosong tetap muncul
      header: [
        "nis",
        "nama",
        "email",
        "tetala",
        "alamat",
        "jenis_kelamin",
        "telepon",
        "kelas",
        "madrasah",
      ],
    });

    if (rows.length === 0) {
      return {
        success: false,
        message: "File kosong atau tidak ada data yang dapat diproses.",
      };
    }
    rows.forEach((row: any) => {
      if (typeof row.tetala === "number") {
        row.tetala = excelDateToJSDate(row.tetala).toISOString().split("T")[0];
      }
    });

    const rawData = rows.slice(1);

    const data = await Promise.all(
      rawData.map(async (row: any, index: number) => {
        try {
          // Validate required fields
          if (!row.NIS || !row.Nama || !row.Email) {
            return {
              nis: row.NIS || `MISSING_${index}`,
              full_name: row.Nama || "Data tidak lengkap",
              email: row.Email || "email@missing.com",
              status: "error",
              error: "Data wajib (NIS, Nama, Email) tidak lengkap",
            };
          }

          // Check if NIS already exists
          const existingStudent = await db.student.findUnique({
            where: { nis: row.NIS.toString() },
            select: {
              id_student: true,
              user: {
                select: {
                  full_name: true,
                  email: true,
                },
              },
            },
          });

          // Check if email already exists in user table
          const existingUser = await db.user.findUnique({
            where: { email: row.Email },
            select: { id: true },
          });

          if (
            existingStudent &&
            existingUser &&
            existingUser.id !== existingStudent.user?.id
          ) {
            return {
              nis: row.NIS,
              full_name: row.Nama,
              email: row.Email,
              status: "error",
              error: "Email sudah digunakan oleh user lain",
            };
          }

          return {
            nis: row.NIS.toString(),
            full_name: row.nama,
            email: row.email,
            gender: row.jenis_kelamin || "Laki-laki",
            address: row.alamat || "",
            phone_number: row.telepon || "",
            birth: row.tetal ? new Date(row.Tanggal_Lahir) : new Date(),
            kelas: row.kelas || "",
            madrasah: row.madrasah || "",
            status: existingStudent ? "update" : "new",
            existing_data: existingStudent ? existingStudent.user : null,
          };
        } catch (error) {
          return {
            nis: row.NIS || `ERROR_${index}`,
            full_name: row.Nama || "Error",
            email: row.Email || "error@error.com",
            status: "error",
            error: "Terjadi kesalahan saat memproses data",
          };
        }
      })
    );

    return {
      success: true,
      data,
      message: `Berhasil memproses ${data.length} data`,
    };
  } catch (error) {
    console.error("Import error:", error);
    return {
      success: false,
      message:
        "Terjadi kesalahan saat membaca file. Pastikan format file benar.",
    };
  }
}

export async function confirmImportAction(data: any[]) {
  try {
    let successCount = 0;
    let errorCount = 0;

    for (const row of data) {
      if (row.status === "error") {
        errorCount++;
        continue;
      }

      try {
        await db.student.upsert({
          where: { nis: row.nis },
          update: {
            user: {
              update: {
                full_name: row.full_name,
                email: row.email,
                gender: row.gender,
                address: row.address,
                phone_number: row.phone_number,
              },
            },
            birth: row.birth,
            father_name: row.father_name,
            mother_name: row.mother_name,
          },
          create: {
            nis: row.nis,
            birth: row.birth,
            father_name: row.father_name,
            mother_name: row.mother_name,
            user: {
              create: {
                full_name: row.full_name,
                email: row.email,
                gender: row.gender,
                address: row.address,
                phone_number: row.phone_number,
                password: "password123", // Default password, should be changed
                role_id: 3, // Student role
              },
            },
          },
        });
        successCount++;
      } catch (error) {
        console.error(`Error importing student ${row.nis}:`, error);
        errorCount++;
      }
    }

    revalidatePath("/dashboard/siswa");
    revalidatePath("/dashboard/kelas");

    return {
      success: true,
      message: `Import selesai! ${successCount} data berhasil, ${errorCount} gagal.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Terjadi kesalahan: ${err.message}`,
    };
  }
}
