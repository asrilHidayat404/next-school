import { z } from "zod";

export const EditUserSchema = z.object({
  full_name: z
    .string({
      required_error: "Full name is required",
      invalid_type_error: "Full name must be a text",
    })
    .min(5, "Full name must be at least 5 characters long")
    .max(100, "Full name cannot exceed 100 characters"),
  
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a text",
    })
    .min(1, "Email is required") // lebih eksplisit
    .email("Please enter a valid email address (e.g., user@example.com)"),
  
  password: z
    .string({
      invalid_type_error: "Password must be a text",
    })
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password cannot exceed 50 characters")
    .optional()
    .or(z.literal("")), // supaya kalau kosong tidak error
  
  role_id: z.enum(["1", "2"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either 1 (Admin) or 2 (User)",
  }),
});

export type EditUserFormValues = z.infer<typeof EditUserSchema>;
