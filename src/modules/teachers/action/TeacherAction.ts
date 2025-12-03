"use server";

import db from "@/src/lib/db";
import { createTeacherSchema } from "../schemas/CreateTeacherSchema";
import bcrypt from "bcryptjs";
import { editTeacherSchema } from "../schemas/EditTeacherSchema";
import { toStr } from "@/src/helpers/toString";
import { ProtectedAction } from "@/src/helpers/ProtectedAction";
import { ActionType } from "@/src/types";
import { deleteTeacherSchema } from "../schemas/DeleteTeacherSchema";

export const CreateTeacherAction = async (formData: FormData): ActionType => {
  const rawData = {
    full_name: toStr(formData.get("full_name")),
    email: toStr(formData.get("email")),
    nip: toStr(formData.get("nip")),
    address: toStr(formData.get("address")),
    gender: toStr(formData.get("gender")),
    phone_number: toStr(formData.get("phone_number")),
    password: toStr(formData.get("password")),
    password_confirmation: toStr(formData.get("password_confirmation")),
  };

  const validatedData = createTeacherSchema.safeParse(rawData);

  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

   // Prevent duplicate data
  const existingEmail = await db.user.findUnique({ where: { email: validatedData.data.email } });
  if (existingEmail) return { status: 409, success: false, message: "Email sudah digunakan" };

  const existingNip = await db.teacher.findUnique({ where: { nip: validatedData.data.nip } });
  if (existingNip) return { status: 409, success: false, message: "NIP sudah digunakan" };


  const role = await db.role.findUnique({
    where: {
      role_name: "teacher",
    },
  });

  if (!role) {
    throw new Error("Role Not Found");
  }

  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.teacher.create({
        data: {
          nip: validatedData.data.nip,
          user: {
            create: {
              full_name: validatedData.data.full_name,
              email: validatedData.data.email,
              password: await bcrypt.hash(validatedData.data.password, 10),
              role_id: role.id,
              address: validatedData.data.address,
              gender: validatedData.data.gender,
              phone_number: validatedData.data.phone_number,
            },
          },
        },
      });
    },
    `${validatedData.data.full_name} berhasil ditambahkan sebagai guru`,
    "Gagal menambah guru"
  );
};
export const EditTeacherAction = async (formData: FormData):ActionType => {
  const teacher_id = toStr(formData.get("teacher_id"));
  const rawData = {
    full_name: toStr(formData.get("full_name")),
    email: toStr(formData.get("email")),
    nip: toStr(formData.get("nip")),
    address: toStr(formData.get("address")),
    gender: toStr(formData.get("gender")),
    phone_number: toStr(formData.get("phone_number")),
    password: toStr(formData.get("password")),
    password_confirmation: toStr(formData.get("password_confirmation")),
  };

  const validatedData = editTeacherSchema.safeParse(rawData);

  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

  if (!teacher_id) {
    return { status: 404, success: false, message: "Guru ID tidak ditemukan" };
  }

  const teacher = await db.teacher.findUnique({
    where: { id_teacher: teacher_id },
    include: { user: true },
  });

  if (!teacher) {
    return { status: 404, success: false, message: "Guru tidak ditemukan" };
  }

  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.teacher.update({
        where: {
          id_teacher: teacher.id_teacher,
        },
        data: {
          nip: validatedData.data?.nip,
          user: {
            update: {
              full_name: validatedData.data?.full_name,
              email: validatedData.data?.email,
              address: validatedData.data?.address,
              gender: validatedData.data?.gender,
              phone_number: validatedData.data?.phone_number,
              ...(validatedData.data?.password
                ? {
                    password: await bcrypt.hash(
                      validatedData.data?.password,
                      10
                    ),
                  }
                : {}),
            },
          },
        },
      });
    },
    `Data berhasil diupdate`,
    "Gagal mengupdate data"
  );
};
export const DeleteTeacherAction = async (teacher_id: string):ActionType => {
  const rawData = {
    teacher_id: toStr(teacher_id),
  };

  const validatedData = deleteTeacherSchema.safeParse(rawData);
  if (!validatedData.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

  const teacher = await db.teacher.findUnique({
    where: { id_teacher: teacher_id },
    include: { user: true },
  });

  if (!teacher) {
    return { status: 404, success: false, message: "Siswa tidak ditemukan" };
  }

  // Hapus teacher dan user terkait
  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.teacher.delete({
        where: { id_teacher: teacher_id },
      });
    },
    "Guru berhasil dihapus",
    "Guru gagal dihapus"
  );
};
