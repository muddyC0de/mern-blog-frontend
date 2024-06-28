import PostModel from "../models/Post.js";
import TagModel from "../models/Tags.js";

export const getPostsWithTag = async (req, res) => {
  try {
    const tag = req.params.tag;

    const posts = await PostModel.find({ tags: { $in: [tag] } })
      .populate("user")
      .exec();

    if (posts.length) {
      return res.json(posts);
    }
    res.status(404).json({
      message: "Статті з заданим тегом не знайдені",
    });
  } catch (error) {
    res.status(500).json({
      message: "Не вдалось отримати статті",
    });
  }
};

export const getTopTags = async (req, res) => {
  try {
    const topTags = await TagModel.aggregate([
      {
        $sort: {
          postsTagCount: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.json(topTags);
  } catch (error) {
    res.status(500).json({
      message: "Не вдалося отримати найпопулярніші теги",
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const tag = req.params.tag;
    const tags = await TagModel.find({
      tag: { $regex: tag, $options: "i" },
    }).limit(5);

    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "Не вдалося отримати теги",
    });
  }
};
