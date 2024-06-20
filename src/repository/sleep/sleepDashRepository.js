// sleepDashRepository.js

import {Sleep} from "../../schema/sleep/Sleep.js";
import {SleepGoal} from "../../schema/sleep/SleepGoal.js";

// 1-1. dash (bar - today) -------------------------------------------------------------------------
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

  list: async (
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

// 2-1. dash (pie - today) -------------------------------------------------------------------------
export const pieToday = {
  list: async (
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

// 2-2. dash (pie - week) -------------------------------------------------------------------------
export const pieWeek = {
  list: async (
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

// 2-3. dash (pie - month) -------------------------------------------------------------------------
export const pieMonth = {
  list: async (
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

// 3-1. dash (line - week) -------------------------------------------------------------------------
export const lineWeek = {
  list: async (
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

// 3-2. dash (line - month) ------------------------------------------------------------------------
export const lineMonth = {
  list: async (
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

// 4-1. dash (avg - month) -------------------------------------------------------------------------
export const avgMonth = {
  list: async (
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

// 4-2. dash (avg - year) -------------------------------------------------------------------------
export const avgYear = {
  list: async (
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