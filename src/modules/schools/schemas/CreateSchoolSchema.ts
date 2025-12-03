import z from "zod"

// Zod Schema
export const createSchoolSchema = z.object({
  school_name: z.string().min(3, "Nama minimal 3 karakter"),
})

export type CreateSchoolSchema = z.infer<typeof createSchoolSchema>
