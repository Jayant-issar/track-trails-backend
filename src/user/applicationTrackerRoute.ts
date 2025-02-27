import { Hono } from "hono";
import { createApplicationController, getApplicationsController, updateApplicationStatusController } from "./controlller/applicationTrack";
import { authMiddleware } from "./middlewares/authMiddlware";
import { validateApplication } from "./middlewares/inputValidation/applicationTrackerInputValidator";
import { validateRequest } from "./middlewares/inputValidation/inputValidationMiddleware";
import { updateApplicationStatusSchema } from "./schemas/applicationSchema";
export const applicationTrackerRouteApp = new Hono();

applicationTrackerRouteApp.post('/', authMiddleware,validateApplication ,createApplicationController)
applicationTrackerRouteApp.patch("/", authMiddleware,validateRequest(updateApplicationStatusSchema), updateApplicationStatusController)
applicationTrackerRouteApp.get("/",authMiddleware,getApplicationsController)