"use server";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import db from "@/src/lib/db";

export async function GET() {
  try {
    //Ambil data dari database
    const schools = await db.school.findMany({
      include: {
        classes: {
            include: {
                students:true
            }
        }
      }
    });

     // 🔹 Bentuk data yang akan diekspor (flatten)
    const exportData = schools.map((school, index) => {
      const totalClasses = school.classes.length;
      const totalStudents = school.classes.reduce(
        (acc, cls) => acc + cls.students.length,
        0
      );

      return {
        No: index + 1,
        Madrasah: school.school_name,
        "Jumlah Kelas": totalClasses,
        "Jumlah Siswa": totalStudents,
      };
    });
    

    // Konversi ke worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Madrasah");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // 🔹 Return sebagai file download
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="daftar-madrasah-${new Date().getFullYear()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 });
  }
}
