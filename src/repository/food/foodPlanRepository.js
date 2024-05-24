// foodPlanRepository.js

import mongoose from "mongoose";
import {FoodPlan} from "../../schema/food/FoodPlan.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist --------------------------------------------------------------------------------------->
export const exist = {

  // food_dateType 이 존재하는 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        food_plan_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        food_plan_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === "전체" ? {} : {
          food_plan_dateType: dateType_param
        }),
      }},
      {$match: {
        food_plan_dateType: {$exists: true}
      }},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$food_plan_dateStart"}
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
    const finalResult = await FoodPlan.countDocuments({
      user_id: user_id_param,
      food_plan_dateStart: {
        $lte: dateEnd_param,
      },
      food_plan_dateEnd: {
        $gte: dateStart_param,
      },
      ...(dateType_param === "전체" ? {} : {
        food_plan_dateType: dateType_param
      }),
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param,
    limit_param, page_param,
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        food_plan_dateStart: {
          $lte: dateEnd_param,
        },
        food_plan_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param === "전체" ? {} : {
          food_plan_dateType: dateType_param
        }),
      }},
      {$sort: {food_plan_dateStart: sort_param}},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
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
    const finalResult = await FoodPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_plan_dateStart: {
        $eq: dateStart_param
      },
      food_plan_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === "전체" ? {} : {
        food_plan_dateType: dateType_param
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
    const finalResult = await FoodPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_plan_dateStart: {
        $eq: dateStart_param
      },
      food_plan_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === "전체" ? {} : {
        food_plan_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodPlan.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      food_plan_demo: false,
      food_plan_dateType: dateType_param,
      food_plan_dateStart: dateStart_param,
      food_plan_dateEnd: dateEnd_param,
      food_plan_kcal: OBJECT_param.food_plan_kcal,
      food_plan_carb: OBJECT_param.food_plan_carb,
      food_plan_protein: OBJECT_param.food_plan_protein,
      food_plan_fat: OBJECT_param.food_plan_fat,
      food_plan_regDt: newDate,
      food_plan_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodPlan.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        food_plan_dateType: dateType_param,
        food_plan_dateStart: dateStart_param,
        food_plan_dateEnd: dateEnd_param,
        food_plan_kcal: OBJECT_param.food_plan_kcal,
        food_plan_carb: OBJECT_param.food_plan_carb,
        food_plan_protein: OBJECT_param.food_plan_protein,
        food_plan_fat: OBJECT_param.food_plan_fat,
        food_plan_updateDt: newDate,
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
    const finalResult = await FoodPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_plan_dateStart: {
        $eq: dateStart_param
      },
      food_plan_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === "전체" ? {} : {
        food_plan_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await FoodPlan.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};