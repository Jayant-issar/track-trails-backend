import { object } from "zod";
import { db } from "../../utils/prisma";
import { ColdApproach } from "../types/coldOutreach";
import { updateColdoutreachType } from "../schemas/coldOutreachSchemas";
import { updateApplicationStatusType } from "../schemas/applicationSchema";

export const createColdOutReachService = async (clerkId:string,coldOutReachData:ColdApproach) => {
    

    try {
        const coldOutReach = await db.coldApproach.create({
            data:{
                type:coldOutReachData.type,
                recipientName:coldOutReachData.recipientName,
                company:coldOutReachData.company,
                content:coldOutReachData.content,
                subject:coldOutReachData.subject,
                recipientEmail:coldOutReachData.recipientEmail,
                linkedinProfile:coldOutReachData.linkedinProfile,
                status:coldOutReachData.status,
                sentDate:coldOutReachData.sentDate || new Date(),
                user:{
                    connect:{
                        clerkId
                    }
                },

                
            }
        })
        console.log("coldOutReach = ",coldOutReach);
        
        return coldOutReach;
    } catch (error) {
        console.log("there was some error in createColdOutReachService = ",error);
        
        throw error;

    }
}

export const getColdOutReachService = async (clerkId:string)=>{
    try {
        const coldOutReachs = await db.coldApproach.findMany({
            where:{
                user:{
                    clerkId
                }
            }
        })
        return coldOutReachs;
    } catch (error) {
        console.log("🔴 There was an error in getColdOutreachService");
        throw new Error("Failed to get cold outreach"+ error);
        
    }
}

export const updateColdOutReachService = async (clerkId:string, coldOutReachId:string, data:updateColdoutreachType)=>{
    try {
        //filterout undefined values from the update payload
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_,value])=>value !== undefined)
        )
        const updatedColdOutReach = await db.coldApproach.update({
            where:{
                id:coldOutReachId,
                user:{
                    clerkId
                }
            },
            data:{
                ...filteredData
            }
        })

        return updatedColdOutReach
    } catch (error) {
        console.log("🔴 There was some error in updatecoldoutreach service");
        throw new Error("Failed to update cold outreach" + error)
        
    }
}

export const updateApplicationStatusService = async (clerkId:string, data:updateApplicationStatusType)=>{
    try {
        const updatedApplicationStatus = await db.application.update({
            where:{
                id:data.id,
                user:{
                    clerkId
                }
            },
            data:{
                status:data.status
            }
        })
        return updatedApplicationStatus
    } catch (error) {
        console.log("🔴 There was some error in updateApplicationStatusService");
        throw new Error("Failed to update application status" + error)
    }
}