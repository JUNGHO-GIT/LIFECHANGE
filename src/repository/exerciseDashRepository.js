// exerciseDashRepository.js

import {Exercise} from "../schema/Exercise.js";
import {ExercisePlan} from "../schema/ExercisePlan.js";

// 1-1. dash (scatter - today) -------------------------------------------------------------------->
export const scatterToday = {
  findPlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_plan_startDt: {
          $gte: startDt_param,
        },
        exercise_plan_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_plan_weight: 1
      }}
    ]);
    return finalResult;
  },

  findReal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
        },
        exercise_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_body_weight: 1
      }}
    ]);
    return finalResult;
  }
};

// 1-2. dash (scatter - week) --------------------------------------------------------------------->
export const scatterWeek = {
  findPlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_plan_startDt: {
          $gte: startDt_param,
        },
        exercise_plan_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_plan_weight: 1
      }}
    ]);
    return finalResult;
  },

  findReal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
        },
        exercise_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_body_weight: 1
      }}
    ]);
    return finalResult;
  }
};

// 1-3. dash (scatter - month) -------------------------------------------------------------------->
export const scatterMonth = {
  findPlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_plan_startDt: {
          $gte: startDt_param,
        },
        exercise_plan_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_plan_weight: 1
      }}
    ]);
    return finalResult;
  },

  findReal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
        },
        exercise_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_body_weight: 1
      }}
    ]);
    return finalResult;
  }
};

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = {
  findPart: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: {
        path: "$exercise_section"
      }},
      {$match: {
        "exercise_section.exercise_part_val": {$ne: ""}
      }},
      {$group: {
        _id: "$exercise_section.exercise_part_val",
        count: {$sum: 1}
      }},
      {$sort: {count: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  },

  findTitle: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: {
        path: "$exercise_section"
      }},
      {$match: {
        "exercise_section.exercise_title_val": {$ne: ""}
      }},
      {$group: {
        _id: "$exercise_section.exercise_title_val",
        count: {$sum: 1}
      }},
      {$sort: {count: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  }
};

// 2-2. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = {
  findPart: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: {
        path: "$exercise_section"
      }},
      {$match: {
        "exercise_section.exercise_part_val": {$ne: ""}
      }},
      {$group: {
        _id: "$exercise_section.exercise_part_val",
        count: {$sum: 1}
      }},
      {$sort: {count: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  },

  findTitle: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: {
        path: "$exercise_section"
      }},
      {$match: {
        "exercise_section.exercise_title_val": {$ne: ""}
      }},
      {$group: {
        _id: "$exercise_section.exercise_title_val",
        count: {$sum: 1}
      }},
      {$sort: {count: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  }
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = {
  find: async (
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_endDt: {
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_endDt: {
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_endDt: {
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};