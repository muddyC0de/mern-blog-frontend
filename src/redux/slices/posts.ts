import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { User } from "@/app/page";
import { Comment } from "./comments";
type PostType = {
  _id: string;
  title: string;
  text: string;
  viewsCount: number;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  comments: Comment[];
  user: User;
};
interface PostsState {
  fetchGetStatus: string;
  fetchCreateStatus: string;
  posts: PostType[];
}

const initialState: PostsState = {
  fetchGetStatus: "loading",
  fetchCreateStatus: "loaded",
  posts: [],
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (option: string = "createdAt") => {
    const { data } = await axios.get("/posts", { params: { option } });
    return data;
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id: string) => {
    axios.delete(`/posts/${id}`);
  }
);

export const fetchEditPost = createAsyncThunk(
  "posts/fetchEditPost",
  async (params: {
    postInfo: { title: string; tags: string[]; text: string; imageUrl: string };
    id: string | string[];
  }) => {
    const { data } = await axios.patch(`/posts/${params.id}`, params.postInfo);
    return data;
  }
);

export const fetchCreatePost = createAsyncThunk(
  "posts/fetchCreatePost",
  async (postInfo: {
    title: string;
    tags: string[];
    text: string;
    imageUrl: string;
  }) => {
    const { data } = await axios.post("/posts/create", postInfo);
    return data;
  }
);

export const fetchPostsWithTag = createAsyncThunk(
  "posts/fetchPostsWithTag",
  async (tag: string | string[]) => {
    const { data } = await axios.get(`/posts/tags/${tag}`);
    return data;
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Отримання статтей
    builder.addCase(fetchPosts.pending, (state) => {
      state.fetchGetStatus = "loading";
    }),
      builder.addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.fetchGetStatus = "loaded";
      }),
      builder.addCase(fetchPosts.rejected, (state) => {
        state.fetchGetStatus = "error";
      });

    // Видалення статті

    builder.addCase(fetchRemovePost.pending, (state, action) => {
      console.log(action.payload);
      state.posts = state.posts.filter((post) => post._id !== action.meta.arg);
    });

    // Отриманн статті з тегом
    builder.addCase(fetchPostsWithTag.pending, (state) => {
      state.fetchGetStatus = "loading";
    }),
      builder.addCase(fetchPostsWithTag.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.fetchGetStatus = "loaded";
      }),
      builder.addCase(fetchPostsWithTag.rejected, (state) => {
        state.fetchGetStatus = "error";
      });
    // Редагування статті
    builder.addCase(fetchEditPost.pending, (state) => {
      state.fetchCreateStatus = "loading";
    }),
      builder.addCase(fetchEditPost.fulfilled, (state) => {
        state.fetchCreateStatus = "loaded";
      }),
      builder.addCase(fetchEditPost.rejected, (state) => {
        state.fetchCreateStatus = "error";
      });

    // Створення статті
    builder.addCase(fetchCreatePost.pending, (state) => {
      state.fetchCreateStatus = "loading";
    }),
      builder.addCase(fetchCreatePost.fulfilled, (state) => {
        state.fetchCreateStatus = "loaded";
      }),
      builder.addCase(fetchCreatePost.rejected, (state) => {
        state.fetchCreateStatus = "error";
      });
  },
});
export const postsReducer = postsSlice.reducer;
