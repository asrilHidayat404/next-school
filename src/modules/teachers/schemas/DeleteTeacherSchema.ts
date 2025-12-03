import z from "zod"

// Zod Schema
export const deleteTeacherSchema = z.object({
  teacher_id: z.string().trim().min(1, "ID minimal 1 karakter"),
})

export type DeleteTeacherSchema = z.infer<typeof deleteTeacherSchema>
