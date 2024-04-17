//Define schema
const PostSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      tags: [String],
      readCount: {
        type: Number,
        default: 0,
      },
      author: {
        type: String,
        required: true,
      },
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      state: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
      },
      body: {
        type: String,
        required: true,
      },
      readTime: {
        type: String,
      },
    },
    { timestamps: true }
  );

// Model
const Post = mongoose.model("Post", PostSchema);
export default User;