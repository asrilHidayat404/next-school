import z from "zod"

// Zod Schema
export const deleteSchoolSchema = z.object({
  school_id: z.string().trim().min(1, "ID minimal 1 karakter"),
})

export type DeleteSchoolSchema = z.infer<typeof deleteSchoolSchema>
