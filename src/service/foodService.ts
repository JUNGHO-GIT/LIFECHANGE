// foodService.ts
import Food from "../schemas/Food";
import * as mongoose from "mongoose";

// 1. foodList ------------------------------------------------------------------------------------>

// 2-1. foodDetail -------------------------------------------------------------------------------->
export const foodDetail = async (
  user_id_param : string,
  food_regdate_param : string,
  food_category_param : string
) => {
  const foodDetail = await Food.find ({
    user_id : user_id_param,
    food_regdate : food_regdate_param,
    food_category : food_category_param
  });
  return foodDetail;
};

// 2-2. foodInfo ---------------------------------------------------------------------------------->
export const foodInfo = async (
  _id_param : string,
  user_id_param : string,
  food_regdate_param : string,
) => {
  const foodInfo = await Food.findOne ({
    _id : _id_param,
    user_id : user_id_param,
    food_regdate : food_regdate_param,
  });
  return foodInfo;
};

// 3. foodInsert ---------------------------------------------------------------------------------->
export const foodInsert = async (
  food_param: any
) => {
  const foodInsert = await Food.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : food_param.user_id,
    food_name : food_param.food_name,
    food_brand : food_param.food_brand,
    food_category : food_param.food_category,
    food_serving : food_param.food_serving,
    food_calories : food_param.food_calories,
    food_carb : food_param.food_carb,
    food_protein : food_param.food_protein,
    food_fat : food_param.food_fat,
  });
  return foodInsert;
};

// 3-1. foodTotal --------------------------------------------------------------------------------->
export const foodTotal = async (
  user_id_param : string,
  food_regdate_param : string,
) => {
  try {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarb = 0;
    let totalFat = 0;

    const foodResultTotal = await Food.find ({
      user_id : user_id_param,
      food_regdate : food_regdate_param
    });
    foodResultTotal.forEach((index) => {
      totalCalories += index.food_calories;
      totalProtein += index.food_protein;
      totalCarb += index.food_carb;
      totalFat += index.food_fat;
    });
    const foodTotal = [{
      food_calories : totalCalories.toFixed(1),
      food_protein : totalProtein.toFixed(1),
      food_carb : totalCarb.toFixed(1),
      food_fat : totalFat.toFixed(1)
    }];
    return foodTotal;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
};

// 4. foodUpdate ---------------------------------------------------------------------------------->
/* export const foodUpdate = async (
  _id_param: any,
  food_param: any
) => {
  const foodUpdate = await Food.updateOne (
    { _id: _id_param }, // Query
    { $set: food_param } // Update
  );
  return foodUpdate;
}; */

// 5. foodDelete ---------------------------------------------------------------------------------->
export const foodDelete = async (
  _id_param : string,
  user_id_param : string,
  food_regdate_param : string,
) => {
  const foodDelete = await Food.deleteOne ({
    _id : _id_param,
    user_id : user_id_param,
    food_regdate : food_regdate_param,
  });
  return foodDelete;
};
