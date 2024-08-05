// moneyChartRepository.js

import {Money} from "../../schema/money/Money.js";
import {MoneyGoal} from "../../schema/money/MoneyGoal.js";

// 1-1. chart (bar - today) ---------------------------------------------------------------------
export const barToday = {
  listGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        money_goal_dateStart: 1,
        money_goal_dateEnd: 1,
        money_goal_income: 1,
        money_goal_expense: 1,
      }},
      {$sort: {money_goal_dateStart: 1}}
    ]);
    return finalResult;
  },

  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1,
      }},
      {$sort: {money_dateStart: 1}}
    ]);
    return finalResult;
  }
};

// 2-1. chart (pie - today) ---------------------------------------------------------------------
export const pieToday = {
  listIncome: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_idx": 1
      }},
      {$addFields: {
        "money_section.money_amount": {
          $toDouble: "$money_section.money_amount"
        }
      }},
      {$group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: "$money_section.money_amount"
        }
      }},
      {$sort: {value: -1}},
      {$limit: 10}
    ]);
    return finalResult;
  },

  listExpense: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_idx": 2
      }},
      {$addFields: {
        "money_section.money_amount": {
          $toDouble: "$money_section.money_amount"
        }
      }},
      {$group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: "$money_section.money_amount"
        }
      }},
      {$sort: {value: -1}},
      {$limit: 10}
    ]);
    return finalResult;
  }
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
export const pieWeek = {
  listIncome: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_idx": 1
      }},
      {$group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: "$money_section.money_amount"
        }
      }},
      {$sort: {value: -1}},
      {$limit: 10}
    ]);
    return finalResult;
  },

  listExpense: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_idx": 2
      }},
      {$group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: "$money_section.money_amount"
        }
      }},
      {$sort: {value: -1}},
      {$limit: 10}
    ]);
    return finalResult;
  }
};

// 2-3. chart (pie - month) ---------------------------------------------------------------------
export const pieMonth = {
  listIncome: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_idx": 1
      }},
      {$group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: "$money_section.money_amount"
        }
      }},
      {$sort: {value: -1}},
      {$limit: 10}
    ]);
    return finalResult;
  },

  listExpense: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_idx": 2
      }},
      {$group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: "$money_section.money_amount"
        }
      }},
      {$sort: {value: -1}},
      {$limit: 10}
    ]);
    return finalResult;
  }
};

// 3-1. chart (line - week) ---------------------------------------------------------------------
export const lineWeek = {
  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1,
      }},
      {$sort: {money_dateStart: 1}}
    ]);
    return finalResult;
  },
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = {
  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1,
      }},
      {$sort: {money_dateStart: 1}}
    ]);
    return finalResult;
  },
};

// 4-1. chart (avg - week) ---------------------------------------------------------------------
export const avgWeek = {
  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1,
      }},
      {$sort: {money_dateStart: 1}}
    ]);
    return finalResult;
  },
};

// 4-2. chart (avg - month) ---------------------------------------------------------------------
export const avgMonth = {
  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1,
      }},
      {$sort: {money_dateStart: 1}}
    ]);
    return finalResult;
  },
};