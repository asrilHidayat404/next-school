"use server";

import db from "@/src/lib/db";
import { createSchoolSchema } from "../schemas/CreateSchoolSchema";
import { ProtectedAction } from "@/src/helpers/ProtectedAction";
import { ActionType } from "@/src/types";
import { toStr } from "@/src/helpers/toString";
import { editSchoolSchema } from "../schemas/EditSchoolSchema";
import { deleteSchoolSchema } from "../schemas/DeleteSchoolSchema";

export const CreateSchoolAction = async (formData: FormData): ActionType => {
  const rawData = {
    school_name: toStr(formData.get("school_name")),
  };

  const validatedData = createSchoolSchema.safeParse(rawData);

  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.school.create({
        data: {
          school_name: validatedData.data.school_name,
        },
      });
    },
    `${validatedData.data.school_name} berhasil ditambahkan`,
    "Gagal menambah madrasah"
  );
};

export const EditSchoolAction = async (formData: FormData): ActionType => {
  const rawData = {
    new_school_name: toStr(formData.get("school_name")),
    school_id: toStr(formData.get("school_id")),
  };

  const validatedData = editSchoolSchema.safeParse(rawData);

  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

  const isSchoolExist = await db.school.findUnique({
    where: {
      id_school: validatedData.data.school_id,
    },
  });

  if (!isSchoolExist) {
    throw new Error("Sekolah tidak ditemukan");
  }

  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.school.update({
        where: {
          id_school: validatedData.data.school_id,
        },
        data: {
          school_name: validatedData.data.new_school_name,
        },
      });
    },
    "Data berhasil diupdate",
    "Data gagal diupdate"
  );
};

export const DeleteSchoolAction = async (school_id: string): ActionType => {
  const rawData = {
    school_id: toStr(school_id),
  };
  const validatedData = deleteSchoolSchema.safeParse(rawData);
  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

  const isSchoolExist = await db.school.findUnique({
    where: {
      id_school: validatedData.data.school_id,
    },
  });

  if (!isSchoolExist) {
    throw new Error("Sekolah tidak ditemukan");
  }
  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.school.delete({
        where: {
          id_school: validatedData.data.school_id,
        },
      });
    },
    `Madrasah ${isSchoolExist.school_name} berhasil dihapus`,
    "Gagal menghapus data"
  );
};
