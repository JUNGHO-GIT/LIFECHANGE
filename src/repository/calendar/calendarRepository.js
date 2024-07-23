// calendarRepository.js

import mongoose from "mongoose";
import {Calendar} from "../../schema/calendar/Calendar.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = {

  // calendar_section 의 length 가 0 이상인 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Calendar.aggregate([
      {$match: {
        user_id: user_id_param,
        calendar_dateStart: {
          $lte: dateEnd_param,
        },
        calendar_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param === ""? {} : {
          calendar_dateType: dateType_param
        }),
      }},
      {$match: {$expr: {
        $gt: [{$size: "$calendar_section"}, 0]
      }}},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$calendar_dateStart"}
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
    const finalResult = await Calendar.countDocuments({
      user_id: user_id_param,
      calendar_dateStart: {
        $lte: dateEnd_param,
      },
      calendar_dateEnd: {
        $gte: dateStart_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await Calendar.aggregate([
      {$match: {
        user_id: user_id_param,
        calendar_dateStart: {
          $lte: dateEnd_param,
        },
        calendar_dateEnd: {
          $gte: dateStart_param,
        },
      }},
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
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_dateStart: {
        $eq: dateStart_param
      },
      calendar_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === ""? {} : {
        calendar_dateType: dateType_param
      }),
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
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_dateStart: {
        $eq: dateStart_param
      },
      calendar_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === ""? {} : {
        calendar_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Calendar.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      calendar_dummy: "N",
      calendar_dateType: dateType_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      calendar_section: OBJECT_param.calendar_section,
      calendar_regDt: newDate,
      calendar_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Calendar.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        calendar_dateType: dateType_param,
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
        calendar_section: OBJECT_param.calendar_section,
        calendar_updateDt: newDate
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
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_dateStart: {
        $eq: dateStart_param
      },
      calendar_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === ""? {} : {
        calendar_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, section_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const updateResult = await Calendar.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param,
        calendar_dateStart: {
          $eq: dateStart_param
        },
        calendar_dateEnd: {
          $eq: dateEnd_param
        },
      },
      {$pull: {
        calendar_section: {
          _id: section_id_param
        },
      },
      $set: {
        calendar_updateDt: newDate,
      }}
    )
    .lean();
    return updateResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await Calendar.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};