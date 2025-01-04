import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Başlık zorunludur"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "İçerik zorunludur"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
