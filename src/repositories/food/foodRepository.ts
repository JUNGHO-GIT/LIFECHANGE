// foodRepository.ts

import mongoose from "mongoose";
import { Food } from "@schemas/food/Food";
import { User } from "@schemas/user/User";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $lte: dateEnd_param
        },
        food_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { food_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 0,
        food_dateType: 1,
        food_dateStart: 1,
        food_dateEnd: 1,
      }
    },
    {
      $sort: {
        food_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Food.countDocuments(
    {
      user_id: user_id_param,
      food_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      food_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      ...dateType_param ? { food_dateType: dateType_param } : {},
    }
  );

  return finalResult;
};

// 1. list -----------------------------------------------------------------------------------------
export const list = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
  sort_param: 1 | -1,
  page_param: number,
) => {

  const finalResult:any = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? { food_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 0,
        food_dateType: 1,
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1,
      }
    },
    {
      $sort: {
        food_dateStart: sort_param
      }
    },
    {
      $skip: (Number(page_param) - 1)
    }
  ]);

  return finalResult;
};

// 1-2. listFavorite -------------------------------------------------------------------------------
export const listFavorite = async (
  user_id_param: string,
) => {

  const finalResult:any = await User.findOne(
    {
      user_id: user_id_param
    },
    {
      _id: 0,
      user_favorite: 1
    }
  )
  .lean();

  return finalResult.user_favorite;
};

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Food.findOne(
    {
      user_id: user_id_param,
      food_dateStart: dateStart_param,
      food_dateEnd: dateEnd_param,
      ...dateType_param ? { food_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. create ---------------------------------------------------------------------------------------
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Food.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      food_dateType: dateType_param,
      food_dateStart: dateStart_param,
      food_dateEnd: dateEnd_param,
      food_total_kcal: OBJECT_param.food_total_kcal,
      food_total_carb: OBJECT_param.food_total_carb,
      food_total_protein: OBJECT_param.food_total_protein,
      food_total_fat: OBJECT_param.food_total_fat,
      food_section: OBJECT_param.food_section,
      food_regDt: new Date(),
      food_updateDt: "",
    }
  );

  return finalResult;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = {

  // 1. update (기존항목 유지 + 타겟항목으로 수정)
  update: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Food.findOneAndUpdate(
      {
        user_id: user_id_param,
        food_dateStart: dateStart_param,
        food_dateEnd: dateEnd_param,
        ...dateType_param ? { food_dateType: dateType_param } : {},
      },
      {
        $set: {
          food_total_kcal: OBJECT_param.food_total_kcal,
          food_total_carb: OBJECT_param.food_total_carb,
          food_total_protein: OBJECT_param.food_total_protein,
          food_total_fat: OBJECT_param.food_total_fat,
          food_section: OBJECT_param.food_section,
          food_updateDt: new Date(),
        }
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  },

  // 2. insert (기존항목 제거 + 타겟항목에 추가)
  insert: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const findResult: any = await Food.findOne(
      {
        user_id: user_id_param,
        food_dateStart: dateStart_param,
        food_dateEnd: dateEnd_param,
        ...dateType_param ? { food_dateType: dateType_param } : {},
      },
    )
    .lean();

    const newKcal = String (
      parseFloat(findResult.food_total_kcal) +
      parseFloat(OBJECT_param.food_total_kcal)
    );
    const newCarb = String (
      parseFloat(findResult.food_total_carb) +
      parseFloat(OBJECT_param.food_total_carb)
    );
    const newProtein = String (
      parseFloat(findResult.food_total_protein) +
      parseFloat(OBJECT_param.food_total_protein)
    );
    const newFat = String (
      parseFloat(findResult.food_total_fat) +
      parseFloat(OBJECT_param.food_total_fat)
    );

    const finalResult:any = await Food.updateOne(
      {
        user_id: user_id_param,
        food_dateStart: dateStart_param,
        food_dateEnd: dateEnd_param,
        ...dateType_param ? { food_dateType: dateType_param } : {},
      },
      {
        $set: {
          food_total_kcal: newKcal,
          food_total_carb: newCarb,
          food_total_protein: newProtein,
          food_total_fat: newFat,
          food_updateDt: new Date(),
        },
        $push: {
          food_section: OBJECT_param.food_section
        }
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  },

  // 3. replace (기존항목 제거 + 타겟항목을 교체)
  replace: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Food.findOneAndUpdate(
      {
        user_id: user_id_param,
        food_dateStart: dateStart_param,
        food_dateEnd: dateEnd_param,
        ...dateType_param ? { food_dateType: dateType_param } : {},
      },
      {
        $set: {
          food_total_kcal: OBJECT_param.food_total_kcal,
          food_total_carb: OBJECT_param.food_total_carb,
          food_total_protein: OBJECT_param.food_total_protein,
          food_total_fat: OBJECT_param.food_total_fat,
          food_section: OBJECT_param.food_section,
          food_updateDt: new Date(),
        }
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  },

  // 4. updateFavorite
  favorite: async (
    user_id_param: string,
    foodFavorite_param: any,
  ) => {

    const finalResult:any = await User.findOneAndUpdate(
      {
        user_id: user_id_param
      },
      {
        $set: {
          user_favorite: foodFavorite_param
        }
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult.user_favorite;
  },
};

// 5. delete ---------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Food.findOneAndDelete(
    {
      user_id: user_id_param,
      food_dateStart: dateStart_param,
      food_dateEnd: dateEnd_param,
      ...dateType_param ? { food_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};