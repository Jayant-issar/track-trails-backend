import { db } from "../../utils/prisma";
import { Application } from "../types/application";

export const createApplicationService = async (clerkId:string,applicationData:Application)=>{
    
    try {
        const application = await db.application.create({
            data:{
                appliedDate:applicationData.appliedDate,
                companyName:applicationData.companyName,
                position:applicationData.position,
                status:applicationData.status,
                method:applicationData.method,
                lastUpdated:applicationData.lastUpdated,
                notes:applicationData.notes,
                contactEmail:applicationData.contactEmail,
                contactName:applicationData.contactName,
                user:{
                    connect:{
                        clerkId
                    }
                }
                
            }
        })
        return application
    } catch (error) {
        throw new Error("Failed to create application")
    }
    
    
}