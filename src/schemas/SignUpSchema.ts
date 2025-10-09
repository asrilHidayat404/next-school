import z from "zod";

const signUpSchema = z.object({
  fullName: z.string()
    .min(6, "Nama lengkap minimal 6 karakter")
    .max(50, "Nama lengkap maksimal 50 karakter"),
  email: z.string()
    .email("Format email tidak valid"),
  password: z.string()
    .min(6, "Password minimal 6 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[0-9]/, "Password harus mengandung angka"),
  passwordConfirmation: z.string(),
}).refine(data => data.password === data.passwordConfirmation, {
  message: "Password dan konfirmasi tidak cocok",
  path: ["passwordConfirmation"],
});


type SignUpSchemaValues = z.infer<typeof signUpSchema>;

export {signUpSchema, type SignUpSchemaValues}