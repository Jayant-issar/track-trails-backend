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