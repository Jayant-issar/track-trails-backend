import {z} from "zod"




export const updateaColdOutReachSchema = z.object({
    id: z.string().cuid(),
    type: z.enum(["email" , "message" ,"linkedin_dm"]).optional(),
    recipientName: z.string().optional(),
    company: z.string().optional(),
    content:z.string().optional(),
    subject: z.string().optional(),
    recipientEmail: z.string().optional(),
    linkedinProfile: z.string().optional(),
    status: z.enum(["unseen" ,"ghosted", "rejected", "waiting","replied"]).optional(),
    sentDate: z.string().optional()
})
export type updateColdoutreachType = z.infer<typeof updateaColdOutReachSchema>


