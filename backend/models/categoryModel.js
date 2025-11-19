import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
