// foodService.ts
import Food from "../schema/Food";
import * as mongoose from "mongoose";

// 1-1. foodList ---------------------------------------------------------------------------------->
export const foodList = async (
  user_id_param: any,
  food_dur_param: any,
  food_category_param: any,
) => {
  const startDay = food_dur_param.split(` ~ `)[0];
  const endDay = food_dur_param.split(` ~ `)[1];
  
  let findQuery;

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

  const foodList = await Food.find(findQuery).sort({ food_day: -1 });

  return foodList;
};

// 1-2. foodTotal --------------------------------------------------------------------------------->
export const foodTotal = async (
  user_id_param: any,
  food_dur_param: any,
  food_category_param: any,
) => {
  const startDay = food_dur_param.split(` ~ `)[0];
  const endDay = food_dur_param.split(` ~ `)[1];
  
  let findQuery;

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

  const foodsInRange = await Food.find(findQuery).sort({ food_day: -1 });

  // 데이터가 없는 경우 빈 배열 반환
  if (foodsInRange.length === 0) {
    return [];
  }

  let totalFoodCalories = 0;
  let totalFoodProtein = 0;
  let totalFoodCarb = 0;
  let totalFoodFat = 0;

  foodsInRange.forEach((food) => {
    totalFoodCalories += food.food_calories;
    totalFoodProtein += food.food_protein;
    totalFoodCarb += food.food_carb;
    totalFoodFat += food.food_fat;
  });

  const foodTotal = [{
    totalCalories : totalFoodCalories.toFixed(2),
    totalProtein : totalFoodProtein.toFixed(2),
    totalCarb : totalFoodCarb.toFixed(2),
    totalFat : totalFoodFat.toFixed(2),
  }];

  // 배열 리턴
  return foodTotal;
};

// 1-3. foodAvg ---------------------------------------------------------------------------------->
export const foodAvg = async (
  user_id_param: any,
  food_dur_param: any,
  food_category_param: any,
) => {

  const startDay = food_dur_param.split(` ~ `)[0];
  const endDay = food_dur_param.split(` ~ `)[1];

  let findQuery;

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

  const foodsInRange = await Food.find(findQuery).sort({ food_day: -1 });

  // 데이터가 없는 경우 빈 배열 반환
  if (foodsInRange.length === 0) {
    return [];
  }

  let totalFoodCalories = 0;
  let totalFoodProtein = 0;
  let totalFoodCarb = 0;
  let totalFoodFat = 0;

  foodsInRange.forEach((food) => {
    totalFoodCalories += food.food_calories;
    totalFoodProtein += food.food_protein;
    totalFoodCarb += food.food_carb;
    totalFoodFat += food.food_fat;
  });

  const foodAvg = [{
    food_calories : (totalFoodCalories / foodsInRange.length).toFixed(2),
    food_protein : (totalFoodProtein / foodsInRange.length).toFixed(2),
    food_carb : (totalFoodCarb / foodsInRange.length).toFixed(2),
    food_fat : (totalFoodFat / foodsInRange.length).toFixed(2),
  }];

  // 배열 리턴
  return foodAvg;
};

// 1-2. foodSearchResult -------------------------------------------------------------------------->
export const foodSearchResult = async (
  user_id_param: any,
  food_dur_param: any,
  food_category_param: any,
) => {
  const foodSearchResult = await Food.find ({
    user_id : user_id_param,
    food_regdate : food_dur_param,
    food_category : food_category_param
  });
  return foodSearchResult;
};

// 2-1. foodDetail -------------------------------------------------------------------------------->
export const foodDetail = async (
  _id_param: any,
) => {
  const foodDetail = await Food.findOne ({
    _id : _id_param
  });
  return foodDetail;
};

// 3. foodInsert ---------------------------------------------------------------------------------->
export const foodInsert = async (
  uer_id_param: any,
  FOOD_pram: any,
) => {
  const foodInsert = await Food.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : uer_id_param,
    food_title : FOOD_pram.food_title,
    food_brand : FOOD_pram.food_brand,
    food_category : FOOD_pram.food_category,
    food_serving : FOOD_pram.food_serving,
    food_calories : FOOD_pram.food_calories,
    food_carb : FOOD_pram.food_carb,
    food_protein : FOOD_pram.food_protein,
    food_fat : FOOD_pram.food_fat,
    food_day : FOOD_pram.foodDay,
  });
  return foodInsert;
};

// 4. foodUpdate ---------------------------------------------------------------------------------->
export const foodUpdate = async (
  _id_param: any,
  FOOD_param: any,
) => {
  const foodUpdate = await Food.updateOne (
    {_id : _id_param},
    {$set : FOOD_param},
  );
  return foodUpdate;
};

// 5. foodDelete ---------------------------------------------------------------------------------->
export const foodDelete = async (
  _id_param: any,
) => {
  const foodDelete = await Food.deleteOne ({
    _id : _id_param
  });
  return foodDelete;
};
