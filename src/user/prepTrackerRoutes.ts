import { Hono } from "hono";
import { authMiddleware } from "./middlewares/authMiddlware";
import { validatePrepMetricInput } from "./middlewares/prepTracker";
import { createPrepMetricController } from "./controlller/prepTracker";


export const prepTrackerApp = new Hono();

prepTrackerApp.post("/create", authMiddleware, validatePrepMetricInput, createPrepMetricController)

prepTrackerApp.get("/",(c)=>{
    return c.json({
        message:"Prep tracker route"
    })
})


