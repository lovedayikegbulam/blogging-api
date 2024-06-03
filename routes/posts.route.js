import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { validationMiddleWare as validate } from "../middlewares/route.middleware.js";
import { authMiddleware as auth, authOrNot } from "../middlewares/auth.middleware.js";
import { postSchema, updatePostSchema } from '../validations/post.validation.js';


const PostRouter = Router();

PostRouter.get("/all", postController.getAllPublishedPost); 
PostRouter.get("/user", auth, postController.getAllUserPost);
PostRouter.get("/:postId", authOrNot, postController.getPostById);
PostRouter.post("/create", validate(postSchema), auth , postController.createPost);
PostRouter.patch("/:postId",validate(updatePostSchema), auth, postController.updatePost);
PostRouter.delete("/:postId", auth, postController.deletePost);

export default PostRouter;
