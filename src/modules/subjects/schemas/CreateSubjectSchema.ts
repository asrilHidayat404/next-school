import z from "zod"

// Zod Schema
export const createSubjectSchema = z.object({
  subject_name: z.string().min(1, "Nama minimal 1 karakter"),
  class_id: z.string(),
  school_id: z.string().optional(),
})

export type CreateSubjectSchema = z.infer<typeof createSubjectSchema>
