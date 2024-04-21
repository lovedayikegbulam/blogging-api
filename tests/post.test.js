// Import necessary modules and functions
import * as postService from "../services/post.service.js";
import Post from "../database/schema/post.schema.js";
import * as userService from "../services/user.service.js";
import { ErrorWithStatus } from "../exceptions/error-with-status.exception.js";

// Mock Post model
jest.mock("../database/schema/post.schema.js");
// Mock user service
jest.mock("../services/user.service.js");

describe("createPost", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new post", async () => {
    // Define test data
    const userData = {
      _id: "user123",
      firstname: "John",
      lastname: "Doe",
    };
    const postData = {
      title: "Test Title",
      description: "Test Description",
      tags: ["tag1", "tag2"],
      body: "Test Body",
    };
    const expectedPost = {
      _id: "generatedId",
      ...postData,
      author: `${userData.firstname} ${userData.lastname}`,
      authorId: userData._id,
      readTime: 1, // Assuming 1 word per minute for testing
    };

    // Mock the behavior of the Post model's create method
    const createMock = jest.fn().mockResolvedValue(expectedPost);
    Post.create.mockImplementation(createMock);

    // Mock the behavior of the userService.getUserById method
    const getUserByIdMock = jest.fn().mockResolvedValue({
      _id: userData._id,
      posts: [],
      save: jest.fn().mockResolvedValue(),
    });
    userService.getUserById.mockImplementation(getUserByIdMock);

    // Call the createPost function
    const result = await postService.createPost(userData, postData);

    // Verify that Post.create was called with the correct arguments
    expect(Post.create).toHaveBeenCalledWith({
      title: postData.title,
      description: postData.description,
      tags: postData.tags,
      body: postData.body,
      author: `${userData.firstname} ${userData.lastname}`,
      authorId: userData._id,
      readTime: 1, // Assuming 1 word per minute for testing
    });

    // Verify that userService.getUserById was called with the correct user ID
    expect(userService.getUserById).toHaveBeenCalledWith(userData._id);

    // Verify that the returned post matches the expected structure
    expect(result).toEqual(expectedPost);
  });
});

describe("updatePost", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a post with correct data", async () => {
    // Define test data
    const postId = "post123";
    const postData = {
      state: "published",
      title: "Updated Title",
      description: "Updated Description",
      tags: ["update", "jest"],
      body: "Updated Body",
    };

    // Mock the behavior of Post.findByIdAndUpdate
    const updatedPost = { _id: postId, ...postData };
    jest.spyOn(Post, "findByIdAndUpdate").mockResolvedValue(updatedPost);

    // Call the updatePost function
    const result = await postService.updatePost(postId, postData);

    // Verify that Post.findByIdAndUpdate was called with the correct parameters
    expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
      postId,
      { $set: postData },
      { new: true }
    );

    // Verify that the result matches the updated post data
    expect(result).toEqual(updatedPost);
  });

  it("should throw an error if updating the post fails", async () => {
    // Define test data
    const postId = "post123";
    const postData = {
      state: "published",
      title: "Updated Title",
      description: "Updated Description",
      tags: ["update", "jest"],
      body: "Updated Body",
    };
    const errorMessage = "Error updating post";

    // Mock the behavior of Post.findByIdAndUpdate to throw an error
    jest
      .spyOn(Post, "findByIdAndUpdate")
      .mockRejectedValue(new Error(errorMessage));

    // Call the updatePost function and expect it to throw an error
    await expect(postService.updatePost(postId, postData)).rejects.toThrowError(
      errorMessage
    );
  });
});

