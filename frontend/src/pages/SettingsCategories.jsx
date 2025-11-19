import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategorySummary, deleteCategory } from "../redux/slices/categorySlice";
import { Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import CategoryModal from "../components/CategoryModal";
import { useNavigate } from "react-router-dom"; // react-router-dom use cheyyum

export default function CategorySettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // navigation hook
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
    setEditCat(null); // no category selected for add
    setOpenModal(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header with Back button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)} // go back to previous page
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800">Category Settings</h1>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}

      {/* Category Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Color</th>
              <th className="px-4 py-2 text-left text-gray-600">Limit</th>
              <th className="px-4 py-2 text-left text-gray-600">Spent</th>
              <th className="px-4 py-2 text-left text-gray-600">Remaining</th>
              <th className="px-4 py-2 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((cat, idx) => {
              const remaining = cat.limit - cat.spent;
              const isOver = remaining < 0;

              return (
                <tr key={cat._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-gray-800">{cat.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block w-5 h-5 rounded-full border"
                      style={{ backgroundColor: cat.color }}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-800">₹{cat.limit}</td>
                  <td className="px-4 py-3 text-gray-800">₹{cat.spent}</td>
                  <td className={`px-4 py-3 font-semibold ${isOver ? "text-red-600" : "text-green-600"}`}>
                    ₹{remaining}
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => dispatch(deleteCategory(cat._id))}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18} />
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
        />
      )}
    </div>
  );
}
