import { Hono } from "hono";
import { authMiddleware } from "./middlewares/authMiddlware";
import { validatePrepMetricInput } from "./middlewares/prepTracker";
import { createPrepMetricController, deleteMetricController, getAllUserMetricsController, getDailyMetricController, updateDailyProgressController } from "./controlller/prepTracker";
import { db } from "../utils/prisma";


export const prepTrackerApp = new Hono();

prepTrackerApp.post("/create", authMiddleware, validatePrepMetricInput, createPrepMetricController)

prepTrackerApp.get("/getall/:clerkId",async (c)=>{
    const clerkId = c.req.param("clerkId");
    try {
        const allPrepMetrics = await db.preparationMetric.findMany({
            where:{
                user:{
                    clerkId
                }
            },
            include:{
                progress:true,
                targetPerDay:true,
                user:true,
            }
        });

        return c.json({
            message:"All prep metrics fetched successfully",
            data:allPrepMetrics,
            success:true
        },200)
    } catch (error) {
        return c.json({
            message:"Failed to fetch prep metrics",
            success:false
        },500)  
    }
})

prepTrackerApp.get('/metrics/daily', getDailyMetricController);
prepTrackerApp.get('/metrics', getAllUserMetricsController);
prepTrackerApp.patch('/metrics/progress', updateDailyProgressController);
prepTrackerApp.delete('/metrics', deleteMetricController);









prepTrackerApp.get("/",(c)=>{
    return c.json({
        message:"Prep tracker route"
    })
})


