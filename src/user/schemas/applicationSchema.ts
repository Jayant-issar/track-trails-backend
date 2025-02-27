import z from "zod"
export const updateApplicationStatusSchema = z.object({
    id: z.string().cuid(),
    status: z.enum(["accepted","ghosted", "rejected", "waiting","interviewing"]),
})
export type updateApplicationStatusType = z.infer<typeof updateApplicationStatusSchema>