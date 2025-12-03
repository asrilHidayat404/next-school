import z from "zod";

export const editStudentSchema = z
  .object({
    nis: z.string().min(3, "NIS minimal 3 karakter"),
    full_name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    class_id: z.string(), // kalau siswa belum dikaitkan dengan kelas, bisa optional
    school_id: z.string(), // kalau siswa belum dikaitkan dengan kelas, bisa optional
    birth: z.string(), // bisa diubah ke z.date() kalau pakai datepicker
    father_name: z.string(),
    mother_name: z.string(),
    gender: z.string(),
    phone_number: z.string(),
    address: z.string(),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .optional()
      .or(z.literal("")),
    password_confirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password) return true; // jika password kosong, tidak usah cek
      return data.password === data.password_confirmation;
    },
    {
      message: "Password tidak cocok",
      path: ["password_confirmation"],
    }
  );

export type EditStudentSchema = z.infer<typeof editStudentSchema>;