describe("getAllUserPost", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all posts of a user", async () => {
    // Define test data
    const ownerId = "user123";
    const page = 1;
    const limit = 10;
    const state = "published";

    // Mocked array of posts
    const posts = [
      { _id: "1", title: "Post 1", body: "Body 1", authorId: ownerId },
      { _id: "2", title: "Post 2", body: "Body 2", authorId: ownerId },
      // Add more mocked posts as needed
    ];

    // Mock the behavior of the Post model's countDocuments and find methods
    jest.spyOn(Post, "countDocuments").mockResolvedValue(posts.length);
    jest.spyOn(Post, "find").mockReturnValue({
      post: posts,
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    });

    // Call the getAllUserPost function
    const result = await postService.getAllUserPost(
      ownerId,
      page,
      limit,
      state
    );

    // Verify that the result matches the expected posts
    expect(result).toEqual({
      totalCount: posts.length,
      posts: {
        post: posts,
        limit: expect.any(Function),
        skip: expect.any(Function),
      },
    });
  });

  it("should throw an error if an error occurs while fetching user posts", async () => {
    // Define test data
    const ownerId = "user123";
    const page = 1;
    const limit = 10;
    const state = "published";
    const errorMessage = "Error fetching user posts";

    // Mock the behavior of the Post model's countDocuments method to throw an error
    jest
      .spyOn(Post, "countDocuments")
      .mockRejectedValue(new Error(errorMessage));

    // Call the getAllUserPost function and expect it to throw an error
    await expect(
      postService.getAllUserPost(ownerId, page, limit, state)
    ).rejects.toThrowError(errorMessage);
  });
});

describe("getAllPublishedPosts", () => {
  it("should return all published posts", async () => {
    // Mocking Post.countDocuments to return a totalCount
    const totalCount = 10;
    jest.spyOn(Post, "countDocuments").mockResolvedValue(totalCount);

    // Mocking Post.find to return an array of posts
    const posts = [
      {
        _id: "1",
        title: "Post 1",
        body: "Body 1",
        author: "Author 1",
        tags: ["tag1", "tag2"],
      },
      {
        _id: "2",
        title: "Post 2",
        body: "Body 2",
        author: "Author 2",
        tags: ["tag3", "tag4"],
      },
    ];

    jest.spyOn(Post, "find").mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      posts: posts,
    });

    // Define test parameters
    const page = 1;
    const limit = 20;
    const search = "";
    const sortBy = "timestamp";

    // Call the getAllPublishedPosts function
    const result = await postService.getAllPublishedPosts(
      page,
      limit,
      search,
      sortBy
    );

    // Check if totalCount and posts are returned correctly
    expect(result.totalCount).toEqual(totalCount);

    // Verify that the return value is an object
    expect(result).toBeInstanceOf(Object);
  });

  it("should throw an error if an error occurs while fetching published posts", async () => {
    // Mocking Post.countDocuments to throw an error
    const errorMessage = "Error fetching published posts";
    jest
      .spyOn(Post, "countDocuments")
      .mockRejectedValue(new Error(errorMessage));

    // Define test parameters
    const page = 1;
    const limit = 20;
    const search = "";
    const sortBy = "timestamp";

    // Call the getAllPublishedPosts function and expect it to throw an error
    await expect(
      postService.getAllPublishedPosts(page, limit, search, sortBy)
    ).rejects.toThrowError(errorMessage);
  });
});

// describe('getPostById', () => {
//   afterEach(() => {
//     jest.clearAllMocks(); // Clear mocks after each test
//   });

//   it('should return a published post for a non-authenticated user', async () => {
//     // Mock the Post model's findById method to return a post
//     const mockPost = {
//       _id: 'mockPostId',
//       title: 'Mock Post',
//       state: 'published',
//       authorId: 'mockAuthorId'
//     };
//     jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);

//     // Call the getPostById function with a null user (non-authenticated)
//     const result = await postService.getPostById(null, 'mockPostId');

//     // Expect the result to match the mock post
//     expect(result).toEqual(mockPost);
//   });

//   it('should return a published post for an authenticated user who is not the author', async () => {
//     // Mock the Post model's findById method to return a post
//     const mockPost = {
//       _id: 'mockPostId',
//       title: 'Mock Post',
//       state: 'published',
//       authorId: 'mockAuthorId'
//     };
//     jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);

//     // Call the getPostById function with an authenticated user who is not the author
//     const result = await postService.getPostById({ _id: 'mockUserId' }, 'mockPostId');

//     // Expect the result to match the mock post
//     expect(result).toEqual(mockPost);
//   });

