import z from "zod"

// Zod Schema
export const deleteClassSchema = z.object({
  class_id: z.string().trim().min(1, "ID minimal 1 karakter"),
})

export type DeleteClassSchema = z.infer<typeof deleteClassSchema>
