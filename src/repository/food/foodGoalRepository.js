// foodGoalRepository.js

import mongoose from "mongoose";
import {FoodGoal} from "../../schema/food/FoodGoal.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist --------------------------------------------------------------------------------------->
export const exist = {

  // food_dateType 이 존재하는 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
      }},
      {$match: {
        food_goal_dateType: {$exists: true}
      }},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$food_goal_dateStart"}
      }}
    ]);
    return finalResult;
  }
};

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await FoodGoal.countDocuments({
      user_id: user_id_param,
      food_goal_dateStart: {
        $lte: dateEnd_param,
      },
      food_goal_dateEnd: {
        $gte: dateStart_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param, page_param,
  ) => {
    const finalResult = await FoodGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
        },
      }},
      {$project: {
        _id: 1,
        food_goal_dateType: 1,
        food_goal_dateStart: 1,
        food_goal_dateEnd: 1,
        food_goal_kcal: 1,
        food_goal_carb: 1,
        food_goal_protein: 1,
        food_goal_fat: 1,
      }},
      {$sort: {food_goal_dateStart: sort_param}},
      {$skip: Number(page_param - 1)},
    ]);
    return finalResult;
  }
};

// 2. detail (상세는 eq) -------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_goal_dateStart: {
        $eq: dateStart_param
      },
      food_goal_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === "전체" ? {} : {
        food_goal_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  }
};
// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_goal_dateStart: {
        $eq: dateStart_param
      },
      food_goal_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === "전체" ? {} : {
        food_goal_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodGoal.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      food_goal_dummy: false,
      food_goal_dateType: dateType_param,
      food_goal_dateStart: dateStart_param,
      food_goal_dateEnd: dateEnd_param,
      food_goal_kcal: OBJECT_param.food_goal_kcal,
      food_goal_carb: OBJECT_param.food_goal_carb,
      food_goal_protein: OBJECT_param.food_goal_protein,
      food_goal_fat: OBJECT_param.food_goal_fat,
      food_goal_regDt: newDate,
      food_goal_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodGoal.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        food_goal_dateType: dateType_param,
        food_goal_dateStart: dateStart_param,
        food_goal_dateEnd: dateEnd_param,
        food_goal_kcal: OBJECT_param.food_goal_kcal,
        food_goal_carb: OBJECT_param.food_goal_carb,
        food_goal_protein: OBJECT_param.food_goal_protein,
        food_goal_fat: OBJECT_param.food_goal_fat,
        food_goal_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};
// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_goal_dateStart: {
        $eq: dateStart_param
      },
      food_goal_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === "전체" ? {} : {
        food_goal_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await FoodGoal.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};