//   it('should return a post for an authenticated user who is the author', async () => {
//     // Mock the Post model's findById method to return a post
//     const mockPost = {
//       _id: 'mockPostId',
//       title: 'Mock Post',
//       state: 'published',
//       authorId: 'mockUserId' // Same as the user's ID
//     };
//     jest.spyOn(Post, "findById").mockReturnValue({
//       populate: jest.fn().mockReturnThis(),
//       post: mockPost
//     });

//     // Call the getPostById function with an authenticated user who is the author
//     const result = await postService.getPostById({ _id: 'mockUserId' }, 'mockPostId');

//     // Expect the result to match the mock post
//     expect(result).toEqual({
//       post: post,
//       populate: expect.any(Function)
//     });
//   });

//   it('should throw an error if an error occurs while fetching the post', async () => {
//     // Mock the Post model's findById method to throw an error
//     const errorMessage = 'Error fetching post';
//     jest.spyOn(Post, 'findById').mockRejectedValue(new Error(errorMessage));

//     // Call the getPostById function and expect it to throw an error
//     await expect(postService.getPostById({ _id: 'mockUserId' }, 'mockPostId')).rejects.toThrowError(errorMessage);
//   });
// });

describe("getPostById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch a post by ID", async () => {
    // Define test data
    const postId = "post123";
    const userId = "user123";

    // Mocked post
    const post = {
      _id: postId,
      user: userId,
      populate: jest.fn().mockResolvedValueOnce({
        _id: postId,
        title: "Test Post",
        body: "Test Body",
        authorId: userId,
      }),
    };

    // Mock the behavior of the Post model's findById method
    jest.spyOn(Post, "findById").mockResolvedValueOnce(post);

    // Call the getPostById function
    const result = await postService.getPostById(postId);

    // Verify that the findById method was called with the correct postId
    // expect(Post.findById).toHaveBeenCalledWith(postId);

    // Verify that the populate method was called on the post
    expect(post.populate).toHaveBeenCalledWith("authorId");

    // Verify that the result matches the expected post
    expect(result).toEqual({
      _id: postId,
      title: "Test Post",
      body: "Test Body",
      authorId: userId,
    });
  });
  
  it("should throw an error if post is not found", async () => {
    // Define test data
    const postId = "invalidId";
    const userId = "user123";

    // Mock the behavior of Post.findOneAndDelete to return null
    Post.findOneAndDelete.mockResolvedValueOnce(null);

    // Call the deletePost function and expect it to throw an error
    await expect(postService.deletePost(postId, userId)).rejects.toThrow(Error);

    // Expectations
    expect(Post.findOneAndDelete).toHaveBeenCalledWith({
      _id: postId,
      authorId: userId,
    });
    expect(userService.getUserById).not.toHaveBeenCalled();
  });
});

// Define a mock implementation for the Post.findOneAndDelete method
Post.findOneAndDelete = jest.fn();

// Define a mock implementation for the userService.getUserById method
userService.getUserById = jest.fn();

describe("deletePost", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if post is not found", async () => {
    // Define test data
    const postId = "invalidId";
    const userId = "user123";

    // Mock the behavior of findOneAndDelete
    Post.findOneAndDelete.mockResolvedValueOnce(null);

    // Call the deletePost function and expect it to throw an error
    await expect(postService.deletePost(postId, userId)).rejects.toThrow(
      "Post with given Id not found"
    );

    // Expectations
    expect(Post.findOneAndDelete).toHaveBeenCalledWith({
      _id: postId,
      authorId: userId,
    });
    expect(userService.getUserById).not.toHaveBeenCalled();
  });

  it("should throw an error if user is not authorized to delete post", async () => {
    // Define test data
    const postId = "post123";
    const userId = "user456";
    const postAuthorId = "user123";

    // Mock the behavior of findOneAndDelete
    Post.findOneAndDelete.mockResolvedValueOnce({ authorId: postAuthorId });

    // Call the deletePost function and expect it to throw an error
    await expect(postService.deletePost(postId, userId)).rejects.toThrow(
      "Post deletion failed"
    );

    // Expectations
    expect(Post.findOneAndDelete).toHaveBeenCalledWith({
      _id: postId,
      authorId: userId,
    });
    expect(userService.getUserById).toHaveBeenCalled();
  });
});
