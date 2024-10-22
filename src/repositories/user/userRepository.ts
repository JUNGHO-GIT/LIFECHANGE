// userRepository.ts

import mongoose from "mongoose";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { Exercise } from "@schemas/exercise/Exercise";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { Food } from "@schemas/food/Food";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { Money } from "@schemas/money/Money";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { Sleep } from "@schemas/sleep/Sleep";
import { User } from "@schemas/user/User";
import { Verify } from "@schemas/Verify";

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
      verify_regDt: newDate
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
      user_initScale: OBJECT_param.user_initScale,
      user_curScale: "",
      user_initProperty: OBJECT_param.user_initProperty,
      user_curPropertyInclude: "",
      user_curPropertyExclude: "",
      user_image: OBJECT_param.user_image,
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
        user_initScale: OBJECT_param.user_initScale,
        user_curScale: OBJECT_param.user_curScale,
        user_initProperty: OBJECT_param.user_initProperty,
        user_curPropertyInclude: OBJECT_param.user_curPropertyInclude,
        user_curPropertyExclude: OBJECT_param.user_curPropertyExclude,
        user_image: OBJECT_param.user_image,
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
    await Exercise.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await FoodGoal.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await Food.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await MoneyGoal.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await Money.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await SleepGoal.deleteMany(
      {
        user_id: user_id_param
      }
    )
    await Sleep.deleteMany(
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
        calendar: "$user_dataCategory.calendar",
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
          calendar: OBJECT_param.calendar,
          exercise: OBJECT_param.exercise,
          food: OBJECT_param.food,
          money: OBJECT_param.money,
          sleep: OBJECT_param.sleep,
        },
        user_updateDt: newDate
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

// 4-1. dummy - deleteAll -------------------------------------------------------------------------
export const dummyDeleteAll = async (
  user_id_param: string
) => {

  const finalResult =
    await ExerciseGoal.deleteMany(
      {
        user_id: user_id_param,
        exercise_goal_dummy: "Y"
      }
    )
    await Exercise.deleteMany(
      {
        user_id: user_id_param,
        exercise_dummy: "Y"
      }
    )
    await FoodGoal.deleteMany(
      {
        user_id: user_id_param,
        food_goal_dummy: "Y"
      }
    )
    await Food.deleteMany(
      {
        user_id: user_id_param,
        food_dummy: "Y"
      }
    )
    await MoneyGoal.deleteMany(
      {
        user_id: user_id_param,
        money_goal_dummy: "Y"
      }
    )
    await Money.deleteMany(
      {
        user_id: user_id_param,
        money_dummy: "Y"
      }
    )
    await SleepGoal.deleteMany(
      {
        user_id: user_id_param,
        sleep_goal_dummy: "Y"
      }
    )
    await Sleep.deleteMany(
      {
        user_id: user_id_param,
        sleep_dummy: "Y"
      }
    )

  return finalResult;
};

// 4-2. dummy - count ------------------------------------------------------------------------------
export const dummyCount = async (
  user_id_param: string,
  type_param: string
) => {

  if (type_param === "exerciseGoal") {
    const finalResult:any = await ExerciseGoal.countDocuments(
      {
        user_id: user_id_param
      }
    );
    return finalResult;
  }
  else if (type_param === "exercise") {
    const finalResult:any = await Exercise.countDocuments(
      {
        user_id: user_id_param
      }
    );
    return finalResult;
  }
  else if (type_param === "foodGoal") {
    const finalResult:any = await FoodGoal.countDocuments(
      {
        user_id: user_id_param
      }
    );
    return finalResult;
  }
  else if (type_param === "food") {
    const finalResult:any = await Food.countDocuments(
      {
        user_id: user_id_param
      }
    );
    return finalResult;
  }
  else if (type_param === "moneyGoal") {
    const finalResult:any = await MoneyGoal.countDocuments(
      {
        user_id: user_id_param
      }
    );
    return finalResult;
  }
  else if (type_param === "money") {
    const finalResult:any = await Money.countDocuments(
      {
        user_id: user_id_param
      }
    );
    return finalResult;
  }
  else if (type_param === "sleepGoal") {
    const finalResult:any = await SleepGoal.countDocuments(
      {
        user_id: user_id_param
      }
    );
    return finalResult;
  }
  else if (type_param === "sleep") {
    const finalResult:any = await Sleep.countDocuments(
      {
        user_id: user_id_param
      }
    );
    return finalResult;
  }
}

