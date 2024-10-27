// moneyChartRepository.ts

import { Money } from "@schemas/money/Money";
import { MoneyGoal } from "@schemas/money/MoneyGoal";

// 1-1. chart (bar - goal) -------------------------------------------------------------------------
export const barGoal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await MoneyGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        money_goal_dateStart: 1,
        money_goal_dateEnd: 1,
        money_goal_income: 1,
        money_goal_expense: 1,
      }
    },
    {
      $sort: {
        money_goal_dateStart: 1
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
  const finalResult:any = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1,
      }
    },
    {
      $sort: {
        money_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 2-1. chart (pie - income) ----------------------------------------------------------------------
export const pieIncome = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $unwind: "$money_section"
    },
    {
      $match: {
        "money_section.money_part_idx": 1
      }
    },
    {
      $group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: {
            $toDouble: "$money_section.money_amount"
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

// 2-2. chart (pie - expense) ---------------------------------------------------------------------
export const pieExpense = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $unwind: "$money_section"
    },
    {
      $match: {
        "money_section.money_part_idx": 2
      }
    },
    {
      $group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: {
            $toDouble: "$money_section.money_amount"
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

// 3-1. chart (line - all) -------------------------------------------------------------------------
export const lineAll = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1
      }
    },
    {
      $sort: {
        money_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 4-1. chart (avg - all) --------------------------------------------------------------------------
export const avgAll = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1
      }
    },
    {
      $sort: {
        money_dateStart: 1
      }
    }
  ]);

  return finalResult;
};