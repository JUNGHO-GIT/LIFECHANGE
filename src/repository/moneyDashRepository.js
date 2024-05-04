// moneyDashRepository.js

import {Money} from "../schema/Money.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = {
  listPlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_plan_startDt: {
          $lte: endDt_param,
        },
        money_plan_endDt: {
          $gte: startDt_param,
        },
      }},
      {$project: {
        money_plan_startDt: 1,
        money_plan_endDt: 1,
        money_plan_in: 1,
        money_plan_out: 1,
      }},
      {$sort: {money_plan_startDt: 1}}
    ]);
    return finalResult;
  },

  list: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_in: 1,
        money_total_out: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  }
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = {
  listIn: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
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

  listOut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
  listIn: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
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

  listOut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
  listIn: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
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

  listOut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
  listIn: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_in: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  },

  listOut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_out: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  }
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = {
  listIn: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_in: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  },

  listOut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_out: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  }
};

// 4-1. dash (avg - month) ------------------------------------------------------------------------->
export const avgMonth = {
  listIn: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_in: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  },

  listOut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_out: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  }
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = {
  listIn: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_in: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  },

  listOut: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
        money_total_out: 1,
      }},
      {$sort: {money_startDt: 1}}
    ]);
    return finalResult;
  }
};