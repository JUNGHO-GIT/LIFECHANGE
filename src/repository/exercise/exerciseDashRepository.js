// exerciseDashRepository.js

import {Exercise} from "../../schema/exercise/Exercise.js";
import {ExercisePlan} from "../../schema/exercise/ExercisePlan.js";

// 1-1. dash (scatter - today) -------------------------------------------------------------------->
export const scatterToday = {
  listPlan: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_plan_date_start: {
          $gte: dateStart_param,
        },
        exercise_plan_date_end: {
          $lte: dateEnd_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_plan_weight: 1
      }},
      {$sort: {exercise_plan_date_start: -1}}
    ]);
    return finalResult;
  },

  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
        },
        exercise_date_end: {
          $lte: dateEnd_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_body_weight: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  }
};

// 1-2. dash (scatter - week) --------------------------------------------------------------------->
export const scatterWeek = {
  listPlan: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_plan_date_start: {
          $gte: dateStart_param,
        },
        exercise_plan_date_end: {
          $lte: dateEnd_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_plan_weight: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  },

  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
        },
        exercise_date_end: {
          $lte: dateEnd_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_body_weight: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  }
};

// 1-3. dash (scatter - month) -------------------------------------------------------------------->
export const scatterMonth = {
  listPlan: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_plan_date_start: {
          $gte: dateStart_param,
        },
        exercise_plan_date_end: {
          $lte: dateEnd_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_plan_weight: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  },

  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
        },
        exercise_date_end: {
          $lte: dateEnd_param
        },
      }},
      {$project: {
        _id: 0,
        exercise_body_weight: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  }
};

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = {
  listPart: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
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

  listTitle: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
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
  listPart: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
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

  listTitle: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
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
  listVolume: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_date_start: 1,
        exercise_date_end: 1,
        exercise_total_volume: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  },

  listCardio: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_date_start: 1,
        exercise_date_end: 1,
        exercise_total_cardio: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  }
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = {
  listVolume: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_date_start: 1,
        exercise_date_end: 1,
        exercise_total_volume: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  },

  listCardio: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_date_start: 1,
        exercise_date_end: 1,
        exercise_total_cardio: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  }
};

// 4-1. dash (avg - month) ------------------------------------------------------------------------->
export const avgMonth = {
  listVolume: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_date_start: 1,
        exercise_date_end: 1,
        exercise_total_volume: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  },

  listCardio: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_date_start: 1,
        exercise_date_end: 1,
        exercise_total_cardio: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  }
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = {
  listVolume: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_date_start: 1,
        exercise_date_end: 1,
        exercise_total_volume: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  },

  listCardio: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_date_start: 1,
        exercise_date_end: 1,
        exercise_total_cardio: 1
      }},
      {$sort: {exercise_date_start: -1}}
    ]);
    return finalResult;
  }
};