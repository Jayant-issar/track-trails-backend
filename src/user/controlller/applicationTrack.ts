import { Context } from "hono";
import { createApplicationService, getApplicationsService } from "../services/applicationTracker";



export const createApplicationController = async (c:Context)=>{
    try {
        const sessionClaims = c.get('sessionClaims'); //get the session claims set by auth middleware
        const validatedData = c.get('validatedData');
        console.log('sessionClaims = ',sessionClaims);
        console.log('validatedData = ',validatedData)
        // Clerk stores user ID in 'sub' claim
        const clerkId = sessionClaims.sub; // Changed from userId to sub
        
        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }

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

export const getApplicationsController = async (c:Context)=>{
    try {
        const sessionClaims = c.get('sessionClaims'); //get the session claims set by auth middleware
        const clerkId = sessionClaims.sub;

        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }

        const allApplications = await getApplicationsService(clerkId);
        if(allApplications){
            return c.json({
                message:'Applications fetched successfully',
                data:allApplications
            },200)
        }
        return c.json({
            message:'There was an error while fetching applications',
        },500)
    } catch (error) {
        console.log("🔴 There was an error in the getapplication");
        return c.json({
            message:'Failed to get applications',
            error:error
        },500)
        
    }
}