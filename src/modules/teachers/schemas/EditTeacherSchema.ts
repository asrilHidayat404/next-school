import { z } from "zod";

export const editTeacherSchema = z
  .object({
    full_name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    nip: z.string().min(5, "NIP tidak valid"),
    gender: z.string().nonempty("Jenis kelamin wajib dipilih"),
    address: z.string(),
    phone_number: z.string(),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .optional()
      .or(z.literal("")),
    password_confirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password) return true; // skip validasi kalau password kosong
      return data.password === data.password_confirmation;
    },
    {
      message: "Password tidak cocok",
      path: ["password_confirmation"],
    }
  );

export type EditTeacherSchema = z.infer<typeof editTeacherSchema>;
