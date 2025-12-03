import z from "zod";

// Zod Schema
export const createTeacherSchema = z
  .object({
    full_name: z.string().min(3, "Full Name minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    password_confirmation: z.string(),
    nip: z.string().min(3, "NIP minimal 3 karakter"),
    gender: z.string(),
    phone_number: z.string(),
    address: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak cocok",
    path: ["passwordConfirmation"],
  });

export type CreateTeacherSchema = z.infer<typeof createTeacherSchema>;

// model Teacher {
//   id_teacher          String  @id @default(cuid())
//   nip                 String
//   user_id             String  @unique
//   user                User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
//   teaching_classes_id String?

//    // 🔹 Relasi 1-1: wali kelas
//   homeroom_of SchoolClass? @relation("HomeroomTeacher")

//   teaching_classes SchoolClass? @relation("TeachingClasses", fields: [teaching_classes_id], references: [id_class], onDelete: Cascade, onUpdate: Cascade)

//   @@map("teachers")
