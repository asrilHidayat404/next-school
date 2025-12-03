import z from "zod"

// Zod Schema
export const editSchoolSchema = z.object({
  new_school_name: z.string().trim().min(1, "Nama minimal 1 karakter"),
  school_id: z.string().trim().min(1, "ID minimal 1 karakter"),
})

export type EditSchoolSchema = z.infer<typeof editSchoolSchema>
