import { db } from "../../utils/prisma";
import { ColdApproach } from "../types/coldOutreach";


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
