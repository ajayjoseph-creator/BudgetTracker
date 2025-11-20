import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { motion } from "framer-motion";
import { MailIcon, LockIcon, AlertCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
const navigate=useNavigate()

 const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await dispatch(login(form));

  if (login.fulfilled.match(result)) {
    navigate("/");
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
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
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="username"
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
                placeholder="enter password"
                value={form.password}
                autoComplete="current-password"
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
            {loading ? "Checking..." : "Sign in"}
          </button>

         

         

      
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
           <button
  type="button"
  onClick={(e) => {
    e.preventDefault();    
    e.stopPropagation();    
    navigate("/signup");
  }}
  className="text-primary-600 hover:text-primary-500 font-medium cursor-pointer"
>
  Sign up
</button>


          </p>
        </form>
      </div>
    </div>
  );
}
