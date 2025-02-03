import { Context } from "hono";
import { PreparationMetric } from "../types/prepTracker";
import { createPrepMetricService } from "../services/prepTracker";




export const createPrepMetricController = async (c:Context)=>{
    try {
        const validatedData = c.get('validatedData') as PreparationMetric; //getting validated data which input validation middleware had set
        const sessionClaims = c.get('sessionClaims'); //get the session claims set by auth middleware
        const clerkId = sessionClaims.userId;

        const newPrepMetric = await createPrepMetricService(clerkId,validatedData);
        if(newPrepMetric) {
            return c.json({
                message:'Prep metric created successfully',
                data:newPrepMetric,
                success:true
            },201)
        }
        return c.json({
            message:'Failed to create prep metric',
            success:false
        },500)
            

    } catch (error) {
        console.log("🔴 Error in createPrepMetricController = ",error);
        return c.json({
            message:'Failed to create prep metric',
            success:false
        },500)
        

    }
}