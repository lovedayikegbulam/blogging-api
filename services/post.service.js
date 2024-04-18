// services/postService.js
import Post from "../database/schema/post.schema.js";
import * as userService from "../services/user.service.js";
import { ErrorWithStatus } from "../exceptions/error-with-status.exception.js";



export const createPost = async (userData, postData) => {
  const { title, description, tags, body } = postData;

  // Calculate read time of post from the body passed in
  const wpm = 225; // wpm => word per minute
  const numberOfWords = body.trim().split(/\s+/).length;
  const readTime = Math.ceil(numberOfWords / wpm);

  // Get author name and author Id
  const { firstname, lastname } = userData;
  const author = `${firstname} ${lastname}`;
  const authorId = userData._id;

  // Create the post
  const post = await Post.create({
    title,
    description,
    tags,
    body,
    author,
    authorId,
    readTime,
  });

  // Add the new created post to 'posts' array property on the user document
  let user = await userService.getUserById(userData._id);
  user.posts.push(post._id);
  await user.save(); // Save changes made to the user doc

  return post;
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
