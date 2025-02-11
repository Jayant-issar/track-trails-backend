import { Context } from "hono";
import { PreparationMetric } from "../types/prepTracker";
import { createPrepMetricService, deleteMetricService, getAllUserMetricsService, getDailyMetricService, updateDailyProgressService } from "../services/prepTracker";




export const createPrepMetricController = async (c:Context)=>{
    try {
        const validatedData = c.get('validatedData') as PreparationMetric; //getting validated data which input validation middleware had set
        const sessionClaims = c.get('sessionClaims');
        // Clerk stores user ID in 'sub' claim
        const clerkId = sessionClaims.sub; // Changed from userId to sub
        
        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }

        console.log("🟢 Clerk ID: ", clerkId);


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

export const getDailyMetricController = async (c: Context) => {
    try {
        const sessionClaims = c.get('sessionClaims');
        // Clerk stores user ID in 'sub' claim
        const clerkId = sessionClaims.sub; // Changed from userId to sub
        
        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }
        const metricId = c.req.query().metricId;

        if (!metricId) {
            return c.json({ message: 'Metric ID required', success: false }, 400);
        }

        const metric = await getDailyMetricService(clerkId, metricId);
        return c.json({
            message: 'Daily metric fetched successfully',
            data: metric,
            success: true
        }, 200);

    } catch (error) {
        console.log("🔴 Error in getDailyMetricController: ", error);
        return c.json({
            message: error instanceof Error ? error.message : 'Failed to fetch daily metric',
            success: false
        }, 500);
    }
}

export const getAllUserMetricsController = async (c: Context) => {
    try {
        const sessionClaims = c.get('sessionClaims');
        // Clerk stores user ID in 'sub' claim
        const clerkId = sessionClaims.sub; // Changed from userId to sub
        
        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }

        const metrics = await getAllUserMetricsService(clerkId);
        return c.json({
            message: 'User metrics fetched successfully',
            data: metrics,
            success: true
        }, 200);

    } catch (error) {
        console.log("🔴 Error in getAllUserMetricsController: ", error);
        return c.json({
            message: error instanceof Error ? error.message : 'Failed to fetch user metrics',
            success: false
        }, 500);
    }
}

export const updateDailyProgressController = async (c: Context) => {
    try {
        const sessionClaims = c.get('sessionClaims');
        // Clerk stores user ID in 'sub' claim
        const clerkId = sessionClaims.sub; // Changed from userId to sub
        
        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }
        const metricId = c.req.query().metricId;
        const { delta } = await c.req.json();
        
        if (!delta) {
            return c.json({ message: 'Delta required', success: false }, 400);
        }
        
        if (!metricId) {
            return c.json({ message: 'Metric ID required', success: false }, 400);
        }

        const updatedProgress = await updateDailyProgressService(clerkId, metricId, delta);
        return c.json({
            message: 'Progress updated successfully',
            data: updatedProgress,
            success: true
        }, 200);

    } catch (error) {
        console.log("🔴 Error in updateDailyProgressController: ", error);
        return c.json({
            message: error instanceof Error ? error.message : 'Failed to update progress',
            success: false
        }, 500);
    }
}

export const deleteMetricController = async (c: Context) => {
    try {
        const sessionClaims = c.get('sessionClaims');
        // Clerk stores user ID in 'sub' claim
        const clerkId = sessionClaims.sub; // Changed from userId to sub
        
        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }
        const metricId = c.req.query().metricId;

        if (!metricId) {
            return c.json({ message: 'Metric ID required', success: false }, 400);
        }

        await deleteMetricService(clerkId, metricId);
        return c.json({
            message: 'Metric deleted successfully',
            success: true
        }, 200);

    } catch (error) {
        console.log("🔴 Error in deleteMetricController: ", error);
        return c.json({
            message: error instanceof Error ? error.message : 'Failed to delete metric',
            success: false
        }, 500);
    }
}