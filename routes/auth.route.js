import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validationMiddleWare } from "../middlewares/route.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const UserRouter = Router();

UserRouter.post(
  "/register",
  validationMiddleWare(registerSchema),
  authController.registerUser
);
UserRouter.post(
  "/login",
  validationMiddleWare(loginSchema),
  authController.loginUser
);

export default userRouter;
