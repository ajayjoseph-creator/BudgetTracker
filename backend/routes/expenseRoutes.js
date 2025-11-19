import express from "express";
import {
  addExpense,
//   getMonthlyExpenses,
} from "../controllers/expenseController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes 👇
router.post("/", auth, addExpense);
// router.get("/", auth, getMonthlyExpenses);

export default router;
