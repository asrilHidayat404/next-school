"use server";
import db from "@/src/lib/db";

export const SetHomeRoomTeacher = async (
  class_id: string,
  teacher_id: string
) => {
  const selectedTeacher = await db.teacher.findUnique({
    where: {
      id_teacher: teacher_id,
    },
    include: {
      homeroom_of: {
        include: {
          school: true
        }
      },
      user: true,
    },
  });
     if (!selectedTeacher) {
      return {
        status: 404,
        success: false,
        error: "Guru tidak ditemukan",
      };
    }

     // Cari apakah guru ini sudah jadi wali di kelas lain
    const oldClass = await db.schoolClass.findFirst({
      where: { homeroom_teacher_id: teacher_id },
    });

  try {
     // Jika iya, hapus relasi wali lama
    if (oldClass) {
      await db.schoolClass.update({
        where: { id_class: oldClass.id_class },
        data: { homeroom_teacher_id: null },
      });
    }

    // Tetapkan guru ke kelas baru
    await db.schoolClass.update({
      where: { id_class: class_id },
      data: { homeroom_teacher_id: teacher_id },
    });

    return {
      status: 200,
      success: true,
      message: "Guru dijadikan wali kelas",
    };

  } catch (error) {
    return {
      status: 400,
      success: false,
      error: "Something went wrong",
    };
  }
};
