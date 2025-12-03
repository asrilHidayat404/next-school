import z from "zod"

// Zod Schema
export const deleteStudentSchema = z.object({
  student_id: z.string().trim().min(1, "ID minimal 1 karakter"),
})

export type DeleteStudentSchema = z.infer<typeof deleteStudentSchema>
