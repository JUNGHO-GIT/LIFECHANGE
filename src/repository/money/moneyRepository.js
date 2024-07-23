// moneyRepository.js

import mongoose from "mongoose";
import {Money} from "../../schema/money/Money.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = {

  // money_section 의 length 가 0 이상인 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === ""? {} : {
          money_dateType: dateType_param
        }),
      }},
      {$match: {$expr: {
        $gt: [{$size: "$money_section"}, 0]
      }}},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$money_dateStart"}
      }}
    ]);
    return finalResult;
  }
};

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = {
  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await Money.countDocuments({
      user_id: user_id_param,
      money_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      money_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      ...(dateType_param === "" ? {} : {
        money_dateType: dateType_param
      }),
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param, page_param,
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === ""? {} : {
          money_dateType: dateType_param
        }),
      }},
      {$project: {
        money_dateType: 1,
        money_dateStart: 1,
        money_dateEnd: 1,
        money_total_income: 1,
        money_total_expense: 1,
      }},
      {$sort: {money_dateStart: sort_param}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  }
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_dateStart: {
        $eq: dateStart_param,
      },
      money_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === ""? {} : {
        money_dateType: dateType_param
      })
    })
    .lean();
    return finalResult;
  }
};

// 3. save -----------------------------------------------------------------------------------------
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_dateStart: {
        $eq: dateStart_param,
      },
      money_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === ""? {} : {
        money_dateType: dateType_param
      })
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
      money_dummy: "N",
      money_dateType: dateType_param,
      money_dateStart: dateStart_param,
      money_dateEnd: dateEnd_param,
      money_total_income: OBJECT_param.money_total_income,
      money_total_expense: OBJECT_param.money_total_expense,
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
        money_total_income: OBJECT_param.money_total_income,
        money_total_expense: OBJECT_param.money_total_expense,
        money_section: OBJECT_param.money_section,
        money_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_dateStart: {
        $eq: dateStart_param,
      },
      money_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === ""? {} : {
        money_dateType: dateType_param
      })
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
          $eq: dateStart_param,
        },
        money_dateEnd: {
          $eq: dateEnd_param,
        },
        ...(dateType_param === ""? {} : {
          money_dateType: dateType_param
        }),
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