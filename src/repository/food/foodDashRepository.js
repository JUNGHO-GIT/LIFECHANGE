// foodDashRepository.js

import {Food} from "../../schema/food/Food.js";
import {FoodGoal} from "../../schema/food/FoodGoal.js";

// 1-1. dash (bar - today) -------------------------------------------------------------------------
export const barToday = {
  listGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_goal_dateStart: 1,
        food_goal_dateEnd: 1,
        food_goal_kcal: 1,
        food_goal_carb: 1,
        food_goal_protein: 1,
        food_goal_fat: 1
      }},
      {$sort: {food_goal_dateStart: -1}},
    ]);
    return finalResult;
  },

  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  }
};

// 2-1. dash (pie - today) -------------------------------------------------------------------------
export const pieToday = {
  listKcal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$food_section"
      },
      {$group: {
        _id: "$food_section.food_title",
        value: {
          $sum: {
            $toDouble: "$food_section.food_kcal"
          }
        }
      }},
      {$sort: {value: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$group: {
        _id: null,
        total_carb: {$sum: "$food_total_carb"},
        total_protein: {$sum: "$food_total_protein"},
        total_fat: {$sum: "$food_total_fat"}
      }},
      {$project: {
        _id: 0,
        food_total_carb: "$total_carb",
        food_total_protein: "$total_protein",
        food_total_fat: "$total_fat"
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  }
};

// 2-2. dash (pie - week) --------------------------------------------------------------------------
export const pieWeek = {
  listKcal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$food_section"
      },
      {$group: {
        _id: "$food_section.food_title",
        value: {
          $sum: {
            $toDouble: "$food_section.food_kcal"
          }
        }
      }},
      {$sort: {value: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$group: {
        _id: null,
        total_carb: {$sum: "$food_total_carb"},
        total_protein: {$sum: "$food_total_protein"},
        total_fat: {$sum: "$food_total_fat"}
      }},
      {$project: {
        _id: 0,
        food_total_carb: "$total_carb",
        food_total_protein: "$total_protein",
        food_total_fat: "$total_fat"
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  }
};

// 2-3. dash (pie - month) -------------------------------------------------------------------------
export const pieMonth = {
  listKcal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$food_section"
      },
      {$group: {
        _id: "$food_section.food_title",
        value: {
          $sum: {
            $toDouble: "$food_section.food_kcal"
          }
        }
      }},
      {$sort: {value: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$group: {
        _id: null,
        total_carb: {$sum: "$food_total_carb"},
        total_protein: {$sum: "$food_total_protein"},
        total_fat: {$sum: "$food_total_fat"}
      }},
      {$project: {
        _id: 0,
        food_total_carb: "$total_carb",
        food_total_protein: "$total_protein",
        food_total_fat: "$total_fat"
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  }
};

// 3-1. dash (line - week) -------------------------------------------------------------------------
export const lineWeek = {
  listKcal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  }
};

// 3-2. dash (line - month) ------------------------------------------------------------------------
export const lineMonth = {
  listKcal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  }
};

// 4-1. dash (avg - month) -------------------------------------------------------------------------
export const avgMonth = {
  listKcal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  }
};

// 4-2. dash (avg - year) -------------------------------------------------------------------------
export const avgYear = {
  listKcal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_dateStart: -1}},
    ]);
    return finalResult;
  }
};