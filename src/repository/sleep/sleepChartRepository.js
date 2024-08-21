// sleepChartRepository.js

import { Sleep } from "../../schema/sleep/Sleep.js";
import { SleepGoal } from "../../schema/sleep/SleepGoal.js";

// 1-1. chart (bar - today) ---------------------------------------------------------------------
export const barToday = {
  listGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await SleepGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        }
      }},
      {$project: {
        sleep_goal_dateStart: 1,
        sleep_goal_dateEnd: 1,
        sleep_goal_bedTime: 1,
        sleep_goal_wakeTime: 1,
        sleep_goal_sleepTime: 1,
      }},
      {$sort: {sleep_goal_dateStart: 1}}
    ])
    return finalResult;
  },

  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        }
      }},
      {$project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_dateStart: 1}}
    ])
    return finalResult;
  }
};

// 2-1. chart (pie - today) ---------------------------------------------------------------------
export const pieToday = {
  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_dateStart: 1}}
    ]);
    return finalResult;
  }
};

// 2-2. chart (pie - week) ---------------------------------------------------------------------
export const pieWeek = {
  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        }
      }},
      {$project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_dateStart: 1}}
    ]);
    return finalResult;
  }
};

// 2-3. chart (pie - month) ---------------------------------------------------------------------
export const pieMonth = {
  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        }
      }},
      {$project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_dateStart: 1}}
    ])
    return finalResult;
  }
};

// 3-1. chart (line - week) ---------------------------------------------------------------------
export const lineWeek = {
  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        }
      }},
      {$project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_dateStart: 1}}
    ])

    return finalResult;
  }
};

// 3-2. chart (line - month) ------------------------------------------------------------------------
export const lineMonth = {
  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        }
      }},
      {$project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_dateStart: 1}}
    ])
    return finalResult;
  }
};

// 4-1. chart (avg - week) ---------------------------------------------------------------------
export const avgWeek = {
  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        }
      }},
      {$project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_dateStart: 1}}
    ])
    return finalResult;
  }
};

// 4-2. chart (avg - month) ---------------------------------------------------------------------
export const avgMonth = {
  listReal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        }
      }},
      {$project: {
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_dateStart: 1}}
    ])
    return finalResult;
  }
};