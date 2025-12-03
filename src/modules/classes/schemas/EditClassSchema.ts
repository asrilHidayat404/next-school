import z from "zod"

// Zod Schema
export const editClassSchema = z.object({
  new_class_name: z.string().trim().min(1, "Nama minimal 1 karakter"),
  class_id: z.string().trim().min(1, "ID minimal 1 karakter"),
})

export type EditClassSchema = z.infer<typeof editClassSchema>
