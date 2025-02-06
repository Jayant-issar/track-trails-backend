import { db } from "../../utils/prisma";
import { PreparationMetric } from "../types/prepTracker";


export const createPrepMetricService = async (clerkId:string,prepMetricData:Omit<PreparationMetric, "id" | "progress" | "createdAt">) => {
    console.log("🟢 Create Prep Metric Service Started");
        
    try {
            const newPrepMetric = await db.preparationMetric.create({
                data:{
                    name:prepMetricData.name,
                    targetPerDay:{
                        create:{
                            value:prepMetricData.targetPerDay.value,
                            label:prepMetricData.targetPerDay.label
                        }
                    },
                    user:{
                        connect:{
                            clerkId
                        }
                    }


                },
                include:{
                    progress:true,
                    targetPerDay:true
                }
            })
            console.log("🟢 New Prep Metric Created = ",newPrepMetric);
            return newPrepMetric;
        } catch (error) {
            console.log("🔴 Error in createPrepMetricService = ",error);
            throw new Error("Failed to create prep metric");

        }
}

export const getDailyMetricService = async (clerkId:string, metricId:string)=>{
    console.log("🟢 Get Daily Metric Service Started");

    try {
        //get the user first to verify the owner of the metric
        const user = await db.user.findUnique({
            where:{
                clerkId
            }
        })
        if(!user) throw new Error("User not found");

        //get the metric with the progress entries
        const metric = await db.preparationMetric.findFirst({
            where:{
                id:metricId,
                userId:user.id
            },
            include:{
                progress:{
                    orderBy:{date:"desc"}
                },
                targetPerDay:true
            }
        })
        if(!metric) throw new Error("Metric not found");

        //get current date in UTC
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 86400000); // Add 24 hours

        //check for existing progress entry for the current day
        const existingProgress = metric.progress.find(progress=> {
            const progressDate = new Date(progress.date);
            return progressDate >= startOfDay && progressDate < endOfDay;
        })

        //create a new progress entry if none exists
        if(!existingProgress){
            const updatedMetric = await db.preparationMetric.update({
                where: {id:metricId},
                data:{
                    progress:{
                        create:{
                            achieved:0,
                            date: new Date() //current date in UTC
                        }
                    }
                },
                include:{
                    progress:{
                        orderBy:{date:"desc"}
                    },
                    targetPerDay:true
                }
            })
            console.log("🟢 New Progress Entry Created for Current Day");
            return updatedMetric;
        }

        //return the existing metric if it exists
        console.log("🟢 Metric already has a progress entry for the current day");
        return metric;
    } catch (error) {
        console.log("🔴 Error in getDailyMetricService = ",error);
        throw new Error("Failed to get daily metric");
    }
}

export const getAllUserMetricsService = async (clerkId: string) => {
    console.log("🟢 Get All User Metrics Service Started");
    
    try {
        // Get user with all their metrics
        const user = await db.user.findUnique({
            where: { clerkId },
            include: {
                preparationMetrics: {
                    include: {
                        progress: {
                            orderBy: { date: 'desc' }
                        },
                        targetPerDay: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) throw new Error("User not found");

        // Ensure daily progress exists for each metric
        const metricsWithDailyProgress = await Promise.all(
            user.preparationMetrics.map(async (metric) => {
                return await getDailyMetricService(clerkId, metric.id);
            })
        );

        console.log("🟢 Successfully fetched all user metrics");
        return metricsWithDailyProgress;
    } catch (error) {
        console.log("🔴 Error in getAllUserMetricsService: ", error);
        throw new Error("Failed to get user metrics");
    }
};

export const updateDailyProgressService = async (
    clerkId: string,
    metricId: string,
    delta: number // Changed from absolute value to delta
) => {
    console.log("🟢 Update Daily Progress Service Started");
    
    try {
        // Verify user and get daily metric
        const metric = await getDailyMetricService(clerkId, metricId);
        
        // Get current UTC date boundaries
        const currentDate = new Date();
        const startOfDay = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate()
        ));
        const endOfDay = new Date(startOfDay.getTime() + 86400000);

        // Find today's progress entry
        const todayProgress = metric.progress.find(p => {
            const progressDate = new Date(p.date);
            return progressDate >= startOfDay && progressDate < endOfDay;
        });

        if (!todayProgress) {
            throw new Error("No progress entry found for today");
        }

        // Calculate new achieved value
        const newAchieved = todayProgress.achieved + delta;
        
        // Validate new value
        if (newAchieved < 0) {
            throw new Error("Achieved value cannot be negative");
        }

        // Atomic update using Prisma's increment
        const updatedProgress = await db.preparationProgress.update({
            where: { id: todayProgress.id },
            data: { 
                achieved: {
                    increment: delta
                }
            },
            include: {
                metric: {
                    include: {
                        targetPerDay: true
                    }
                }
            }
        });

        // Double-check after update
        if (updatedProgress.achieved < 0) {
            // Rollback if somehow negative
            await db.preparationProgress.update({
                where: { id: todayProgress.id },
                data: { achieved: todayProgress.achieved }
            });
            throw new Error("Achieved value cannot be negative");
        }

        console.log("🟢 Daily progress updated successfully");
        return updatedProgress;
    } catch (error) {
        console.log("🔴 Error in updateDailyProgressService: ", error);
        throw new Error("Failed to update daily progress");
    }
};

export const deleteMetricService = async (clerkId:string, metricId:string)=>{
    console.log("🟢 Delete Metric Service Started");

    try {
        //get the user first to verify the owner of the metric
        const user = await db.user.findUnique({
            where:{
                clerkId
            }
        })
        if(!user) throw new Error("User not found");

        //get the metric with the progress entries
        const metric = await db.preparationMetric.findFirst({
            where:{
                id:metricId,
                userId:user.id
            }
        })
        if(!metric) throw new Error("Metric not found");

        //delete the metric
        await db.preparationMetric.delete({
            where:{
                id:metricId
            }
        })
        console.log("🟢 Metric deleted successfully");
        return true;
    } catch (error) {
        console.log("🔴 Error in deleteMetricService = ",error);
        throw new Error("Failed to delete metric");
    }

}
