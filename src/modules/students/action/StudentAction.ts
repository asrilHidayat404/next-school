"use server";

import db from "@/src/lib/db";
import bcrypt from "bcryptjs";
import { createStudentSchema } from "../schemas/CreateStudentSchema";
import { editStudentSchema } from "../schemas/EditStudentSchema";
import { ActionType } from "@/src/types";
import { ProtectedAction } from "@/src/helpers/ProtectedAction";
import { toStr } from "@/src/helpers/toString";
import { deleteStudentSchema } from "../schemas/DeleteStudentSchema";

export const CreateStudentAction = async (formData: FormData): ActionType => {
  // Ambil semua field dari form
  const rawData = {
    nis: toStr(formData.get("nis")),
    full_name: toStr(formData.get("full_name")),
    email: toStr(formData.get("email")),
    school_id: toStr(formData.get("school_id")),
    class_id: toStr(formData.get("class_id")),
    father_name: toStr(formData.get("father_name")),
    mother_name: toStr(formData.get("mother_name")),
    address: toStr(formData.get("address")),
    birth: toStr(formData.get("birth")),
    gender: toStr(formData.get("gender")),
    phone_number: toStr(formData.get("phone_number")),
    password: toStr(formData.get("password")),
    password_confirmation: toStr(formData.get("password_confirmation")),
  };
  // Validasi menggunakan Zod
  const validated = createStudentSchema.safeParse(rawData);
  if (!validated.success) {
    // Lempar error agar frontend bisa tangkap pesan asli
    throw new Error(validated.error.errors.map((e) => e.message).join(", "));
  }

  const data = validated.data;

  // Pastikan sekolah dan kelas dipilih
  if (!data.school_id || !data.class_id) {
    return {
      status: 400,
      success: false,
      message: "Sekolah dan kelas harus dipilih",
    };
  }

  // Ambil data kelas untuk validasi sinkronisasi sekolah
  const classData = await db.schoolClass.findUnique({
    where: { id_class: data.class_id },
    select: { school_id: true },
  });

  if (!classData) {
    return { status: 404, success: false, message: "Kelas tidak ditemukan" };
  }

  // Cek apakah kelas sesuai sekolah
  if (classData.school_id !== data.school_id) {
    return {
      status: 409,
      success: false,
      message: "Kelas tidak sesuai dengan sekolah yang dipilih",
    };
  }

  // Cek apakah email sudah digunakan
  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    return { status: 409, success: false, message: "Email sudah digunakan" };
  }

  // ✅ Buat akun user & student
  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.student.create({
        data: {
          nis: data.nis,
          father_name: data.father_name,
          mother_name: data.mother_name,
          birth: new Date(data.birth),
          user: {
            create: {
              full_name: data.full_name,
              email: data.email,
              password: await bcrypt.hash(data.password, 10),
              role_id: 5, // role siswa
              gender: data.gender,
              address: data.address,
              phone_number: data.phone_number,
            },
          },
          class: {
            connect: {
              id_class: data.class_id,
            },
          },
        },
      });
    },
    "Berhasil menambah data siswa",
    "Gagal menambah data siswa"
  );
};

export const EditStudentAction = async (formData: FormData): ActionType => {
  const student_id = toStr(formData.get("student_id"));
  const rawData = {
    nis: toStr(formData.get("nis")),
    full_name: toStr(formData.get("full_name")),
    email: toStr(formData.get("email")),
    school_id: toStr(formData.get("school_id")),
    class_id: toStr(formData.get("class_id")),
    father_name: toStr(formData.get("father_name")),
    mother_name: toStr(formData.get("mother_name")),
    address: toStr(formData.get("address")),
    birth: toStr(formData.get("birth")),
    gender: toStr(formData.get("gender")),
    phone_number: toStr(formData.get("phone_number")),
    password: toStr(formData.get("password")), // opsional, jika ingin ganti password
    password_confirmation: toStr(formData.get("password_confirmation")),
  };

  // Validasi
  const validated = editStudentSchema.safeParse(rawData);
  if (!validated.success) {
    throw new Error(validated.error.errors.map((e) => e.message).join(", "));
  }

  const data = validated.data;

  if (!student_id) {
    return {
      status: 400,
      success: false,
      message: "Student ID tidak ditemukan",
    };
  }

  const student = await db.student.findUnique({
    where: { id_student: student_id },
    include: { user: true },
  });

  if (!student) {
    return { status: 404, success: false, message: "Siswa tidak ditemukan" };
  }

  // Update data student dan user
  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.student.update({
        where: { id_student: student.id_student },
        data: {
          nis: data.nis,
          father_name: data.father_name,
          mother_name: data.mother_name,
          birth: new Date(data.birth),
          class: { connect: { id_class: data.class_id } },
          user: {
            update: {
              full_name: data.full_name,
              email: data.email,
              gender: data.gender,
              address: data.address,
              phone_number: data.phone_number,
              ...(data.password
                ? { password: await bcrypt.hash(data.password, 10) }
                : {}),
            },
          },
        },
      });
    },
    "Data siswa berhasil diupdate",
    "Data siswa gagal diupdate"
  );
};

export const DeleteStudentAction = async (student_id: string): ActionType => {
  const rawData = {
    student_id: toStr(student_id),
  };

  const validatedData = deleteStudentSchema.safeParse(rawData);
  if (!validatedData.success) {
    throw new Error(
      validatedData.error.errors.map((e) => e.message).join(", ")
    );
  }

  const student = await db.student.findUnique({
    where: { id_student: validatedData.data.student_id },
    include: { user: true },
  });

  if (!student) {
    return { status: 404, success: false, message: "Siswa tidak ditemukan" };
  }

  // Hapus student dan user terkait
  return ProtectedAction(
    ["superadmin"],
    async () => {
      await db.student.delete({
        where: { id_student: validatedData.data.student_id },
      });
    },
    "Siswa berhasil dihapus",
    "Siswa gagal dihapus"
  );
};
