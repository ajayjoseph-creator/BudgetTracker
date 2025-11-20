import Category from "../models/categoryModel.js";
import Expense from "../models/expenseModel.js";

// Create category
export const addCategory = async (req, res) => {
  try {
    const { name, color, limit, month } = req.body;

    if (!name || !color || !limit || !month) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const category = await Category.create({
      name,
      color,
      limit,
      month,
      userId: req.user._id, // associate category with logged-in user
    });

    res.json(category);
  } catch (err) {
    console.log("CATEGORY ERROR:", err);
    res.status(500).json({ msg: "Failed to create category" });
  }
};

// Monthly category summary (user-specific)
export const getCategorySummary = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.user._id;

    const start = new Date(`${month}-01`);
    const end = new Date(`${month}-31`);

    // fetch only current user's categories for the selected month
    const categories = await Category.find({ userId, month });

    const spend = await Expense.aggregate([
      { $match: { date: { $gte: start, $lte: end }, userId } },
      { $group: { _id: "$categoryId", spent: { $sum: "$amount" } } },
    ]);

    const result = categories.map((cat) => {
      const found = spend.find((s) => String(s._id) === String(cat._id));
      const spent = found ? found.spent : 0;

      return {
        _id: cat._id,
        name: cat.name,
        color: cat.color,
        limit: cat.limit,
        spent,
        remaining: cat.limit - spent,
        overBudget: spent > cat.limit,
      };
    });

    res.json(result);
  } catch (err) {
    console.log("CATEGORY SUMMARY ERROR:", err);
    res.status(500).json({ msg: "Error fetching summary" });
  }
};


// Update category 
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, limit } = req.body;

    if (!name || !color || !limit)
      return res.status(400).json({ msg: "All fields required" });

    
    const category = await Category.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name, color, limit },
      { new: true }
    );

    if (!category) return res.status(404).json({ msg: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update category" });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    
    const category = await Category.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!category) return res.status(404).json({ msg: "Category not found" });

    res.json({ msg: "Category deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete category" });
  }
};
