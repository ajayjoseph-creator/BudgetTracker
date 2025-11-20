import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategorySummary, updateCategory, addCategory, deleteCategory } from "../redux/slices/categorySlice";
import { ArrowLeft, Plus, Edit2, X } from "lucide-react";

export default function BudgetTable() {
  const dispatch = useDispatch();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const { summary, loading } = useSelector((state) => state.category);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [selectedCat, setSelectedCat] = useState(null);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("#000000");
  const [catLimit, setCatLimit] = useState("");

  useEffect(() => {
    dispatch(fetchCategorySummary(month));
  }, [dispatch, month]);

  const openAddModal = () => {
    setModalMode("add");
    setCatName("");
    setCatColor("#000000");
    setCatLimit("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setModalMode("edit");
    setSelectedCat(cat);
    setCatName(cat.name);
    setCatColor(cat.color);
    setCatLimit(cat.limit);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!catName || !catLimit) return;

    if (modalMode === "add") {
      dispatch(addCategory({ name: catName, color: catColor, limit: Number(catLimit), month }));
    } else if (modalMode === "edit") {
      dispatch(updateCategory({ categoryId: selectedCat._id, name: catName, color: catColor, limit: Number(catLimit), month }));
    }
    setIsModalOpen(false);
  };

  const handleBack = () => window.history.back();

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 sm:mb-6 gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 bg-white shadow rounded hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Monthly Budgets
        </h1>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Month Selector */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <label className="font-medium text-gray-700">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="w-full min-w-[600px] table-auto">
          <thead className="bg-gray-100">
            <tr>
              {["Category", "Color", "Limit", "Spent", "Remaining", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-gray-700 text-xs sm:text-sm uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {summary.map((cat) => {
              const remaining = cat.limit - cat.spent;
              return (
                <tr key={cat._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-800">{cat.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full" style={{ backgroundColor: cat.color }} />
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm">₹{cat.limit}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-gray-800">₹{cat.spent}</td>
                  <td className={`px-4 py-3 text-xs sm:text-sm font-semibold ${remaining < 0 ? "text-red-600" : "text-green-600"}`}>
                    ₹{remaining}
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition text-xs sm:text-sm"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteCategory(cat._id))}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md shadow-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={18} />
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4">{modalMode === "add" ? "Add Category" : "Edit Category"}</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Category Name"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="color"
                value={catColor}
                onChange={(e) => setCatColor(e.target.value)}
                className="w-16 h-10 p-0 border rounded cursor-pointer"
              />
              <input
                type="number"
                placeholder="Limit"
                value={catLimit}
                onChange={(e) => setCatLimit(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-2"
              >
                {modalMode === "add" ? "Add Category" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
