"use server";

import db from "@/src/lib/db";
import { createClassSchema } from "../schemas/CreateClassSchema";
import { ProtectedAction } from "@/src/helpers/ProtectedAction";
import { ActionType } from "@/src/types";
import { toStr } from "@/src/helpers/toString";
import { editClassSchema } from "../schemas/EditClassSchema";
import { deleteClassSchema } from "../schemas/DeleteClassSchema";

export const CreateClassAction = async (formData: FormData): ActionType => {
  const rawData = {
    class_name: toStr(formData.get("class_name")),
    school_id: toStr(formData.get("school_id")),
  };

  const validatedData = createClassSchema.safeParse(rawData);

  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.schoolClass.create({
        data: {
          class_name: validatedData.data.class_name,
          school_id: validatedData.data.school_id,
        },
      });
    },
    `${validatedData.data.class_name} berhasil ditambahkan sebagai Kelas`,
    "Gagal membuat kelas"
  );
};
export const EditClassAction = async (formData: FormData): ActionType => {
  const rawData = {
    new_class_name: toStr(formData.get("class_name")),
    class_id: toStr(formData.get("class_id")),
  };

  const validatedData = editClassSchema.safeParse(rawData);

  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

  const isClassExist = await db.schoolClass.findUnique({
    where: {
      id_class: validatedData.data.class_id,
    },
  });

  if (!isClassExist) {
    throw new Error("Kelas tidak ditemukan");
  }

  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.schoolClass.update({
        where: {
          id_class: validatedData.data.class_id,
        },
        data: {
          class_name: validatedData.data.new_class_name,
        },
      });
    },
    `Kelas ${validatedData.data.new_class_name} berhasil diupdate`,
    "Gagal mengupdate kelas"
  );
};

export const DeleteClassAction = async (class_id: string): ActionType => {
  const rawData = {
    class_id: toStr(class_id),
  };

  const validatedData = deleteClassSchema.safeParse(rawData);
  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }
  const isClassExist = await db.schoolClass.findUnique({
    where: {
      id_class: class_id,
    },
  });

  if (!isClassExist) {
    throw new Error("Kelas tidak ditemukan");
  }
  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.schoolClass.delete({
        where: {
          id_class: class_id,
        },
      });
    },
    `Kelas ${isClassExist.class_name} berhasil dihapus`,
    "Gagal menghapus kelas"
  );
};
