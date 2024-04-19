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

export const getAllPosts = async (limit, page, order, orderBy, searchQuery) => {
  try {
    // Calculate skip value based on page and limit
    const skip = (page - 1) * limit;

    // Build sort object based on orderBy and order
    const sort = {};
    sort[orderBy] = order === "desc" ? -1 : 1;

    // Build query object for search
    const search = {};
    if (searchQuery) {
      search["$or"] = [
        { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search
        { author: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Fetch paginated posts with sorting and search
    const posts = await Post.find(search)
      .skip(skip)
      .limit(limit)
      .populate("user")
      .sort(sort);

    return posts;
  } catch (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
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
      } else if (user !== null && authorId.toString() !== user._id) {
        post = await Post.findById(postId).where("state").eq("published");
      }
    }

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
