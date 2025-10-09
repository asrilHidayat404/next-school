import z from "zod";

export const updateInfoSchema = z.object({
  full_name: z
    .string()
    .min(5, "Nama minimal 5 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email tidak boleh kosong")
    .email("Format email tidak valid"),
});

export type UpdateInfoFormValues = z.infer<typeof updateInfoSchema>;

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(6, "Password saat ini minimal 6 karakter"),
    password: z.string().min(6, "Password baru minimal 6 karakter"),
    password_confirmation: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password dan konfirmasi tidak cocok",
    path: ["password_confirmation"],
  });

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
