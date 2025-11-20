import Expense from "../models/expenseModel.js";
import Category from "../models/categoryModel.js";

// Create an expense
export const addExpense = async (req, res) => {
  try {
    const { amount, categoryId, date } = req.body;

    if (!amount || !categoryId)
      return res.status(400).json({ msg: "All fields required" });

  
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

   
    const month = category.month; 
    const start = new Date(`${month}-01`);
    const end = new Date(`${month}-31`);

    const existingExpenses = await Expense.aggregate([
      {
        $match: {
          categoryId: category._id,
          date: { $gte: start, $lte: end }
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const spent = existingExpenses[0]?.total || 0;
    const newSpent = spent + Number(amount);

    const status = newSpent > category.limit ? "over" : "within";

 
    const expense = await Expense.create({
      amount,
      categoryId,
      date: date || new Date(),
      userId: req.user._id, 
    });

    return res.json({
      status,
      expense,
    });
  } catch (err) {
    console.log("ADD EXPENSE ERROR:", err);
    res.status(500).json({ msg: "Error adding expense" });
  }
};
