// moneyPlanRepository.js

import mongoose from "mongoose";
import {Money} from "../schema/Money.js";
import {fmtDate} from "../assets/common/Common.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  part_param,
  title_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Money.countDocuments({
    user_id: user_id_param,
    money_startDt: {
      $gte: startDt_param,
    },
    money_endDt: {
      $lte: endDt_param,
    },
    ...(part_param !== "전체" && {
      "money_section.money_part_val": part_param
    }),
    ...(title_param !== "전체" && {
      "money_section.money_title_val": title_param
    }),
  });

  return finalResult;
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  find: async (
    user_id_param,
    part_param,
    title_param,
    sort_param,
    limit_param,
    page_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
      }},
      {$project: {
        money_startDt: 1,
        money_endDt: 1,
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
        money_startDt: sort_param,
        money_endDt: sort_param
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
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Money.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      }
    })
    .lean();

    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Money.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      }
    })
    .lean();

    return finalResult;
  },
  create: async (
    user_id_param,
    MONEY_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Money.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      money_startDt: startDt_param,
      money_endDt: endDt_param,
      money_total_in: MONEY_param.money_total_in,
      money_total_out: MONEY_param.money_total_out,
      money_section: MONEY_param.money_section,
      money_regDt: fmtDate,
      money_upDt: "",
    });

    return finalResult;
  },
  update: async (
    _id_param,
    MONEY_param
  ) => {

    const finalResult = await Money.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...MONEY_param,
        money_upDt: fmtDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  }
};

// 4. delete -------------------------------------------------------------------------------------->
export const deletes = {
  deletes: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const updateResult = await Money.updateOne(
      {user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      },
      {$pull: {
          money_section: {
            _id: _id_param
          },
        },
        $set: {
          money_upDt: fmtDate,
        },
      },
      {arrayFilters: [{
        "elem._id": _id_param
      }]}
    )
    .lean();

    let finalResult;

    if (updateResult.modifiedCount > 0) {
      const doc = await Money.findOne({
        user_id: user_id_param,
        money_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        }
      })
      .lean();

      if ((doc) && (!doc.money_section || doc.money_section.length === 0)) {
        finalResult = await Money.deleteOne({
          _id: doc._id
        })
        .lean();
      }
    };

    return finalResult;
  }
};