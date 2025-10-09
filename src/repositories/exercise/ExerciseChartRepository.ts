// exerciseChartRepository.ts

import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { ExerciseRecord } from "@schemas/exercise/ExerciseRecord";

// 1-1. chart (bar - goal) -------------------------------------------------------------------------
export const barGoal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        exercise_goal_dateStart: 1,
        exercise_goal_dateEnd: 1,
        exercise_goal_scale: {
          $ifNull: ["$exercise_goal_scale", 0]
        }
      }
    },
    {
      $sort: {
        exercise_goal_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 1-2. chart (bar - record) -------------------------------------------------------------------------
export const barRecord = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        exercise_record_dateStart: 1,
        exercise_record_dateEnd: 1,
        exercise_record_total_scale: {
          $ifNull: ["$exercise_record_total_scale", 0]
        }
      }
    },
    {
      $sort: {
        exercise_record_dateStart:-1
      }
    }
  ]);

  return finalResult;
};

// 2-1. chart (pie - part) -------------------------------------------------------------------------
export const piePart = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $unwind: {
        path: "$exercise_section"
      }
    },
    {
      $match: {
        "exercise_section.exercise_record_part": {
          $ne: ""
        }
      }
    },
    {
      $group: {
        _id: "$exercise_section.exercise_record_part",
        value: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    },
    {
      $limit: 5
    }
  ]);

  return finalResult;
};

// 2-2. chart (pie - title) ------------------------------------------------------------------------
export const pieTitle = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $unwind: {
        path: "$exercise_section"
      }
    },
    {
      $match: {
        "exercise_section.exercise_record_title": {
          $ne: ""
        }
      }
    },
    {
      $group: {
        _id: "$exercise_section.exercise_record_title",
        value: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    },
    {
      $limit: 5
    }
  ]);

  return finalResult;
};

// 3-1. chart (line - scale) -----------------------------------------------------------------------
export const lineScale = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        exercise_record_dateStart: 1,
        exercise_record_dateEnd: 1,
        exercise_record_total_scale: 1
      }
    },
    {
      $sort: {
        exercise_record_dateStart:-1
      }
    }
  ]);

  return finalResult;
};

// 3-2. chart (line - volume) ----------------------------------------------------------------------
export const lineVolume = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        exercise_record_dateStart: 1,
        exercise_record_dateEnd: 1,
        exercise_record_total_volume: 1
      }
    },
    {
      $sort: {
        exercise_record_dateStart:-1
      }
    }
  ]);

  return finalResult;
};

// 3-3. chart (line - cardio) ----------------------------------------------------------------------
export const lineCardio = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        exercise_record_dateStart: 1,
        exercise_record_dateEnd: 1,
        exercise_record_total_cardio: 1
      }
    },
    {
      $sort: {
        exercise_record_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 4-1. chart (avg - volume) -----------------------------------------------------------------------
export const avgVolume = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        exercise_record_dateStart: 1,
        exercise_record_dateEnd: 1,
        exercise_record_total_volume: 1
      }
    },
    {
      $sort: {
        exercise_record_dateStart:-1
      }
    }
  ]);

  return finalResult;
};

// 4-2. chart (avg - cardio) -----------------------------------------------------------------------
export const avgCardio = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        exercise_record_dateStart: 1,
        exercise_record_dateEnd: 1,
        exercise_record_total_cardio: 1
      }
    },
    {
      $sort: {
        exercise_record_dateStart:-1
      }
    }
  ]);

  return finalResult;
};