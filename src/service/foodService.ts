// foodService.ts
import Food from "../schemas/Food";
import * as mongoose from "mongoose";

// 1. foodList ------------------------------------------------------------------------------------>

// 2. foodDetail ---------------------------------------------------------------------------------->

// 3. foodInsert ---------------------------------------------------------------------------------->
export const foodInsert = async (
  user_id_param: string,
  food_name_param: string,
  food_brand_param: string,
  food_serving_param: string,
  food_calories_param: number,
  food_carb_param: number,
  food_protein_param: number,
  food_fat_param: number,
) => {
  const foodInsert = await Food.create ({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    food_name: food_name_param,
    food_brand: food_brand_param,
    food_serving: food_serving_param,
    food_calories: food_calories_param,
    food_carb: food_carb_param,
    food_protein: food_protein_param,
    food_fat: food_fat_param,
  });
  return foodInsert;
};

// 3-1. foodTotal --------------------------------------------------------------------------------->
export const foodTotal = async (
  user_id_param: string,
  food_regdate_param: string
) => {
  try {
    const foodResults = await Food.find ({
      user_id: user_id_param,
      food_regdate: food_regdate_param
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarb = 0;
    let totalFat = 0;

    foodResults.forEach((index) => {
      totalCalories += index.food_calories;
      totalProtein += index.food_protein;
      totalCarb += index.food_carb;
      totalFat += index.food_fat;
    });
    return {
      totalCalories,
      totalProtein,
      totalCarb,
      totalFat
    };
  }
  catch (error) {
    console.error(error);
    throw error;
  }
};


// 4. foodUpdate ---------------------------------------------------------------------------------->

// 5. foodDelete ---------------------------------------------------------------------------------->
