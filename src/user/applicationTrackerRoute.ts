import { Hono } from "hono";
import { createApplicationController, getApplicationsController } from "./controlller/applicationTrack";
import { authMiddleware } from "./middlewares/authMiddlware";
import { validateApplication } from "./middlewares/inputValidation/applicationTrackerInputValidator";
export const applicationTrackerRouteApp = new Hono();

applicationTrackerRouteApp.post('/', authMiddleware,validateApplication ,createApplicationController)

applicationTrackerRouteApp.get("/",authMiddleware,getApplicationsController)