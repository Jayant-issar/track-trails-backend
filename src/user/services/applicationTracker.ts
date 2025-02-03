import { db } from "../../utils/prisma";
import { Application } from "../types/application";

export const createApplicationService = async (clerkId:string,applicationData:Application)=>{
    
    try {
        const application = await db.application.create({
            data:{
                appliedDate: new Date(applicationData.appliedDate),
                companyName:applicationData.companyName,
                position:applicationData.position,
                status:applicationData.status,
                method:applicationData.method,
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
        console.log("Error in createApplicationService = ",error);
        
        throw new Error("Failed to create application")
    }
    
    
}