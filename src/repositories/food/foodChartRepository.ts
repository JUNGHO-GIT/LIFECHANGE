// foodChartRepository.ts

import { Food } from "@schemas/food/Food";
import { FoodGoal } from "@schemas/food/FoodGoal";

// 1-1. chart (bar - goal) -------------------------------------------------------------------------
export const barGoal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult = await FoodGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        food_goal_dateStart: 1,
        food_goal_dateEnd: 1,
        food_goal_kcal: 1,
        food_goal_carb: 1,
        food_goal_protein: 1,
        food_goal_fat: 1
      }
    },
    {
      $sort: {
        food_goal_dateStart: -1
      }
    }
  ]);

  return finalResult;
};

// 1-2. chart (bar - real) -------------------------------------------------------------------------
export const barReal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }
    },
    {
      $sort: {
        food_dateStart: -1
      }
    }
  ]);

  return finalResult;
};

// 2-1. chart (pie - kcal) -------------------------------------------------------------------------
export const pieKcal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $unwind: "$food_section"
    },
    {
      $group: {
        _id: "$food_section.food_name",
        value: {
          $sum: {
            $toDouble: "$food_section.food_kcal"
          }
        }
      }
    },
    {
      $sort: {
        value: -1
      }
    },
    {
      $limit: 5
    }
  ]);

  return finalResult;
};

// 2-2. chart (pie - nut) -------------------------------------------------------------------------
export const pieNut = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $group: {
        _id: null,
        total_carb: {
          $sum: {
            $toDouble: "$food_total_carb"
          }
        },
        total_protein: {
          $sum: {
            $toDouble: "$food_total_protein"
          }
        },
        total_fat: {
          $sum: {
            $toDouble: "$food_total_fat"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        food_total_carb: "$total_carb",
        food_total_protein: "$total_protein",
        food_total_fat: "$total_fat"
      }
    },
    {
      $sort: {
        food_dateStart: -1
      }
    }
  ]);

  return finalResult;
};

// 3-1. chart (line - kcal) ------------------------------------------------------------------------
export const lineKcal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1
      }
    },
    {
      $sort: {
        food_dateStart: -1
      }
    }
  ]);

  return finalResult;
};

// 3-2. chart (line - nut) ------------------------------------------------------------------------
export const lineNut = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }
    },
    {
      $sort: {
        food_dateStart: -1
      }
    }
  ]);

  return finalResult;
};

// 4-1. chart (avg - kcal) -------------------------------------------------------------------------
export const avgKcal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1
      }
    },
    {
      $sort: {
        food_dateStart: -1
      }
    }
  ]);

  return finalResult;
};

// 4-2. chart (avg - nut) --------------------------------------------------------------------------
export const avgNut = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }
    },
    {
      $sort: {
        food_dateStart: -1
      }
    }
  ]);

  return finalResult;
};