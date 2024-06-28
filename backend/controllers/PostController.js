import PostModel from "../models/Post.js";
import TagModel from "../models/Tags.js";
import ViewsLogsModel from "../models/ViewsLogs.js";
import extIP from "ext-ip";
const getIP = extIP();
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    for (let tag of req.body.tags) {
      await TagModel.findOneAndUpdate(
        { tag: tag },
        { $inc: { postsTagCount: 1 } },
        { upsert: true, new: true }
      );
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Не вдалось створити статтю",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { option } = req.query;
    const sortOptions = {};
    sortOptions[option] = -1;
    const posts = await PostModel.find()
      .sort(sortOptions)
      .populate({ path: "user", select: "fullname avatarUrl createdAt" })
      .exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Не вдалось отримати статті",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const ip = await getIP();

    const log = await ViewsLogsModel.findOne({ log: `${postId}/${ip}` });
    const post = await PostModel.findById(postId)
      .populate({ path: "user", select: "fullname avatarUrl createdAt" })
      .exec();
    if (!post) {
      return res.status(404).json({
        message: "Стаття не знайдена",
      });
    }

    if (!log) {
      post.viewsCount += 1;
      await post.save();
      const doc = new ViewsLogsModel({
        log: `${postId}/${ip}`,
      });
      await doc.save();
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Не вдалось отримати статтю",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await PostModel.findByIdAndDelete({ _id: postId });
    if (!deletedPost) {
      return res.status(404).json({
        message: "Стаття не знайдена",
      });
    }
    for (let tag of deletedPost.tags) {
      await TagModel.findOneAndUpdate(
        { tag: tag },
        { $inc: { postsTagCount: -1 } }
      );

      await TagModel.deleteOne({ tag: tag, postsTagCount: { $lte: 0 } });
    }
    res.json({ succes: true });
  } catch (error) {
    res.status(500).json({
      message: "Не вдалось видалити статтю",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
      }
    );

    res.json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Не вдалось оновити статтю",
    });
  }
};
