import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../utils/api";
import { toast } from "react-toastify";

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/signup", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      toast.info("Logged out!", { position: "bottom-right" });
    },
  },

  extraReducers: (builder) => {
   
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;

        toast.success("Account created successfully",);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg;

        toast.error(action.payload.msg || "Signup failed!",);
      });

    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;

        toast.success("Logged in successfully!", {
          position: "bottom-right",
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg;

        toast.error(action.payload.msg || "Login failed!", {
          position: "bottom-right",
        });
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
