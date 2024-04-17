// workDashRepository.js

import {Work} from "../schema/Work.js";
import {WorkPlan} from "../schema/WorkPlan.js";

// 1-1. dash (scatter - week) --------------------------------------------------------------------->
export const scatterWeek = {
  findPlan: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await WorkPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        work_plan_startDt: {
          $gte: startDt_param,
        },
        work_plan_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        work_plan_body_weight: 1
      }}
    ]);
    return finalResult;
  },
  findReal: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
        },
        work_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        work_body_weight: 1
      }}
    ]);
    return finalResult;
  }
};

// 1-2. dash (scatter - month) -------------------------------------------------------------------->
export const scatterMonth = {
  findPlan: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await WorkPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        work_plan_startDt: {
          $gte: startDt_param,
        },
        work_plan_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        work_plan_body_weight: 1
      }}
    ]);
    return finalResult;
  },
  findReal: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
        },
        work_endDt: {
          $lte: endDt_param
        },
      }},
      {$project: {
        _id: 0,
        work_body_weight: 1
      }}
    ]);
    return finalResult;
  }
};

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = {
  findPart: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
        work_endDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
      }},
      {$unwind: {
        path: "$work_section"
      }},
      {$match: {
        "work_section.work_part_val": {$ne: ""}
      }},
      {$group: {
        _id: "$work_section.work_part_val",
        count: {$sum: 1}
      }},
      {$sort: {count: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  },
  findTitle: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
        work_endDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
      }},
      {$unwind: {
        path: "$work_section"
      }},
      {$match: {
        "work_section.work_title_val": {$ne: ""}
      }},
      {$group: {
        _id: "$work_section.work_title_val",
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
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
        work_endDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
      }},
      {$unwind: {
        path: "$work_section"
      }},
      {$match: {
        "work_section.work_part_val": {$ne: ""}
      }},
      {$group: {
        _id: "$work_section.work_part_val",
        count: {$sum: 1}
      }},
      {$sort: {count: -1}},
      {$limit: 5}
    ]);
    return finalResult;
  },
  findTitle: async (
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
        work_endDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
      }},
      {$unwind: {
        path: "$work_section"
      }},
      {$match: {
        "work_section.work_title_val": {$ne: ""}
      }},
      {$group: {
        _id: "$work_section.work_title_val",
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
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      work_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      }
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
    const finalResult = await Work.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      work_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      }
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
    const finalResult = await Work.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      work_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      }
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
    const finalResult = await Work.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      work_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      }
    })
    .lean();
    return finalResult;
  }
};