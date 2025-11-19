// categoryRoutes.js
import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategorySummary,
  updateCategory,
} from "../controllers/categoryController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, addCategory);
router.get("/summary",auth, getCategorySummary);  // fetchCategorySummary dispatch cheyyumbo call ayi
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

export default router;
