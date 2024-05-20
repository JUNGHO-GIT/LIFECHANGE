// moneyPlanRepository.js

import mongoose from "mongoose";
import {Money} from "../../schema/money/Money.js";
import {newDate} from "../../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    part_param, title_param,
  ) => {
    const finalResult = await Money.countDocuments({
      user_id: user_id_param,
      money_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      money_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        money_dateType: dateType_param
      }),
      ...(part_param === "전체" ? {} : {
        "money_section.money_part_val": part_param
      }),
      ...(title_param === "전체" ? {} : {
        "money_section.money_title_val": title_param
      })
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    part_param, title_param, sort_param,
    limit_param, page_param,
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        ...(dateType_param === "전체" ? {} : {
          money_dateType: dateType_param
        }),
      }},
      {$project: {
        money_dateType: 1,
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_in: 1,
        money_total_out: 1,
        money_section: {
          $filter: {
            input: "$money_section",
            as: "section",
            cond: {
              $and: [
                part_param === "전체"
                ? {$ne: ["$$section.money_part_val", null]}
                : {$eq: ["$$section.money_part_val", part_param]},
                title_param === "전체"
                ? {$ne: ["$$section.money_title_val", null]}
                : {$eq: ["$$section.money_title_val", title_param]}
              ]
            }
          }
        }
      }},
      {$sort: {
        money_dateStart: sort_param,
        money_dateEnd: sort_param
      }},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      money_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      money_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      money_demo: false,
      money_dateType: dateType_param,
      money_dateStart: dateStart_param,
      money_dateEnd: dateEnd_param,
      money_total_in: OBJECT_param.money_total_in,
      money_total_out: OBJECT_param.money_total_out,
      money_section: OBJECT_param.money_section,
      money_regDt: newDate,
      money_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        money_dateType: dateType_param,
        money_dateStart: dateStart_param,
        money_dateEnd: dateEnd_param,
        money_total_in: OBJECT_param.money_total_in,
        money_total_out: OBJECT_param.money_total_out,
        money_section: OBJECT_param.money_section,
        money_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      money_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, section_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const updateResult = await Money.updateOne(
      {_id: !_id_param ? {$exists:true} : _id_param,
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
      {$pull: {
        money_section: {
          _id: section_id_param
        },
      },
      $set: {
        money_updateDt: newDate,
      }}
    )
    .lean();
    return updateResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await Money.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};