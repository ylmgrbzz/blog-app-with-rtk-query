// Post model definition (MongoDB)
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
