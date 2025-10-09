// userRepository.ts

import mongoose from "mongoose";
import { User } from "@schemas/user/User";
import { Verify } from "@schemas/Verify";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { ExerciseRecord } from "@schemas/exercise/ExerciseRecord";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { FoodRecord } from "@schemas/food/FoodRecord";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { MoneyRecord } from "@schemas/money/MoneyRecord";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { SleepRecord } from "@schemas/sleep/SleepRecord";
import { exerciseArray } from "@assets/arrays/ExerciseArray";
import { moneyArray } from "@assets/arrays/MoneyArray";
import { foodArray } from "@assets/arrays/FoodArray";
import { sleepArray } from "@assets/arrays/SleepArray";

// 1-1. email - findId -----------------------------------------------------------------------------
export const emailFindId = async (
  user_id_param: string
) => {

  const finalResult:any = await User.findOne(
    {
      user_id: user_id_param
    }
  )
  .lean();

  return finalResult;
};

// 1-2. email - sendEmail --------------------------------------------------------------------------
export const emailSendEmail = async (
  user_id_param: string,
  code_param: string
) => {

  const findResult:any = await Verify.findOne(
    {
      verify_id: user_id_param
    }
  )
  .lean();

  if (findResult !== null) {
    await Verify.deleteMany(
      {
        verify_id: user_id_param
      }
    );
  }

  const finalResult:any = await Verify.create(
    {
      verify_id: user_id_param,
      verify_code: code_param,
      verify_regDt: new Date(),
    }
  );

  return finalResult;
};

// 1-3. email - verifyEmail ------------------------------------------------------------------------
export const emailVerifyEmail = async (
  user_id_param: string
) => {

  const finalResult:any = await Verify.findOne(
    {
      verify_id: user_id_param
    }
  )
  .lean();

  return finalResult;
};

// 2-1. user - checkId -----------------------------------------------------------------------------
export const userCheckId = async (
  user_id_param: string
) => {

  const finalResult:any = await User.findOne(
    {
      user_id: user_id_param
    }
  )
  .lean();

  return finalResult;
}

// 2-2. user - signup -----------------------------------------------------------------------------
export const userSignup = async (
  user_id_param: string,
  OBJECT_param: any
) => {

  const finalResult:any = await User.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      user_google: "N",
      user_token: OBJECT_param.user_token,
      user_pw: OBJECT_param.user_pw,
      user_image: OBJECT_param.user_image,

      user_initScale: OBJECT_param.user_initScale,
      user_minScale: "",
      user_maxScale: "",
      user_curScale: "",

      user_initAvgKcalIntake: OBJECT_param.user_initAvgKcalIntake,
      user_totalKcalIntake: "",
      user_totalCarbIntake: "",
      user_totalProteinIntake: "",
      user_totalFatIntake: "",
      user_curAvgKcalIntake: "",
      user_curAvgCarbIntake: "",
      user_curAvgProteinIntake: "",
      user_curAvgFatIntake: "",

      user_initProperty: OBJECT_param.user_initProperty,
      user_totalIncomeAll: "",
      user_totalIncomeExclusion: "",
      user_totalExpenseAll: "",
      user_totalExpenseExclusion: "",
      user_curPropertyAll: "",
      user_curPropertyExclusion: "",

      user_favorite: [{
        food_record_key: "",
        food_record_name: "",
        food_record_brand: "",
        food_record_kcal: "",
        food_record_carb: "",
        food_record_protein: "",
        food_record_fat: "",
      }],
      user_dataCategory: {
        exercise: exerciseArray,
        food: foodArray,
        money: moneyArray,
        sleep: sleepArray,
      },
      user_regDt: new Date(),
      user_updateDt: "",
    }
  );

  return finalResult;
};

// 2-3. user - resetPw -----------------------------------------------------------------------------
export const userResetPw = async (
  user_id_param: string,
  OBJECT_param: any
) => {

  const finalResult:any = await User.findOneAndUpdate(
    {
      user_id: user_id_param
    },
    {
      $set: {
        user_token: OBJECT_param.user_token,
        user_pw: OBJECT_param.user_pw
      }
    },
    {
      upsert: true,
      new: true
    }
  );

  return finalResult;
};

// 2-4. user - login -------------------------------------------------------------------------------
export const userLogin = async (
  user_id_param: string,
  user_pw_param: string
) => {

  const finalResult:any = await User.findOne(
    {
      user_id: user_id_param,
      user_pw: user_pw_param
    }
  )
  .lean();

  return finalResult;
};

// 2-5. user - detail ------------------------------------------------------------------------------
export const userDetail = async (
  user_id_param: string
) => {

  const finalResult:any = await User.findOne(
    {
      user_id: user_id_param
    }
  )
  .lean();

  return finalResult;
}

// 2-6. user - update ------------------------------------------------------------------------------
export const userUpdate = async (
  user_id_param: string,
  OBJECT_param: any
) => {

  const finalResult:any = await User.findOneAndUpdate(
    {
      user_id: user_id_param
    },
    {
      $set: {
        user_image: OBJECT_param.user_image,
        user_initScale: OBJECT_param.user_initScale,
        user_initAvgKcalIntake: OBJECT_param.user_initAvgKcalIntake,
        user_initProperty: OBJECT_param.user_initProperty,
      },
    },
    {
      upsert: true,
      new: true
    }
  );

  return finalResult;
};

// 2-7. user - delete -----------------------------------------------------------------------------
export const userDelete = async (
  user_id_param: string,
) => {

  const finalResult =
    await ExerciseGoal.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await ExerciseRecord.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await FoodGoal.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await FoodRecord.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await MoneyGoal.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await MoneyRecord.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await SleepGoal.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await SleepRecord.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await User.deleteOne(
      {
        user_id: user_id_param
      }
    )

  return finalResult;
};

// 3-2. category - detail --------------------------------------------------------------------------
export const categoryDetail = async (
  user_id_param: string
) => {

  const finalResult:any = await User.aggregate([
    {
      $match: {
        user_id: user_id_param
      }
    },
    {
      $project: {
        _id: 0,
        exercise: "$user_dataCategory.exercise",
        food: "$user_dataCategory.food",
        money: "$user_dataCategory.money",
        sleep: "$user_dataCategory.sleep",
      }
    }
  ]);

  return finalResult[0];
};

// 3-4. category - update --------------------------------------------------------------------------
export const categoryUpdate = async (
  user_id_param: string,
  OBJECT_param: any
) => {

  const finalResult:any = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_dataCategory: {
					today: OBJECT_param.today,
          exercise: OBJECT_param.exercise,
          food: OBJECT_param.food,
          money: OBJECT_param.money,
          sleep: OBJECT_param.sleep,
        },
        user_updateDt: new Date(),
      }
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};