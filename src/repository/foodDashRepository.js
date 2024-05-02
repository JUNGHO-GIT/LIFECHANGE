// foodDashRepository.js

import {Food} from "../schema/Food.js";
import {FoodPlan} from "../schema/FoodPlan.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = {
  listPlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        foodPlan_startDt: {
          $lte: endDt_param,
        },
        foodPlan_endDt: {
          $gte: startDt_param
        },
      }},
      {$project: {
        food_plan_startDt: 1,
        food_plan_endDt: 1,
        food_plan_in: 1,
        food_plan_out: 1
      }},
      {$sort: {food_plan_startDt: -1}},
    ]);
    return finalResult;
  },

  listReal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_in: "$food_total_in",
        food_total_out: "$food_total_out"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = {
  listKcal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_kcal: "$food_total_kcal"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = {
  listKcal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_kcal: "$food_total_kcal"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = {
  listKcal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_kcal: "$food_total_kcal"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = {
  listKcal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_kcal: "$food_total_kcal"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  },

  listNut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
        _id: 0,
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat"
      }},
      {$sort: {food_startDt: -1}},
    ]);
    return finalResult;
  }
};