//this file will contain the schemas for the on boarding process
import { z } from "zod";

export const userCreateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().optional(),
});

export const queryParamsSchema = z.object({
    clerkId: z.string().min(1, "ClerkId is required"),
});

