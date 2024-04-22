import * as postService from "../services/post.service.js";
import { ErrorWithStatus } from "../exceptions/error-with-status.exception.js";
import logger from "../logger/logger.winston.js"; 

export const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.user, req.body);
    logger.info("Post created successfully");

    res.status(201).json({
      status: "success",
      post,
    });
  } catch (error) {
    logger.error(`Failed to create post: ${error.message}`);
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.postId, req.body);

    // Check if post belongs to the user initiating the request
    if (post.authorId.toString() !== req.user._id) {
      logger.error("Unauthorized update attempt");
      return res.status(401).json({
        status: "Fail",
        message: "You can only update a post you created!",
      });
    }

    logger.info("Post updated successfully");
    res.status(200).json({
      status: "success",
      post,
    });
  } catch (err) {
    logger.error(`Failed to update post: ${err.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllUserPost = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const state = req.query.state || null;

    const { totalCount, posts } = await postService.getAllUserPost(
      ownerId,
      page,
      limit,
      state
    );

    logger.info("Retrieved user posts successfully");
    res.status(200).json({
      status: "success",
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      posts,
    });
  } catch (err) {
    logger.error(`Failed to retrieve user posts: ${err.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllPublishedPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "timestamp";

    const { totalCount, posts } = await postService.getAllPublishedPosts(
      page,
      limit,
      search,
      sortBy
    );

    logger.info("Retrieved all published posts successfully");
    res.status(200).json({
      status: "success",
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      posts,
    });
  } catch (err) {
    logger.error(`Failed to retrieve published posts: ${err.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    let user = null;

    if (req.user) {
      user = req.user;
    }

    const post = await postService.getPostById(user, req.params.postId);

    if (!post) {
      logger.error("Post with given Id not found");
      return res.status(404).json({
        status: "Failed",
        message: "Post with given Id not found",
      });
    }

    await postService.incrementReadCount(post);

    logger.info("Retrieved post by Id successfully");
    res.status(200).json({
      status: "success",
      post,
    });
  } catch (err) {
    logger.error(`Failed to retrieve post by Id: ${err.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await postService.deletePost(req.params.postId, req.user._id);

    logger.info("Post deleted successfully");
    res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
    });
  } catch (err) {
    const status = err.message === "Post with given Id not found" ? 404 : 500;
    logger.error(`Failed to delete post: ${err.message}`);
    res.status(status).json({
      status: "error",
      message: err.message,
    });
  }
};
