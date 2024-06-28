import mongoose from "mongoose";
import CommentModel from "./Comment.js";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String,
    comments: {
      type: [CommentModel],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
