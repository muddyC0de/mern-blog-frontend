import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as PostController from "./controllers/PostController.js";
import * as TagsController from "./controllers/TagsController.js";
import * as CommentsController from "./controllers/CommentsController.js";
import { login, register, profile } from "./controllers/UserController.js";
import handleValidationsErrors from "./utils/handleValidationsErrors.js";

mongoose
  .connect(
    "mongodb+srv://admin:4658@mern-blog.fvxsbha.mongodb.net/blog?retryWrites=true&w=majority&appName=mern-blog"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => console.log("DB error", err));

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Hello World");
});

// авторизація
app.post("/login", loginValidation, handleValidationsErrors, login);

app.post("/register", registerValidation, handleValidationsErrors, register);

app.get("/profile", checkAuth, profile);

// posts
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts/create",
  checkAuth,
  handleValidationsErrors,
  postCreateValidation,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationsErrors,
  postCreateValidation,
  PostController.update
);

// tags
app.get("/posts/tags/:tag", TagsController.getPostsWithTag);
app.get("/tags/top", TagsController.getTopTags);
app.get("/tags/:tag", TagsController.getTags);
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});

// Comments
app.get("/posts/:id/comments", CommentsController.getComments);
app.post("/posts/:id/comments", checkAuth, CommentsController.createComment);
