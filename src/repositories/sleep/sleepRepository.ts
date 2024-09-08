// sleepRepository.ts

import mongoose from "mongoose";
import { Sleep } from "@schemas/sleep/Sleep";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = {

  // sleep_section 의 length 가 0 이상인 경우
  exist: async (
    user_id_param: string,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
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
        },
        ...((!dateType_param || dateType_param === "") ? {} : {
          sleep_dateType: dateType_param
        }),
      }},
      {$match: {$expr: {
        $gt: [{$size: "$sleep_section"}, 0]
      }}},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$sleep_dateStart"}
      }}
    ]);
    return finalResult;
  }
};

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = {

  cnt: async (
    user_id_param: string,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const finalResult = await Sleep.countDocuments({
      user_id: user_id_param,
      sleep_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      sleep_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        sleep_dateType: dateType_param
      }),
    });
    return finalResult;
  },

  listReal: async (
    user_id_param: string,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
    sort_param: 1 | -1,
    page_param: number,
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
        },
        ...((!dateType_param || dateType_param === "") ? {} : {
          sleep_dateType: dateType_param
        }),
      }},
      {$unwind: "$sleep_section"},
      {$project: {
        _id: 1,
        sleep_dateType: 1,
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: [{
          _id: "$sleep_section._id",
          sleep_bedTime: "$sleep_section.sleep_bedTime",
          sleep_wakeTime: "$sleep_section.sleep_wakeTime",
          sleep_sleepTime: "$sleep_section.sleep_sleepTime",
        }]
      }},
      {$sort: {sleep_dateStart: sort_param}},
      {$skip: Number(page_param - 1)},
    ]);

    return finalResult;
  },
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = {
  detail: async (
    user_id_param: string,
    _id_param: string,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_dateStart: {
        $eq: dateStart_param,
      },
      sleep_dateEnd: {
        $eq: dateEnd_param,
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        sleep_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  }
};

// 3. save -----------------------------------------------------------------------------------------
export const save = {
  detail: async (
    user_id_param: string,
    _id_param: string,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_dateStart: {
        $eq: dateStart_param,
      },
      sleep_dateEnd: {
        $eq: dateEnd_param,
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        sleep_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param: string,
    OBJECT_param: Record<string, any>,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const finalResult = await Sleep.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      sleep_dummy: "N",
      sleep_dateType: dateType_param,
      sleep_dateStart: dateStart_param,
      sleep_dateEnd:  dateEnd_param,
      sleep_section: OBJECT_param.sleep_section,
      sleep_regDt: newDate,
      sleep_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param: string,
    _id_param: string,
    OBJECT_param: Record<string, any>,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const finalResult = await Sleep.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        sleep_dateType: dateType_param,
        sleep_dateStart: dateStart_param,
        sleep_dateEnd: dateEnd_param,
        sleep_section: OBJECT_param.sleep_section,
        sleep_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 5. deletes --------------------------------------------------------------------------------------
export const deletes = {
  detail: async (
    user_id_param: string,
    _id_param: string,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const finalResult = await Sleep.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_dateStart: {
        $eq: dateStart_param,
      },
      sleep_dateEnd: {
        $eq: dateEnd_param,
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        sleep_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  update: async (
    user_id_param: string,
    _id_param: string,
    section_id_param: string,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const updateResult = await Sleep.updateOne(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param,
        sleep_dateStart: {
          $eq: dateStart_param,
        },
        sleep_dateEnd: {
          $eq: dateEnd_param,
        },
        ...((!dateType_param || dateType_param === "") ? {} : {
          sleep_dateType: dateType_param
        }),
      },
      {$pull: {
        sleep_section: {
          _id: section_id_param
        },
      },
      $set: {
        sleep_updateDt: newDate,
      }}
    )
    .lean();
    return updateResult;
  },

  deletes: async (
    user_id_param: string,
    _id_param: string,
  ) => {
    const deleteResult = await Sleep.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};