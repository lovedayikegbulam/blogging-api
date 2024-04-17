import * as postService from "../services/post.service.js";
import * as userService from "../services/user.service.js";
import { ErrorWithStatus } from "../exceptions/error-with-status.exception.js";

export const createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const userId = req.user.id;

    // Fetch user details from the database
    const user = await userService.getUserById(userId);

    // Check if user exists
    if (!user) {
      throw new ErrorWithStatus("User not found", 401);
    }

    // Create post with the user's ObjectId
    let newPost = await postService.createPost(title, body, user.id);

    // Populate the user field in the newPost object
    newPost = await newPost.populate("user");

    // Send response with the entire user object included
    res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Post creation failed", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.query.postId;
    const { title, body } = req.body;
    const userId = req.user.id;

    // Fetch user details from the database
    const user = await userService.getUserById(userId);

    // Fetch the post to check if the user is the owner
    const post = await postService.getPostById(postId);

    // Check if the user is the owner of the post in post service

    // Update the post
    let updatedPost = await postService.updatePost(postId, title, body, userId);

    // Populate user details in the updated post
    updatedPost = await updatedPost.populate("user");

    res.json({ message: "Post updated successfully", data: updatedPost });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Post update failed", error: error.message });
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
    const { postId } = req.params;
    const userId = req.user.id;

    // Fetch user details from the database
    const user = await userService.getUserById(userId);

    // Check if user exists
    if (!user) {
      throw new ErrorWithStatus("User not found", 401);
    }

    await postService.deletePost(postId, userId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Post deletion failed", error: error.message });
  }
};
