import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../utils/api";
import { toast } from "react-toastify";

// 1️⃣ Add Expense
export const addExpense = createAsyncThunk(
  "expense/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/expenses", data);
      return res.data; // { status, expense }
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to add expense");
    }
  }
);

// 2️⃣ Update Expense
export const updateExpense = createAsyncThunk(
  "expense/update",
  async ({ expenseId, updates }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/expenses/${expenseId}`, updates);
      return res.data.expense; // updated expense
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to update expense");
    }
  }
);

// 3️⃣ Fetch Monthly Expenses
export const fetchMonthlyExpenses = createAsyncThunk(
  "expense/fetchMonthly",
  async (month, { rejectWithValue }) => {
    try {
      const res = await API.get(`/expenses?month=${month}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Unable to fetch expenses");
    }
  }
);

// 4️⃣ Fetch Recent Activity (last 10)
export const fetchRecentExpenses = createAsyncThunk(
  "expense/fetchRecent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/expenses/recent");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to load recent expense list");
    }
  }
);

// 5️⃣ Delete Expense
export const deleteExpense = createAsyncThunk(
  "expense/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/expenses/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue("Could not delete expense");
    }
  }
);

// 6️⃣ Fetch Category Summary (Dashboard)
export const fetchCategorySummary = createAsyncThunk(
  "expense/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/expenses/summary");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to load category summary");
    }
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    recent: [],
    summary: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // ADD EXPENSE
    builder
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload.expense);
        toast.success(
          action.payload.status === "over"
            ? "Over budget ❌"
            : "Expense added ✅"
        );
        // Update summary immediately
        state.summary = state.summary.map((cat) =>
          cat._id === action.payload.expense.categoryId
            ? { ...cat, spent: cat.spent + action.payload.expense.amount }
            : cat
        );
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // UPDATE EXPENSE
    builder
      .addCase(updateExpense.fulfilled, (state, action) => {
        const idx = state.expenses.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.expenses[idx] = action.payload;
        toast.success("Expense updated ✅");
        // Update summary
        state.summary = state.summary.map((cat) => {
          if (cat._id === action.payload.categoryId) {
            const spent = state.expenses
              .filter((e) => e.categoryId === cat._id)
              .reduce((acc, curr) => acc + curr.amount, 0);
            return { ...cat, spent };
          }
          return cat;
        });
      });

    // MONTHLY EXPENSES
    builder
      .addCase(fetchMonthlyExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlyExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchMonthlyExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Failed to load monthly expenses");
      });

    // RECENT EXPENSES
    builder
      .addCase(fetchRecentExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.recent = action.payload;
      })
      .addCase(fetchRecentExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CATEGORY SUMMARY
    builder
      .addCase(fetchCategorySummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategorySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchCategorySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE EXPENSE
    builder
      .addCase(deleteExpense.fulfilled, (state, action) => {
        const deletedExpense = state.expenses.find((e) => e._id === action.payload);
        state.expenses = state.expenses.filter((e) => e._id !== action.payload);
        toast.success("Expense deleted!");

        // Update summary immediately
        if (deletedExpense) {
          state.summary = state.summary.map((cat) =>
            cat._id === deletedExpense.categoryId
              ? { ...cat, spent: cat.spent - deletedExpense.amount }
              : cat
          );
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export default expenseSlice.reducer;
