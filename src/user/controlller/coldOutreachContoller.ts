import { Context } from "hono";
import { ColdApproach } from "../types/coldOutreach";
import { createColdOutReachService } from "../services/coldOutReachService";



export const createColdOutReachController = async (c:Context)=>{
    try {
        const validatedData = c.get('validatedData') as ColdApproach;
        const sessionClaims = c.get('sessionClaims');
        // Clerk stores user ID in 'sub' claim
        const clerkId = sessionClaims.sub; // Changed from userId to sub
        
        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }

        const newColdOutReach = await createColdOutReachService(clerkId, validatedData);
        if(newColdOutReach){
            return c.json({
                message:'Cold outreach created successfully',
                data:newColdOutReach,
                success:true
            },201)
        }
        return c.json({
            message:'Failed to create cold outreach',
            success:false
        },500)

    } catch (error) {
        console.log("there was some error in createColdOutReachController = ",error);
        return c.json({
            message:'Failed to create cold outreach',
            success:false
        },500)
    }
}