// 4-3. dummy - list -------------------------------------------------------------------------------
export const dummyList = async (
  user_id_param: string,
  page_param: number,
  type_param: string,
) => {

  if (type_param === "exerciseGoal") {
    const finalResult:any = await ExerciseGoal.aggregate([
      {
        $match: {
          user_id: user_id_param
        }
      },
      {
        $sort: {
          exercise_goal_dateStart: 1
        }
      },
      {
        $skip: (Number(page_param) - 1)
      }
    ]);
    return finalResult;
  }
  else if (type_param === "exercise") {
    const finalResult:any = await Exercise.aggregate([
      {
        $match: {
          user_id: user_id_param
        }
      },
      {
        $sort: {
          exercise_dateStart: 1
        }
      },
      {
        $skip: (Number(page_param) - 1)
      }
    ]);
    return finalResult;
  }
  else if (type_param === "foodGoal") {
    const finalResult:any = await FoodGoal.aggregate([
      {
        $match: {
          user_id: user_id_param
        }
      },
      {
        $sort: {
          food_goal_dateStart: 1
        }
      },
      {
        $skip: (Number(page_param) - 1)
      }
    ]);
    return finalResult;
  }
  else if (type_param === "food") {
    const finalResult:any = await Food.aggregate([
      {
        $match: {
          user_id: user_id_param
        }
      },
      {
        $sort: {
          food_dateStart: 1
        }
      },
      {
        $skip: (Number(page_param) - 1)
      }
    ]);
    return finalResult;
  }
  else if (type_param === "moneyGoal") {
    const finalResult:any = await MoneyGoal.aggregate([
      {
        $match: {
          user_id: user_id_param
        }
      },
      {
        $sort: {
          money_goal_dateStart: 1
        }
      },
      {
        $skip: (Number(page_param) - 1)
      }
    ]);
    return finalResult;
  }
  else if (type_param === "money") {
    const finalResult:any = await Money.aggregate([
      {
        $match: {
          user_id: user_id_param
        }
      },
      {
        $sort: {
          money_dateStart: 1
        }
      },
      {
        $skip: (Number(page_param) - 1)
      }
    ]);
    return finalResult;
  }
  else if (type_param === "sleepGoal") {
    const finalResult:any = await SleepGoal.aggregate([
      {
        $match: {
          user_id: user_id_param
        }
      },
      {
        $sort: {
          sleep_goal_dateStart: 1
        }
      },
      {
        $skip: (Number(page_param) - 1)
      }
    ]);
    return finalResult;
  }
  else if (type_param === "sleep") {
    const finalResult:any = await Sleep.aggregate([
      {
        $match: {
          user_id: user_id_param
        }
      },
      {
        $sort: {
          sleep_dateStart: 1
        }
      },
      {
        $skip: (Number(page_param) - 1)
      }
    ]);
    return finalResult;
  }
}

// 4-4. dummy - save -------------------------------------------------------------------------------
export const dummySave = async (
  user_id_param: string,
  OBJECT_param: any,
  type_param: string,
) => {

  if (type_param === "exerciseGoal") {
    const finalResult:any = await ExerciseGoal.insertMany(OBJECT_param);
    return finalResult;
  }
  else if (type_param === "exercise") {
    const finalResult:any = await Exercise.insertMany(OBJECT_param);
    return finalResult;
  }
  else if (type_param === "foodGoal") {
    const finalResult:any = await FoodGoal.insertMany(OBJECT_param);
    return finalResult;
  }
  else if (type_param === "food") {
    const finalResult:any = await Food.insertMany(OBJECT_param);
    return finalResult;
  }
  else if (type_param === "moneyGoal") {
    const finalResult:any = await MoneyGoal.insertMany(OBJECT_param);
    return finalResult;
  }
  else if (type_param === "money") {
    const finalResult:any = await Money.insertMany(OBJECT_param);
    return finalResult;
  }
  else if (type_param === "sleepGoal") {
    const finalResult:any = await SleepGoal.insertMany(OBJECT_param);
    return finalResult;
  }
  else if (type_param === "sleep") {
    const finalResult:any = await Sleep.insertMany(OBJECT_param);
    return finalResult;
  }
}

// 4-5. dummy - delete ----------------------------------------------------------------------------
export const dummyDelete = async (
  user_id_param: string,
  type_param: string
) => {

  if (type_param === "exerciseGoal") {
    const finalResult:any = await ExerciseGoal.deleteMany(
      {
        user_id: user_id_param,
        exercise_goal_dummy: "Y"
      }
    );
    return finalResult;
  }
  else if (type_param === "exercise") {
    const finalResult:any = await Exercise.deleteMany(
      {
        user_id: user_id_param,
        exercise_dummy: "Y"
      }
    );
    return finalResult;
  }
  else if (type_param === "foodGoal") {
    const finalResult:any = await FoodGoal.deleteMany(
      {
        user_id: user_id_param,
        food_goal_dummy: "Y"
      }
    );
    return finalResult;
  }
  else if (type_param === "food") {
    const finalResult:any = await Food.deleteMany(
      {
        user_id: user_id_param,
        food_dummy: "Y"
      }
    );
    return finalResult;
  }
  else if (type_param === "moneyGoal") {
    const finalResult:any = await MoneyGoal.deleteMany(
      {
        user_id: user_id_param,
        money_goal_dummy: "Y"
      }
    );
    return finalResult;
  }
  else if (type_param === "money") {
    const finalResult:any = await Money.deleteMany(
      {
        user_id: user_id_param,
        money_dummy: "Y"
      }
    );
    return finalResult;
  }
  else if (type_param === "sleepGoal") {
    const finalResult:any = await SleepGoal.deleteMany(
      {
        user_id: user_id_param,
        sleep_goal_dummy: "Y"
      }
    );
    return finalResult;
  }
  else if (type_param === "sleep") {
    const finalResult:any = await Sleep.deleteMany(
      {
        user_id: user_id_param,
        sleep_dummy: "Y"
      }
    );
    return finalResult;
  }
}