// foodService.ts

import Food from "../schema/Food";
import * as mongoose from "mongoose";

// 1-1. foodList ---------------------------------------------------------------------------------->
export const foodList = async (
  user_id_param: any,
  food_dur_param: any,
  food_category_param: any,
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = food_dur_param.split(` ~ `)[0];
  const endDay = food_dur_param.split(` ~ `)[1];

  if (food_category_param !== "all") {
    findQuery = {
      user_id: user_id_param,
      food_day: {
        $gte: startDay,
        $lte: endDay,
      },
      food_category: food_category_param,
    };
  }
  else {
    findQuery = {
      user_id: user_id_param,
      food_day: {
        $gte: startDay,
        $lte: endDay,
      }
    };
  }

  findResult = await Food.find(findQuery).sort({ food_day: -1 });

  return findResult;
};

// 1-2. foodTotal --------------------------------------------------------------------------------->
export const foodTotal = async (
  user_id_param: any,
  food_dur_param: any,
  food_category_param: any,
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = food_dur_param.split(` ~ `)[0];
  const endDay = food_dur_param.split(` ~ `)[1];

  if (food_category_param !== "all") {
    findQuery = {
      user_id: user_id_param,
      food_day: {
        $gte: startDay,
        $lte: endDay,
      },
      food_category: food_category_param,
    };
  }
  else {
    findQuery = {
      user_id: user_id_param,
      food_day: {
        $gte: startDay,
        $lte: endDay,
      }
    };
  }

  findResult = await Food.find(findQuery).sort({ food_day: -1 });

  // 데이터가 없는 경우 빈 배열 반환
  if (findResult.length === 0) {
    return [];
  }

  let totalFoodCalories = 0;
  let totalFoodProtein = 0;
  let totalFoodCarb = 0;
  let totalFoodFat = 0;

  findResult.forEach((food) => {
    totalFoodCalories += food.food_calories;
    totalFoodProtein += food.food_protein;
    totalFoodCarb += food.food_carb;
    totalFoodFat += food.food_fat;
  });

  finalResult = [{
    totalCalories : totalFoodCalories.toFixed(2),
    totalProtein : totalFoodProtein.toFixed(2),
    totalCarb : totalFoodCarb.toFixed(2),
    totalFat : totalFoodFat.toFixed(2),
  }];

  // 배열 리턴
  return finalResult;
};

// 1-3. foodAvg ----------------------------------------------------------------------------------->
export const foodAvg = async (
  user_id_param: any,
  food_dur_param: any,
  food_category_param: any,
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = food_dur_param.split(` ~ `)[0];
  const endDay = food_dur_param.split(` ~ `)[1];

  if (food_category_param !== "all") {
    findQuery = {
      user_id: user_id_param,
      food_day: {
        $gte: startDay,
        $lte: endDay,
      },
      food_category: food_category_param,
    };
  }
  else {
    findQuery = {
      user_id: user_id_param,
      food_day: {
        $gte: startDay,
        $lte: endDay,
      }
    };
  }

  finalResult = await Food.find(findQuery).sort({ food_day: -1 });

  // 데이터가 없는 경우 빈 배열 반환
  if (finalResult.length === 0) {
    return [];
  }

  let totalFoodCalories = 0;
  let totalFoodProtein = 0;
  let totalFoodCarb = 0;
  let totalFoodFat = 0;

  finalResult.forEach((food) => {
    totalFoodCalories += food.food_calories;
    totalFoodProtein += food.food_protein;
    totalFoodCarb += food.food_carb;
    totalFoodFat += food.food_fat;
  });

  finalResult = [{
    food_calories : (totalFoodCalories / finalResult.length).toFixed(2),
    food_protein : (totalFoodProtein / finalResult.length).toFixed(2),
    food_carb : (totalFoodCarb / finalResult.length).toFixed(2),
    food_fat : (totalFoodFat / finalResult.length).toFixed(2),
  }];

  // 배열 리턴
  return finalResult;
};

// 1-2. foodSearchResult -------------------------------------------------------------------------->
export const foodSearchResult = async (
  user_id_param: any,
  food_dur_param: any,
  food_category_param: any,
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    user_id: user_id_param,
    food_day: food_dur_param,
    food_category: food_category_param,
  };

  findResult = await Food.find(findQuery);

  return findResult;
};

// 2-1. foodDetail -------------------------------------------------------------------------------->
export const foodDetail = async (
  _id_param: any,
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    _id: _id_param,
  };

  findResult = await Food.find(findQuery);

  return findResult;
};

// 3. foodInsert ---------------------------------------------------------------------------------->
export const foodInsert = async (
  uer_id_param: any,
  FOOD_pram: any,
) => {

  let createQuery;
  let createResult;
  let finalResult;

  createQuery = {
    _id: new mongoose.Types.ObjectId(),
    user_id: uer_id_param,
    food_title: FOOD_pram.food_title,
    food_brand: FOOD_pram.food_brand,
    food_category: FOOD_pram.food_category,
    food_serving: FOOD_pram.food_serving,
    food_calories: FOOD_pram.food_calories,
    food_carb: FOOD_pram.food_carb,
    food_protein: FOOD_pram.food_protein,
    food_fat: FOOD_pram.food_fat,
    food_day: FOOD_pram.foodDay,
  };

  createResult = await Food.create(createQuery);

  return createResult;
};

// 4. foodUpdate ---------------------------------------------------------------------------------->
export const foodUpdate = async (
  _id_param: any,
  FOOD_param: any,
) => {

  let updateQuery;
  let updateResult;
  let finalResult;

  updateQuery = {
    filter_id : {_id : _id_param},
    filter_set : {$set : FOOD_param}
  };

  updateResult = await FOOD_param.updateOne(
    updateQuery.filter_id,
    updateQuery.filter_set
  );

  return updateResult;
};


// 5. foodDelete ---------------------------------------------------------------------------------->
export const foodDelete = async (
  _id_param: any,
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  deleteQuery = {
    _id: _id_param,
  };

  deleteResult = await Food.deleteOne(deleteQuery);

  return deleteResult;
};