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

export const updatePost = async (postId, postData) => {
  const { state, title, description, tags, body } = postData;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $set: { state, title, description, tags, body },
      },
      { new: true }
    );
    return post;
  } catch (err) {
    throw err;
  }
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
  try {
    const post = await Post.findById(postId).where("state").eq("published");
    return post;
  } catch (err) {
    throw err;
  }
};

export const incrementReadCount = async (post) => {
  try {
    post.readCount += 1;
    await post.save();
  } catch (err) {
    throw err;
  }
};

export const deletePost = async (postId, userId) => {
  try {
    const post = await Post.findOneAndDelete({ _id: postId, authorId: userId });

    if (!post) {
      throw new Error("Post with given Id not found");
    }

    // Delete post from 'posts' array in user document
    const user = await userService.getUserById(userId);
    user.posts.pull(post._id);
    await user.save();

    return post;
  } catch (err) {
    throw new ErrorWithStatus(`Post deletion failed: ${err.message}`, 400);
  }
};
