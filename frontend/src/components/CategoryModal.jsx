import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { addCategory, updateCategory } from "../redux/slices/categorySlice";
import { toast } from "react-toastify";

export default function CategoryModal({ open, onClose, category }) {
  if (!open) return null;

  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", limit: "", color: "#4f46e5" });

  useEffect(() => {
    if (category) setForm({ name: category.name, limit: category.limit, color: category.color });
  }, [category]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.limit) return toast.error("All fields required");

    if (category) {
      const res = await dispatch(updateCategory({ id: category._id, data: form }));
      if (res.meta.requestStatus === "fulfilled") onClose();
    } else {
      const res = await dispatch(addCategory(form));
      if (res.meta.requestStatus === "fulfilled") onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-80 p-6 rounded-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500"><X size={22} /></button>
        <h2 className="text-xl font-semibold mb-4">{category ? "Edit" : "Add"} Category</h2>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded mb-3"/>
        <input type="number" name="limit" placeholder="Limit" value={form.limit} onChange={handleChange} className="w-full border p-2 rounded mb-3"/>
        <label className="block mb-1 text-sm">Color</label>
        <input type="color" name="color" value={form.color} onChange={handleChange} className="w-12 h-10 mb-4"/>
        <button onClick={handleSave} className="w-full bg-blue-600 text-white p-2 rounded">{category ? "Update" : "Add"}</button>
      </div>
    </div>
  );
}
