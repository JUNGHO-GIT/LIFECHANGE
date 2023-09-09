// foodService.ts
import Food from "../schema/Food";
import * as mongoose from "mongoose";

// 1-1. foodList ---------------------------------------------------------------------------------->
export const foodList = async (
  user_id_param : string,
  food_regdate_param : string,
) => {

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarb = 0;
  let totalFat = 0;

  const foodResultList = await Food.find ({
    user_id : user_id_param,
    food_regdate : food_regdate_param
  });
  foodResultList.forEach((index) => {
    totalCalories += index.food_calories;
    totalProtein += index.food_protein;
    totalCarb += index.food_carb;
    totalFat += index.food_fat;
  });
  const foodList = [{
    food_calories : totalCalories.toFixed(1),
    food_protein : totalProtein.toFixed(1),
    food_carb : totalCarb.toFixed(1),
    food_fat : totalFat.toFixed(1)
  }];
  return foodList;
};

// 1-2. foodListPart ------------------------------------------------------------------------------>
export const foodListPart = async (
  user_id_param : string,
  food_regdate_param : string,
  food_category_param : string
) => {
  const foodListPart = await Food.find ({
    user_id : user_id_param,
    food_regdate : food_regdate_param,
    food_category : food_category_param
  });
  return foodListPart;
};

// 2-1. foodDetail -------------------------------------------------------------------------------->
export const foodDetail = async (
  _id_param : any
) => {
  const foodDetail = await Food.findOne ({
    _id : _id_param
  });
  return foodDetail;
};

// 3. foodInsert ---------------------------------------------------------------------------------->
export const foodInsert = async (
  FOOD_pram : any
) => {
  const foodInsert = await Food.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : FOOD_pram.user_id,
    food_title : FOOD_pram.food_title,
    food_brand : FOOD_pram.food_brand,
    food_category : FOOD_pram.food_category,
    food_serving : FOOD_pram.food_serving,
    food_calories : FOOD_pram.food_calories,
    food_carb : FOOD_pram.food_carb,
    food_protein : FOOD_pram.food_protein,
    food_fat : FOOD_pram.food_fat,
  });
  return foodInsert;
};

// 4. foodUpdate ---------------------------------------------------------------------------------->
export const foodUpdate = async (
  _id_param : any,
  FOOD_param : any
) => {
  const foodUpdate = await Food.updateOne (
    {_id : _id_param},
    {$set : FOOD_param},
  );
  return foodUpdate;
};

// 5. foodDelete ---------------------------------------------------------------------------------->
export const foodDelete = async (
  _id_param : any
) => {
  const foodDelete = await Food.deleteOne ({
    _id : _id_param
  });
  return foodDelete;
};
