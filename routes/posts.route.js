import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { validationMiddleWare as validate } from "../middlewares/route.middleware.js";
import { authMiddleware as auth, authOrNot } from "../middlewares/auth.middleware.js";
import postSchema from "../validations/post.validation.js";

const PostRouter = Router();

PostRouter.get("/all", postController.getAllPublishedPost);
PostRouter.get("/posts", auth, postController.getAllUserPost);
PostRouter.get("/:postId", authOrNot, postController.getPostById);
PostRouter.post("/create", validate(postSchema), auth , postController.createPost);
PostRouter.put("/:postId", auth, postController.updatePost);
PostRouter.delete("/:postId", auth, postController.deletePost);

export default PostRouter;
