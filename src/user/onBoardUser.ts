import { Hono } from "hono";
import { db } from "../utils/prisma";
import { validateOnBoardingInput } from "./middlewares/onBoardingInputValidationMiddleware";
import { queryParamsSchema } from "./schemas/onBoardingSchemas";
import { userCreateSchema } from "./schemas/onBoardingSchemas";
import { z } from "zod";

type OnBoardingInput = z.infer<typeof userCreateSchema> & z.infer<typeof queryParamsSchema> 
type Variables = {
    validatedInput: OnBoardingInput;
};

const onBoardUserApp = new Hono<{Variables: Variables}>()



onBoardUserApp.post('/', validateOnBoardingInput, async (c) => {
    try {
        const {clerkId,email,name,password} = c.get("validatedInput")

        const existingUser = await db.user.findUnique({
            where: {
                clerkId
            }
        })

        if (existingUser) {
            return c.json({
                success: true,
                message: 'User already exists',
                data: existingUser
            }, 200);
        }

        const newUser = await db.user.create({
            data:{
                clerkId,
                email,
                name,
                password
            }
        })

        return c.json({
            success: true,
            message: 'User created successfully',
            data: newUser
        }, 201);
    } catch (error) {
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return c.json({
                success: false,
                message: 'Email already in use'
            }, 409);
        }

        return c.json({
            success: false,
            message: 'Failed to create user'
        }, 500);
    }
})

export default onBoardUserApp
