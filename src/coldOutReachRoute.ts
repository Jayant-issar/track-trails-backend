import { Hono } from "hono";
import { authMiddleware } from "./user/middlewares/authMiddlware";
import { validateColdOutReachInput } from "./user/middlewares/inputValidation/coldOutReachInputValidation";
import { createColdOutReachController, getColdOutReachController, updatecoldoutreachController } from "./user/controlller/coldOutreachContoller";
import { validateRequest } from "./user/middlewares/inputValidation/inputValidationMiddleware";
import { updateaColdOutReachSchema } from "./user/schemas/coldOutreachSchemas";

const coldOutReachApp = new Hono();

coldOutReachApp.post("/create", authMiddleware,validateColdOutReachInput,createColdOutReachController)
coldOutReachApp.get("/",authMiddleware,getColdOutReachController)
coldOutReachApp.patch("/update",authMiddleware, validateRequest(updateaColdOutReachSchema),updatecoldoutreachController)


export default coldOutReachApp;
