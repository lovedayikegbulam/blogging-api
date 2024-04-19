import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validationMiddleWare } from "../middlewares/route.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  validationMiddleWare(registerSchema),
  authController.registerUser
);
authRouter.post(
  "/login",
  validationMiddleWare(loginSchema),
  authController.loginUser
);

export default authRouter;
