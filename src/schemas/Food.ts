// Food.ts
import mongoose from "mongoose";

const FoodScheme = new mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: { type: String, required: true },
  food_name: { type: String, required: true },
  food_brand: { type: String, required: true },
  food_serving: { type: String, required: true },
  food_calories: { type: Number, required: true },
  food_carb: { type: Number, required: true },
  food_protein: { type: Number, required: true },
  food_fat: { type: Number, required: true },
  food_calories_goal: { type: Number, required: false },
  food_regdate: { type: String, default: () => new Date().toISOString().split('T')[0], required: true },
  food_update: { type: String, default: () => new Date().toISOString().split('T')[0], required: true }
});

export default mongoose.model("Food", FoodScheme);