import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", ExpenseSchema);
