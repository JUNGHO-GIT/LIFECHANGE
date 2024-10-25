// googleRepository.ts

import mongoose from "mongoose";
import { User } from "@schemas/user/User";
import { calendarArray } from "@assets/arrays/calendarArray";
import { exerciseArray } from "@assets/arrays/exerciseArray";
import { moneyArray } from "@assets/arrays/moneyArray";
import { foodArray } from "@assets/arrays/foodArray";
import { sleepArray } from "@assets/arrays/sleepArray";

// 1. find -----------------------------------------------------------------------------------------
export const findUser = async (
  user_id_param: string,
) => {
  const findResult:any = await User.findOne({
    user_id: user_id_param,
    user_google: "Y",
  })
  .lean();

  return findResult;
}

// 2. create ---------------------------------------------------------------------------------------
export const createUser = async (
  user_id_param: string,
  user_pw_param: string,
  token_param: string,
) => {
  const finalResult:any = await User.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    user_google: "Y",
    user_token: token_param,
    user_pw: user_pw_param,
    user_image: "",
    user_exercise: {
      user_initScale: "0",
      user_minScale: "",
      user_maxScale: "",
      user_curScale: "",
    },
    user_food: {
      user_initAvgKcal: "0",
      user_totalKcal: "",
      user_totalCarb: "",
      user_totalProtein: "",
      user_totalFat: "",
      user_curAvgKcal: "",
      user_curAvgCarb: "",
      user_curAvgProtein: "",
      user_curAvgFat: "",
    },
    user_money: {
      user_initProperty: "0",
      user_totalIncomeInclude: "",
      user_totalIncomeExclude: "",
      user_totalExpenseInclude: "",
      user_totalExpenseExclude: "",
      user_curPropertyInclude: "",
      user_curPropertyExclude: "",
    },
    user_favorite: [{
      food_key: "",
      food_name: "",
      food_brand: "",
      food_kcal: "",
      food_carb: "",
      food_protein: "",
      food_fat: "",
    }],
    user_dataCategory: {
      calendar: calendarArray,
      exercise: exerciseArray,
      food: foodArray,
      money: moneyArray,
      sleep: sleepArray,
    },
    user_regDt: new Date(),
    user_updateDt: "",
  });

  return finalResult;
}