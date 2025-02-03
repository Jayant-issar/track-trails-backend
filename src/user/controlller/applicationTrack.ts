import { Context } from "hono";
import { createApplicationService } from "../services/applicationTracker";
import { createClerkClient } from "@clerk/backend";


export const createApplicationController = async (c:Context)=>{
    try {
        const sessionClaims = c.get('sessionClaims'); //get the session claims set by auth middleware
        const validatedData = c.get('validatedData');
        console.log('sessionClaims = ',sessionClaims);
        console.log('validatedData = ',validatedData);

        const clerkId = sessionClaims.userId;

        const newApplication = await createApplicationService(clerkId,validatedData);

        if(newApplication){
            return c.json({
                message:'Application created successfully',
                data:newApplication
            },201)
        }

        return c.json({
            message:'There was an error while creating the application',
        },500)

    } catch (error) {
        console.log(error);
        return c.json({
            message:'Failed to create application',
            error:error
        },500)

    }
}