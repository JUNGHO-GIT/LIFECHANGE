// foodService.ts
import Food from "../schemas/Food";
import * as mongoose from "mongoose";

// 1. foodList ------------------------------------------------------------------------------------>

// 2. foodDetail ---------------------------------------------------------------------------------->

// 3. foodInsert ---------------------------------------------------------------------------------->
export const foodInsert = async (
  user_id: String,
  food_name: String,
  food_brand: String,
  food_serving: String,
  food_calories: Number,
  food_carb: Number,
  food_protein: Number,
  food_fat: Number
) => {
  return Food.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id,
    food_name: food_name,
    food_brand: food_brand,
    food_serving: food_serving,
    food_calories: food_calories,
    food_carb: food_carb,
    food_protein: food_protein,
    food_fat: food_fat
  });
};

// 3-1. foodTotal --------------------------------------------------------------------------------->
export const foodTotal = async (
  user_id: String
) => {
  return Food.find({
    user_id: user_id
  }).countDocuments();
};

// 4. foodUpdate ---------------------------------------------------------------------------------->

// 5. foodDelete ---------------------------------------------------------------------------------->