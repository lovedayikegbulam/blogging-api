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

export const getAllUserPost = async (ownerId, page, limit, state) => {
  try {
    const query = { authorId: ownerId };

    if (state) {
      query.state = state;
    }

    const totalCount = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    return { totalCount, posts };
  } catch (err) {
    throw err;
  }
};

export const getAllPublishedPosts = async (
  page = 1,
  limit = 20,
  search = "",
  sortBy = "timestamp"
) => {
  try {
    let query = { state: "published" };

    // Apply search criteria
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Count total documents for pagination
    const totalCount = await Post.countDocuments(query);

    // Apply sorting criteria
    let sortOptions = {};
    if (
      sortBy === "readCount" ||
      sortBy === "readTime" ||
      sortBy === "timestamp"
    ) {
      sortOptions[sortBy] = -1; // Default to ascending order
    }

    const posts = await Post.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    return { totalCount, posts };
  } catch (err) {
    throw err;
  }
};

export const getPostById = async (user, postId) => {
  try {
    // Await the result of the query to get the actual document
    let post = await Post.findById(postId);

    if (post) {
      const { authorId } = post;

      // console.log({ userId: user ? user._id : null, authorId: authorId });

      if (user == null) {
        post = await Post.findById(postId).where("state").eq("published");
      } else if (user !== null && authorId && authorId.toString() !== user._id) {
        post = await Post.findById(postId).where("state").eq("published");
      }
    }

    return post.populate("authorId");
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

