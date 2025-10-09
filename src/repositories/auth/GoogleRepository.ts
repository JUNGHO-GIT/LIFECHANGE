// googleRepository.ts

import mongoose from "mongoose";
import { User } from "@schemas/user/User";
import { exerciseArray } from "@assets/arrays/ExerciseArray";
import { moneyArray } from "@assets/arrays/MoneyArray";
import { foodArray } from "@assets/arrays/FoodArray";
import { sleepArray } from "@assets/arrays/SleepArray";

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

    user_initScale: "0",
    user_minScale: "",
    user_maxScale: "",
    user_curScale: "",

    user_initAvgKcalIntake: "0",
    user_totalKcalIntake: "",
    user_totalCarbIntake: "",
    user_totalProteinIntake: "",
    user_totalFatIntake: "",
    user_curAvgKcalIntake: "",
    user_curAvgCarbIntake: "",
    user_curAvgProteinIntake: "",
    user_curAvgFatIntake: "",

    user_initProperty: "0",
    user_totalIncomeAll: "",
    user_totalIncomeExclusion: "",
    user_totalExpenseAll: "",
    user_totalExpenseExclusion: "",
    user_curPropertyAll: "",
    user_curPropertyExclusion: "",

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