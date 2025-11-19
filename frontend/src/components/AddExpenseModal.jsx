import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../redux/slices/expenseSlice";
import { addCategory, fetchCategorySummary } from "../redux/slices/categorySlice";
import { toast } from "react-toastify";

export default function AddExpenseModal({ open, onClose, categories, month }) {
  if (!open) return null;

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.expense);

  // Expense form
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Category form
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCat, setNewCat] = useState({
    name: "",
    limit: "",
    color: "#4f46e5",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save Expense
  const handleSave = async () => {
    if (!form.category || !form.amount) {
      return toast.error("Please fill all fields");
    }

    const expenseData = {
      amount: form.amount,
      categoryId: form.category, // 🔹 send categoryId to backend
      date: form.date,
    };

    const res = await dispatch(addExpense(expenseData));

    if (res.meta.requestStatus === "fulfilled") {
      const msg = res.payload?.status;

      msg === "over"
        ? toast.error("Over budget ❌")
        : toast.success("Within budget ✅");

      dispatch(fetchCategorySummary(month));
      onClose();

      // Clear form
      setForm({ category: "", amount: "", date: new Date().toISOString().split("T")[0] });
    } else {
      toast.error("Failed to add expense");
    }
  };

  // Save Category
  const saveCategory = async () => {
    if (!newCat.name || !newCat.limit) {
      return toast.error("All category fields required");
    }

    const res = await dispatch(addCategory({ ...newCat, month }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Category added!");
      setAddingCategory(false);

      // Clear
      setNewCat({ name: "", limit: "", color: "#4f46e5" });

      // Refresh categories
      dispatch(fetchCategorySummary(month));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

        {/* Category Dropdown */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>

        <div className="flex gap-2 mb-4">
          <select
            name="category"
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setAddingCategory(true)}
            className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Amount */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          placeholder="Enter amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* Date */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-6"
        />

        {/* Save Expense */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-green-400"
        >
          {loading ? "Saving..." : "Save Expense"}
        </button>
      </div>

      {/* Category Add Small Modal */}
      {addingCategory && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]">
          <div className="bg-white p-5 rounded-xl w-80 shadow-lg">

            <h3 className="text-lg font-semibold mb-3">Add Category</h3>

            <input
              type="text"
              placeholder="Name"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              className="w-full border p-2 rounded mb-3"
            />

            <input
              type="number"
              placeholder="Limit"
              value={newCat.limit}
              onChange={(e) => setNewCat({ ...newCat, limit: e.target.value })}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block mb-1 text-sm">Color</label>
            <input
              type="color"
              value={newCat.color}
              onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
              className="w-12 h-10"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setAddingCategory(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
