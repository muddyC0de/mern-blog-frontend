import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export type Comment = {
  _id: string;
  userId: string;
  text: string;
  createdAt: string;
};

interface CommentsState {
  comments: Comment[];
  status: string;
}

const initialState: CommentsState = {
  comments: [],
  status: "loading",
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId: string | string[]) => {
    const { data } = await axios.get(`/posts/${postId}/comments`);
    return data;
  }
);

export const fetchCreateComment = createAsyncThunk(
  "comments/fetchCreateComment",
  async (params: {
    postId: string | string[];
    userId: string;
    text: string;
  }) => {
    const { postId, userId, text } = params;
    const { data } = await axios.post(`/posts/${postId}/comments`, {
      userId,
      text,
    });
    return data;
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchComments.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.status = "loaded";
      state.comments = action.payload;
    });
    builder.addCase(fetchComments.rejected, (state) => {
      state.status = "error";
    });

    builder.addCase(fetchCreateComment.fulfilled, (state, action) => {
      state.status = "loaded";
      state.comments.push(action.payload);
    });
    builder.addCase(fetchCreateComment.rejected, (state) => {
      state.status = "error";
    });
  },
});

export const commentsReducer = commentsSlice.reducer;
