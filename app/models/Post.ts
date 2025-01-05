// Post model definition (MongoDB)
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Başlık alanı zorunludur"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "İçerik alanı zorunludur"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
