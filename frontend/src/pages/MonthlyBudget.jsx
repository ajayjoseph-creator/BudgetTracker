import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategorySummary } from "../redux/slices/categorySlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Plus, ArrowLeft } from "lucide-react";

export default function MonthlyBudget() {
  const dispatch = useDispatch();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const { summary, loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategorySummary(month));
  }, [dispatch, month]);

  const handleMonthChange = (e) => setMonth(e.target.value);

  const handleBack = () => window.history.back();
 

  return (
    <div className="min-h-screen p-6 bg-gray-50">
    
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 bg-white shadow rounded hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Monthly Budget</h1>

       
      </div>

  
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium text-gray-700">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={handleMonthChange}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

  
      {loading && (
        <p className="text-center text-gray-500 mt-4">Loading...</p>
      )}

     
      {!loading && summary.length > 0 && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mb-8">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                {["Category", "Budget", "Spent", "Remaining"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-gray-700 uppercase tracking-wider text-sm"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summary.map((cat) => {
                const remaining = cat.limit - cat.spent;
                const isOver = remaining < 0;

                return (
                  <tr
                    key={cat._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></span>
                      <span className="text-gray-800 font-medium">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">₹{cat.limit}</td>
                    <td className="px-6 py-4 text-gray-800">₹{cat.spent}</td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        isOver ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹{remaining}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bar Chart */}
      {!loading && summary.length > 0 && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Budget Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
              <Bar dataKey="limit" fill="#10b981" name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
