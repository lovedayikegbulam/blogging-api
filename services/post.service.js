// services/postService.js
import Post from "../database/schema/post.schema.js";
import { ErrorWithStatus } from "../exceptions/error-with-status.exception.js";

export const createPost = async (title, body, userId) => {
  const newPost = new Post({ title, body, user: userId });
  return await newPost.save();
};

export const updatePost = async (postId, title, body, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorWithStatus("Post not found", 401);
  }
  if (post.user.id.toString() !== userId) {
    throw new ErrorWithStatus(
      "You are not authorized to update this post",
      403
    );
  }
  if (title) post.title = title;
  if (body) post.body = body;
  post.updatedAt = Date.now();
  return await post.save();
};

export const getAllPosts = async (limit, page, order, orderBy) => {
  try {
    // Calculate skip value based on page and limit
    const skip = (page - 1) * limit;

    // Build sort object based on orderBy and order
    const sort = {};
    sort[orderBy] = order === "desc" ? -1 : 1;

    // Fetch paginated posts with sorting
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .populate("user")
      .sort(sort);

    return posts;
  } catch (error) {
    throw new ErrorWithStatus(`Error fetching posts: ${error.message}`, 401);
  }
};

export const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate("user");
  if (!post) {
    throw new ErrorWithStatus("Post not found", 404);
  }
  return post;
};

export const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorWithStatus("Post not found", 404);
  }
  if (post.user.toString() !== userId) {
    throw new ErrorWithStatus(
      "You are not authorized to delete this post",
      401
    );
  }
  await post.deleteOne();
};
