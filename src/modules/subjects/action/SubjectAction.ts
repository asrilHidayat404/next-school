"use server";

import db from "@/src/lib/db";
import { createSubjectSchema } from "../schemas/CreateSubjectSchema";
import { toStr } from "@/src/helpers/toString";
import { ActionType } from "@/src/types";
import { ProtectedAction } from "@/src/helpers/ProtectedAction";

export const CreateSubjectAction = async (formData: FormData): ActionType => {
  // Normalize inputs from FormData (avoid null)
  const rawData = {
    subject_name: toStr(formData.get("subject_name")),
    school_id: toStr(formData.get("school_id")),
    class_id: toStr(formData.get("class_id")),
  };

  const validated = createSubjectSchema.safeParse(rawData);
  if (!validated.success) {
    // return structured error so frontend dapat menampilkannya tanpa crash
    return {
      status: 400,
      success: false,
      message: validated.error.errors.map((e) => e.message).join(", "),
    };
  }

  // 🔍 Pastikan class_id benar-benar milik school_id yang dipilih
  const schoolClass = await db.schoolClass.findFirst({
    where: {
      id_class: validated.data.class_id,
      // also ensure class belongs to the provided school
      school_id: validated.data.school_id,
    },
    include: {
      school: {
        select: {
          school_name: true,
        },
      },
    },
  });

  if (!schoolClass) {
    return {
      status: 400,
      success: false,
      message: "Kelas tidak valid untuk madrasah yang dipilih.",
    };
  }

  // Check existing subject (friendly message before attempting create)
  // const existingSubject = await db.subject.findFirst({
  //   where: {
  //     class_id: schoolClass.id_class,
  //     subject_name: validated.data.subject_name,
  //   },
  // });

  // console.log({existingSubject});
  
  return await ProtectedAction(
    ["superadmin"],
    async () => {
      await db.subject.create({
        data: {
          subject_name: validated.data.subject_name,
          class_id: schoolClass.id_class,
        },
      });
    },
    "Materi berhasil diinput",
    "Materi gagal diinput"
  );
};
