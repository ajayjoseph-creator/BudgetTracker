import React, { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Settings, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategorySummary } from "../redux/slices/categorySlice";
import AddExpenseModal from "../components/AddExpenseModal";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const { summary, loading } = useSelector((state) => state.category);

  const formattedMonth = new Date(month + "-01").toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    dispatch(fetchCategorySummary(month));
  }, [dispatch, month]);

  const nextMonth = () => {
    const d = new Date(month + "-01");
    d.setMonth(d.getMonth() + 1);
    setMonth(d.toISOString().slice(0, 7));
  };

  const prevMonth = () => {
    const d = new Date(month + "-01");
    d.setMonth(d.getMonth() - 1);
    setMonth(d.toISOString().slice(0, 7));
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="flex items-center gap-1 px-3 py-1 bg-white rounded shadow hover:bg-gray-100"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{formattedMonth}</h1>
          <button
            onClick={nextMonth}
            className="flex items-center gap-1 px-3 py-1 bg-white rounded shadow hover:bg-gray-100"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/categorysetting")}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition"
          >
            <Settings size={16} /> Category Settings
          </button>

          <button
            onClick={() => navigate("/budgetsetting")}
            className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded shadow hover:bg-purple-700 transition"
          >
            <Settings size={16} /> Budget Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-gray-600 mt-10">Loading...</p>}

      {/* No categories */}
      {!loading && summary.length === 0 && (
        <p className="text-center text-gray-500">No categories added for this month.</p>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {summary.map((cat) => {
          const percent = Math.min((cat.spent / cat.limit) * 100, 100);
          const remaining = cat.limit - cat.spent;
          const isOver = remaining < 0;

          return (
            <div
              key={cat._id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition relative"
            >
              {isOver && (
                <span className="absolute top-4 right-4 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  OVER BUDGET
                </span>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></span>
                <h2 className="font-semibold text-lg text-gray-800">{cat.name}</h2>
              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition"
                  style={{ width: `${percent}%`, backgroundColor: cat.color }}
                ></div>
              </div>

              <div className="flex justify-between mt-4 text-sm font-medium">
                <p className="text-gray-600">Spent: ₹{cat.spent}</p>
                <p className="text-gray-700 font-semibold">Limit: ₹{cat.limit}</p>
              </div>

              <p
                className={`mt-2 text-sm font-medium ${isOver ? "text-red-600" : "text-green-600"}`}
              >
                {isOver ? `Exceeded by ₹${Math.abs(remaining)}` : `Remaining: ₹${remaining}`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transition"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={open}
        onClose={() => {
          setOpen(false);
          dispatch(fetchCategorySummary(month));
        }}
        categories={summary}
        month={month}
      />
    </div>
  );
}
