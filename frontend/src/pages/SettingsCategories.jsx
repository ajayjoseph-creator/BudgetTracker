import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategorySummary, deleteCategory } from "../redux/slices/categorySlice";
import { Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import CategoryModal from "../components/CategoryModal";
import { useNavigate } from "react-router-dom";

export default function CategorySettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editCat, setEditCat] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { summary, loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategorySummary(month));
  }, [dispatch, month]);

  const handleEdit = (cat) => {
    setEditCat(cat);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setEditCat(null);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteCategory(id));
    dispatch(fetchCategorySummary(month)); // refresh table after delete
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Category Settings
        </h1>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full min-w-[600px] table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">Name</th>
              <th className="px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">Color</th>
              <th className="px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">Limit</th>
              <th className="px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">Spent</th>
              <th className="px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">Remaining</th>
              <th className="px-4 py-2 text-left text-gray-600 text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((cat, idx) => {
              const remaining = cat.limit - cat.spent;
              const isOver = remaining < 0;
              return (
                <tr key={cat._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-gray-800 text-xs sm:text-sm">{cat.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full border"
                      style={{ backgroundColor: cat.color }}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-800 text-xs sm:text-sm">₹{cat.limit}</td>
                  <td className="px-4 py-3 text-gray-800 text-xs sm:text-sm">₹{cat.spent}</td>
                  <td
                    className={`px-4 py-3 font-semibold text-xs sm:text-sm ${
                      isOver ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ₹{remaining}
                  </td>
                  <td className="px-4 py-3 flex gap-2 sm:gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Category Modal */}
      {openModal && (
        <CategoryModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          category={editCat}
          month={month}
          refreshSummary={() => dispatch(fetchCategorySummary(month))} // pass refresh func
        />
      )}
    </div>
  );
}
