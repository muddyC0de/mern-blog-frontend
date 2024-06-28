import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { User } from "@/app/page";

interface AuthState {
  status: string;
  data: null | User;
}

const initialState: AuthState = {
  status: "loading",
  data: null,
};

export const fetchAuth = createAsyncThunk(
  "auth/fetchAuth",
  async (params: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/login", params);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params: {
    fullname: string;
    email: string;
    password: string;
    avatarUrl: string;
  }) => {
    const { data } = await axios.post("/register", params);
    return data;
  }
);

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/profile");
  return data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAuth.pending, (state) => {
      state.status = "loading";
    }),
      builder.addCase(fetchAuth.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      }),
      builder.addCase(fetchAuth.rejected, (state, action) => {
        state.status = "error";
      });
    builder.addCase(fetchAuthMe.pending, (state) => {
      state.status = "loading";
    }),
      builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      }),
      builder.addCase(fetchAuthMe.rejected, (state) => {
        state.status = "error";
      });
    builder.addCase(fetchRegister.pending, (state) => {
      state.status = "loading";
    }),
      builder.addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      }),
      builder.addCase(fetchRegister.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { logout } = authSlice.actions;

export const selectIsAuth = (state: any) => Boolean(state.authReducer.data);

export const authReducer = authSlice.reducer;
function rejectWithValue(data: any): any {
  throw new Error("Function not implemented.");
}
