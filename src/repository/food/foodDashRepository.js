// foodDashRepository.js

import {Food} from "../../schema/food/Food.js";
import {FoodPlan} from "../../schema/food/FoodPlan.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = {
  listPlan: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        food_plan_startDt: {
          $lte: endDt_param,
        },
        food_plan_endDt: {
          $gte: startDt_param
        },
      }},
      {$project: {
        food_plan_startDt: 1,
        food_plan_endDt: 1,
        food_plan_kcal: 1,
        food_plan_carb: 1,
        food_plan_protein: 1,
        food_plan_fat: 1
      }},
      {$sort: {food_plan_startDt: -1}},
    ]);
    return finalResult;
  },

  list: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_kcal: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = {
  listKcal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
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
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
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
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 2-2. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = {
  listKcal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
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
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
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
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = {
  listKcal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
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
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
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
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = {
  listKcal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_kcal: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = {
  listKcal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_kcal: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 4-1. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = {
  listKcal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_kcal: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = {
  listKcal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_kcal: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        food_startDt: 1,
        food_endDt: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};