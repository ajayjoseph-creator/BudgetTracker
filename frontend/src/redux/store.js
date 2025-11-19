import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from './slices/categorySlice'
import expenseReducer from './slices/expenseSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    expense: expenseReducer, 
  },
});
