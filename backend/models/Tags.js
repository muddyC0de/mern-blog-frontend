import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({
  tag: {
    type: String,
    unique: true,
  },

  postsTagCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Tags", TagsSchema);
