import z from "zod";

const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, "Password minimal 6 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[0-9]/, "Password harus mengandung angka"),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "Password dan konfirmasi tidak cocok",
  path: ["password_confirmation"],
});


type ResetPasswordSchemaValues = z.infer<typeof resetPasswordSchema>;

export {resetPasswordSchema, type ResetPasswordSchemaValues}