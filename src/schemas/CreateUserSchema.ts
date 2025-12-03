import z from "zod"

// Zod Schema
export const createUserSchema = z.object({
  fullName: z.string().min(3, "Full Name minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  role: z.enum(["superadmin", "admin", "staff", "teacher", "student"], { required_error: "Role harus dipilih" }),
  password: z.string().min(6, "Password minimal 6 karakter"),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Password tidak cocok",
  path: ["passwordConfirmation"],
})

export type CreateUserSchema = z.infer<typeof createUserSchema>
