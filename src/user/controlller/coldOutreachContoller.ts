import { Context } from "hono";
import { ColdApproach } from "../types/coldOutreach";
import { createColdOutReachService, getColdOutReachService, updateColdOutReachService } from "../services/coldOutReachService";
import { logger } from "hono/logger";
import { updateColdoutreachType } from "../schemas/coldOutreachSchemas";



export const createColdOutReachController = async (c:Context)=>{
    try {
        const validatedData = c.get('validatedData') as ColdApproach;
        const sessionClaims = c.get('sessionClaims');
        // auth middleware  stores user id in "sub" claim
        const clerkId = sessionClaims.sub; // Changed from userId to sub
        
        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401)
        };

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

export const getColdOutReachController = async (c:Context)=> {
    try {
        const sessionClaims = c.get('sessionClaims');
        const clerkId = sessionClaims.sub;

        if (!clerkId) {
            return c.json({ message: 'User not authenticated', success: false }, 401);
        }

        const allColdOutReachs = await getColdOutReachService(clerkId);

        if(allColdOutReachs){
            return c.json({
                message:'Cold outreach fetched successfully',
                data:allColdOutReachs,
                success:true
            },200)
        }
        return c.json({
            message:'Failed to fetch cold outreach',
            success:false
        },500)
    } catch (error) {
        console.log("🔴 There was an error in the getColdOutreachController");
        return c.json({
            message:'Failed to get cold outreach',
            success:false
        },500)
        
    }
}

export const updatecoldoutreachController = async (c:Context)=>{
    try {
        const validatedData = c.get('validatedData') as updateColdoutreachType;
        const sessionClaims = c.get("sessionClaims");

        //auth middleware  stores user id in "sub" claim
        const clerkId = sessionClaims.sub;

        if(!clerkId){
            return c.json({message:"user not authenticated", success:false}, 401)
        };

        const updatedColdOutReach = await updateColdOutReachService(clerkId, validatedData.id, validatedData)

        if(updatedColdOutReach){
            return c.json({
                message:"Coldout reach updated succesfully",
                data:updatedColdOutReach,
                success:true 
            },200)
        }
        
        return c.json({
            message:"Failed to update the cold outreach",
            success:false 
        },500)
    } catch (error) {
        console.log("🔴 there was some error in updatecoldoutreach controller = ", error);
        return c.json({
            message:"Failed to update cold outreach",
            success:false
        },500)
        
    }
}