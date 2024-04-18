import * as postService from "../services/post.service.js";
import * as userService from "../services/user.service.js";
import { ErrorWithStatus } from "../exceptions/error-with-status.exception.js";

export const createPost = async (req, res) => {
  try {

    const post = await postService.createPost(req.user, req.body);

    res.status(201).json({
      status: "success",
      post,
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.postId, req.body);

    // Check if post belongs to the user initiating the request
    if (post.authorId.toString() !== req.user._id) {
      return res.status(401).json({
        status: "Fail",
        message: "You can only update a post you created!",
      });
    }

    res.status(200).json({
      status: "success",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    // Parse query parameters
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const order = req.query.order || "desc";
    const orderBy = req.query.orderBy || "createdAt";

    // Fetch paginated posts
    const posts = await postService.getAllPosts(limit, page, order, orderBy);

    // Send response with paginated posts
    res.json({ message: "All posts", data: posts });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postService.getPostById(postId);
    res.json({ message: "Post", data: post });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching post", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    
    const post = await postService.deletePost(req.params.postId, req.user._id);

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.error(err);
    const status = err.message === "Post with given Id not found" ? 404 : 500;
    res.status(status).json({
      status: "error",
      message: err.message,
    });
  }
};