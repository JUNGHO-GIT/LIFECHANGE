// exerciseChartRepository.js

import { Exercise } from "../../schema/exercise/Exercise.js";
import { ExerciseGoal } from "../../schema/exercise/ExerciseGoal.js";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const barToday = {
  listGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_goal_dateStart: 1,
        exercise_goal_dateEnd: 1,
        exercise_goal_weight: {
          $ifNull: ["$exercise_goal_weight", 0]
        }
      }},
      {$sort: {exercise_goal_dateStart: -1}}
    ]);
    return finalResult;
  },

  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_weight: {
          $ifNull: ["$exercise_total_weight", 0]
        }
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  }
};

// 1-2. chart (bar - week) -------------------------------------------------------------------------
export const barWeek = {
  listGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_goal_dateStart: 1,
        exercise_goal_dateEnd: 1,
        exercise_goal_weight: {
          $ifNull: ["$exercise_goal_weight", 0]
        }
      }},
      {$sort: {exercise_goal_dateStart: -1}}
    ]);
    return finalResult;
  },

  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_weight: {
          $ifNull: ["$exercise_total_weight", 0]
        }
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  }
};

// 1-3. chart (bar - month) ------------------------------------------------------------------------
export const barMonth = {
  listGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_goal_dateStart: 1,
        exercise_goal_dateEnd: 1,
        exercise_goal_weight: {
          $ifNull: ["$exercise_goal_weight", 0]
        }
      }},
      {$sort: {exercise_goal_dateStart: -1}}
    ]);
    return finalResult;
  },

  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_weight: {
          $ifNull: ["$exercise_total_weight", 0]
        }
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  }
};

// 2-1. chart (pie - week) -------------------------------------------------------------------------
export const pieWeek = {
  listPart: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
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
        value: {$sum: 1}
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
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
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
        value: {$sum: 1}
      }},
      {$sort: {count: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  }
};

// 2-2. chart (pie - month) ------------------------------------------------------------------------
export const pieMonth = {
  listPart: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
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
        value: {$sum: 1}
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
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
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
        value: {$sum: 1}
      }},
      {$sort: {count: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  }
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = {
  listVolume: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_volume: 1
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  },

  listCardio: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_cardio: 1
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  }
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = {
  listVolume: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_volume: 1
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  },

  listCardio: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_cardio: 1
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  }
};

// 4-1. chart (avg - week) -------------------------------------------------------------------------
export const avgWeek = {
  listVolume: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_volume: 1
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  },

  listCardio: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_cardio: 1
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  }
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
export const avgMonth = {
  listVolume: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_volume: 1
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  },

  listCardio: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_cardio: 1
      }},
      {$sort: {exercise_dateStart: -1}}
    ]);
    return finalResult;
  }
};