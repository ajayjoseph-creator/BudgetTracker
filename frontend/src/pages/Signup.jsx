import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/slices/authSlice";
import { motion } from "framer-motion";
import { MailIcon, LockIcon, UserIcon, AlertCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
const navigate=useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(form));
  };
  useEffect(() => {
  if (!loading && !error) {
    // signup success ayal redirect
    navigate("/login");
  }
}, [loading, error, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-1">Start your budgeting journey</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-6"
          >
            <AlertCircleIcon className="h-5 w-5 mr-2 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Ajay Joseph"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
            </div>
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
            </div>
          </div>

       
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
            </div>
          </div>

      
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:bg-green-400 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

       
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
