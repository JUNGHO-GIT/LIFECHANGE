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
  const foodInsert = await Food.create({
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
  return foodInsert;
};

// 3-1. foodTotal --------------------------------------------------------------------------------->
export const foodTotal = async (
  user_id_param: string,
  food_regdate_param: string
) => {
  // 문자열을 날짜로 변환
  const food_regdate = new Date(food_regdate_param);

  // 날짜 객체를 사용하여 MongoDB에서 찾기
  const foodTotal = await Food.find({
    user_id: user_id_param,
    food_regdate
  });

  let totalDate = "";
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarb = 0;
  let totalFat = 0;

  foodTotal.forEach((food) => {
    totalDate = new Date(food.food_regdate).toISOString().split("T")[0];
    totalCalories += food.food_calories;
    totalProtein += food.food_protein;
    totalCarb += food.food_carb;
    totalFat += food.food_fat;
  });

  return {
    totalDate,
    totalCalories,
    totalProtein,
    totalCarb,
    totalFat
  };
};


// 4. foodUpdate ---------------------------------------------------------------------------------->

// 5. foodDelete ---------------------------------------------------------------------------------->