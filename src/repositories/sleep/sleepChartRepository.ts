// sleepChartRepository.ts

import { Sleep } from "@schemas/sleep/Sleep";
import { SleepGoal } from "@schemas/sleep/SleepGoal";

// 1-1. chart (bar - goal) -------------------------------------------------------------------------
export const barGoal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        sleep_goal_dateStart: 1,
        sleep_goal_dateEnd: 1,
        sleep_goal_bedTime: 1,
        sleep_goal_wakeTime: 1,
        sleep_goal_sleepTime: 1,
      }
    },
    {
      $sort: {
        sleep_goal_dateStart: -1
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
  const finalResult:any = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }
    },
    {
      $sort: {
        sleep_dateStart: -1
      }
    }
  ]);

  return finalResult;
};

// 2-1. chart (pie - all) --------------------------------------------------------------------------
export const pieAll = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }
    },
    {
      $sort: {
        sleep_dateStart: -1
      }
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
  const finalResult:any = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }
    },
    {
      $sort: {
        sleep_dateStart: -1
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
  const finalResult:any = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }
    },
    {
      $sort: {
        sleep_dateStart: -1
      }
    }
  ]);

  return finalResult;
};