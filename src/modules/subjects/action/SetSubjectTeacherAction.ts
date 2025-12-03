"use server";

import db from "@/src/lib/db";

type ActionResult =
  | { status: number; success: true; message?: string }
  | { status: number; success: false; error: string };
export const SetSubjectTeacherAction = async (
  subject_id: string,
  teacher_id: string
): Promise<ActionResult> => {
  // Normalize & validate inputs
  const sid = (subject_id ?? "").toString().trim();
  const tid = (teacher_id ?? "").toString().trim();

  if (!sid || !tid) {
    return {
      status: 400,
      success: false,
      error: "subject_id dan teacher_id wajib diisi",
    };
  }

  try {
    // check existence in parallel
    const [subject, teacher] = await Promise.all([
      db.subject.findUnique({ where: { id_subject: sid } }),
      db.teacher.findUnique({ where: { id_teacher: tid } }),
    ]);

    if (!subject) {
      return { status: 404, success: false, error: "Materi tidak ditemukan" };
    }

    if (!teacher) {
      return { status: 404, success: false, error: "Guru tidak ditemukan" };
    }

    // If teacher already assigned, return early
    if (subject.teacher_id === tid) {
      return {
        status: 200,
        success: true,
        message: "Guru sudah ditetapkan pada materi ini",
      };
    }

    await db.subject.update({
      where: { id_subject: sid },
      data: { teacher_id: tid },
    });

    return {
      status: 200,
      success: true,
      message: "Guru berhasil ditetapkan pada materi",
    };
  } catch (err: any) {
    console.error("SetSubjectTeacherAction error:", err);
    // Prisma: record not found when updating
    if (err?.code === "P2025") {
      return { status: 404, success: false, error: "Resource tidak ditemukan" };
    }

    return {
      status: 500,
      success: false,
      error: "Terjadi kesalahan saat menyimpan penugasan guru",
    };
  }
};
