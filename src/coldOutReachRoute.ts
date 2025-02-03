import { Hono } from "hono";
import { authMiddleware } from "./user/middlewares/authMiddlware";
import { validateColdOutReachInput } from "./user/middlewares/inputValidation/coldOutReachInputValidation";
import { createColdOutReachController } from "./user/controlller/coldOutreachContoller";

const coldOutReachApp = new Hono();

coldOutReachApp.post("/create", authMiddleware,validateColdOutReachInput,createColdOutReachController)

export default coldOutReachApp;
