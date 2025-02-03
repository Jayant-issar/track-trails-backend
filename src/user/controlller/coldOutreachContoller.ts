import { Context } from "hono";
import { ColdApproach } from "../types/coldOutreach";
import { createColdOutReachService } from "../services/coldOutReachService";



export const createColdOutReachController = async (c:Context)=>{
    try {
        const validatedData = c.get('validatedData') as ColdApproach;
        const sessionClaims = c.get('sessionClaims'); //get the session claims set by auth middleware
        const clerkId = sessionClaims.userId;

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