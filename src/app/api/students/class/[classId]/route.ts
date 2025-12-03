import db from "@/src/lib/db";
import { NextRequest } from "next/server";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  console.log("Class ID:", classId);

  // Ambil data siswa beserta data user-nya
  const students = await db.student.findMany({
    where: {
      class_id: classId,
    },
    include: {
      user: true,
      class: {
        include: {
          school: true
        }
      }
    },
  });

  // Siapkan data untuk diekspor (bisa sesuaikan kolomnya)
  const formatted = students.map((s) => ({
    NIS: s.nis,
    Nama: s.user.full_name,
    Email: s.user.email,
    Tetala: new Date(s.birth),
    Alamat: s.user.address,
    Jenis_Kelamin: s.user.gender,
    Nomor_Telepon: s.user.phone_number,
    Kelas: s.class.class_name,
    Madrasah: s.class.school.school_name
  }));

  // Konversi ke worksheet
  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa");

  // Tulis ke buffer
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  // Kembalikan sebagai file Excel untuk diunduh
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="students_${classId}.xlsx"`,
    },
  });
}
