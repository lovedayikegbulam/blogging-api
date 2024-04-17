import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validationMiddleWare } from "../middlewares/route.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const userRouter = Router();

userRouter.post(
  "/register",
  validationMiddleWare(registerSchema),
  authController.registerUser
);
userRouter.post(
  "/login",
  validationMiddleWare(loginSchema),
  authController.loginUser
);

export default userRouter;
