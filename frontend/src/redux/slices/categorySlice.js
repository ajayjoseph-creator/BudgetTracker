import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../utils/api";
import { toast } from "react-toastify";

/* ------------------------- Fetch ALL categories ------------------------- */
export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/categories"); // correct route
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Something went wrong");
    }
  }
);

/* ------------------------- Fetch category summary (monthly) ------------------------- */
export const fetchCategorySummary = createAsyncThunk(
  "category/fetchSummary",
  async (month, { rejectWithValue }) => {
    try {
      const res = await API.get(`/categories/summary?month=${month}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Summary loading failed");
    }
  }
);

/* ------------------------- Add Category ------------------------- */
export const addCategory = createAsyncThunk(
  "category/add",
  async (data, { rejectWithValue }) => {
    try {
      const month = new Date().toISOString().slice(0, 7); // auto month
      const res = await API.post("/categories", { ...data, month });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Cannot create category");
    }
  }
);

/* ------------------------- Update Category ------------------------- */
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/categories/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Cannot update category");
    }
  }
);

/* ------------------------- Delete Category ------------------------- */
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/categories/${id}`);
      return { id, msg: res.data.msg };
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Cannot delete category");
    }
  }
);

/* ------------------------- Slice ------------------------- */
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    summary: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    /* ------------------------- Fetch All ------------------------- */
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    /* ------------------------- Summary ------------------------- */
    builder
      .addCase(fetchCategorySummary.pending, (state) => { state.loading = true; })
      .addCase(fetchCategorySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchCategorySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Failed to load summary");
      });

    /* ------------------------- Add Category ------------------------- */
    builder
      .addCase(addCategory.pending, (state) => { state.loading = true; })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.summary.push(action.payload); // also push to summary for current month
        toast.success("Category added!");
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    /* ------------------------- Update Category ------------------------- */
    builder
      .addCase(updateCategory.pending, (state) => { state.loading = true; })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;

        // update both categories and summary arrays
        state.categories = state.categories.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        );
        state.summary = state.summary.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        );

        toast.success("Category updated!");
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    /* ------------------------- Delete Category ------------------------- */
    builder
      .addCase(deleteCategory.pending, (state) => { state.loading = true; })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((cat) => cat._id !== action.payload.id);
        state.summary = state.summary.filter((cat) => cat._id !== action.payload.id);
        toast.success(action.payload.msg);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export default categorySlice.reducer;
