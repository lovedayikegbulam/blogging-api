import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { validationMiddleWare } from "../middlewares/route.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
// import postSchema from "../validations/post.validation.js";

const PostRouter = Router();

PostRouter.get("/all", postController.getAllPosts);

export default PostRouter;
