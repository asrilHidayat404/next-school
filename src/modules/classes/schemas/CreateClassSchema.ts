import z from "zod"

// Zod Schema
export const createClassSchema = z.object({
  class_name: z.string().trim().min(1, "Nama minimal 1 karakter"),
  school_id: z.string().trim().min(1, "ID minimal 1 karakter"),
})

export type CreateClassSchema = z.infer<typeof createClassSchema>
