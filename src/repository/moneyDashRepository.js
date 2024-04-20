// moneyDashRepository.js

import {Money} from "../schema/Money.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = {
  findPlan: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await MoneyPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      money_plan_startDt: {
        $lte: endDt_param
      },
      money_plan_endDt: {
        $gte: startDt_param
      }
    })
    .lean();
    return finalResult;
  },
  findReal: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      }
    })
    .lean();
    return finalResult;
  }
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = {
  findIn: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_val": "수입"
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
  findOut: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_val": "지출"
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

// 2-2. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = {
  findIn: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_val": "수입"
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
  findOut: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_val": "지출"
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

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = {
  findIn: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_val": "수입"
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
  findOut: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$money_section"
      },
      {$match: {
        "money_section.money_part_val": "지출"
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

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = {
  find: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = {
  find: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = {
  find: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = {
  find: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Money.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};