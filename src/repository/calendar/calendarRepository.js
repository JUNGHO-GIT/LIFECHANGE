// calendarPlanRepository.js

import mongoose from "mongoose";
import {Calendar} from "../../schema/calendar/Calendar.js";
import {newDate} from "../../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
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
      }}
    ]);
    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
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
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
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
      calendar_demo: false,
      calendar_dateType: OBJECT_param.calendar_dateType,
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
        calendar_dateType: OBJECT_param.calendar_dateType,
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

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Calendar.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
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
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
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