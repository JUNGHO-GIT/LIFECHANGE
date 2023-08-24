// Food.ts
import mongoose from "mongoose";

const FoodScheme = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  food_name: { type: String, required: true },
  food_brand: { type: String, required: true },
  food_serving: { type: String, required: true },
  food_calories: { type: Number, required: true },
  food_carb: { type: Number, required: true },
  food_protein: { type: Number, required: true },
  food_fat: { type: Number, required: true },
  food_calories_goal: { type: Number, required: true },
  food_regdate: { type: Date, default: Date.now }
});

export default mongoose.model("Food", FoodScheme);