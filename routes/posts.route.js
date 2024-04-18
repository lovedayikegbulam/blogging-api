import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { validationMiddleWare } from "../middlewares/route.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import postSchema from "../validations/post.validation.js";

const PostRouter = Router();

PostRouter.get("/all", postController.getAllPosts);
PostRouter.post(
  "/create",
  validationMiddleWare(postSchema),
  authMiddleware,
  postController.createPost
);
PostRouter.put(
  "/:postId",
  authMiddleware,
  postController.updatePost
);
PostRouter.delete("/:postId", authMiddleware, postController.deletePost);

export default PostRouter;
