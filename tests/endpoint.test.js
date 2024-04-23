import request from "supertest";
import app from "../app.js";
// import connectDB from "../database/connection.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const fake_id = "6620c936502134b2bce0bbb1";
let mongoServer;

let basicUserData;

const userData = {
  firstname: "james",
  lastname: "Richard",
  email: "james@gmail.com",
  password: "password",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth Tests", () => {
  describe("Register tests", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          firstname: "james",
          lastname: "Richard",
          email: "james@gmail.com",
          password: "password",
          confirmPassword: "password",
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty("message");
          expect(res.body).toHaveProperty("data");
          expect(res.body.data).toHaveProperty("_id");

          basicUserData = { TOKEN: res.body.data.accessToken };
        });
    });
  });

  describe("Login tests", () => {
    it("should login the registered user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
            "email": "james@gmail.com",
             "password": "password"
          })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty("message");
          expect(res.body.data).toHaveProperty("accessToken");
          expect(res.body).toHaveProperty("user");
          expect(res.body.user).toHaveProperty("_id");
          expect(res.body.user.password).toBeUndefined();
          basicUserData.TOKEN = res.body.data.accessToken;
        });
    });
  });
});

describe("Post Tests", () => {
  let post_id;

  describe("Create post", () => {
    it("should create a new post", async () => {
      const postData = {
        title: "Test Post",
        description: "This is a test post",
        tags: ["test", "example"],
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      };

      const res = await request(app)
        .post("/api/posts/create")
        .send(postData)
        .set("Authorization", `Bearer ${basicUserData.TOKEN}`)
        .expect(201)

      expect(res.body).toHaveProperty("status", "success");
      expect(res.body.post).toHaveProperty("_id");
      post_id = res.body.post._id;
    });
  });

  describe("Update post", () => {
    it("should update the created post", async () => {
      const updateData = {
        title: "Updated Post Title",
        description: "Updated post description",
        tags: ["updated", "example"],
        body: "Updated body content"
      };

      const res = await request(app)
        .patch(`/api/posts/${post_id}`)
        .send(updateData)
        .set("Authorization", `Bearer ${basicUserData.TOKEN}`)
        .expect(200);

      expect(res.body).toHaveProperty("status", "success");
      expect(res.body.post).toHaveProperty("title", updateData.title);
      expect(res.body.post).toHaveProperty(
        "description",
        updateData.description
      );
      expect(res.body.post).toHaveProperty("tags", updateData.tags);
      expect(res.body.post).toHaveProperty("body", updateData.body);
    });
  });

  describe("Get post by ID", () => {
    it("should retrieve the created post by ID", async () => {
      const res = await request(app)
        .get(`/api/posts/${post_id}`)
        .set("Authorization", `Bearer ${basicUserData.TOKEN}`)
        .expect(200);

      expect(res.body).toHaveProperty("status", "success");
      expect(res.body.post).toHaveProperty("_id", post_id);
    });
  });

  describe("Get all published posts", () => {
    it("should retrieve all published posts", async () => {
      const res = await request(app).get("/api/posts/all").expect(200);

      expect(res.body).toHaveProperty("status", "success");
      expect(Array.isArray(res.body.posts)).toBe(true);
    });
  });

  describe("Get user's posts", () => {
    it("should retrieve all posts of the authenticated user", async () => {
      const res = await request(app)
        .get("/api/posts/user")
        .set("Authorization", `Bearer ${basicUserData.TOKEN}`)
        .expect(200);

      expect(res.body).toHaveProperty("status", "success");
      expect(Array.isArray(res.body.posts)).toBe(true);
    });
  });

  describe("Delete post", () => {
    it("should delete the created post", async () => {
      await request(app)
        .delete(`/api/posts/${post_id}`)
        .set("Authorization", `Bearer ${basicUserData.TOKEN}`)
        .expect(200);

      // Verify if the post is deleted
      const deletedPost = await request(app)
        .get(`/api/posts/${post_id}`)
        .set("Authorization", `Bearer ${basicUserData.TOKEN}`)
        .expect(500);

      expect(deletedPost.body).toHaveProperty("status", "error");
    });
  });
});
