import express from "express";
import {
  addExpense,

} from "../controllers/expenseController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", auth, addExpense);


export default router;
