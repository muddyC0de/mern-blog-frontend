import mongoose from "mongoose";
import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";
export const getComments = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const post = await PostModel.findById(id)
      .populate({
        path: "comments",
        populate: { path: "user", select: "fullname avatarUrl" },
      })
      .exec();

    const comments = post.comments;

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Не вдалось отримати коментарі" });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text, userId } = req.body;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Пост не найден",
      });
    }

    const comment = {
      _id: new mongoose.Types.ObjectId(),
      text: text,
      user: userId,
    };

    post.comments.push(comment);

    await post.save();

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось опублікувати коментар",
    });
  }
};
