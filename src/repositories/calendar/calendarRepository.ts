// calendarRepository.ts

import mongoose from "mongoose";
import { Calendar } from "@schemas/calendar/Calendar";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.aggregate([
    {
      $match: {
        user_id: user_id_param,
        calendar_dateStart: {
          $lte: dateEnd_param
        },
        calendar_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 0,
        calendar_dateType: 1,
        calendar_dateStart: 1,
        calendar_dateEnd: 1,
      }
    },
    {
      $sort: {
        calendar_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.countDocuments(
    {
      user_id: user_id_param,
      calendar_dateStart: {
        $lte: dateEnd_param,
      },
      calendar_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    }
  );

  return finalResult;
};

// 1. list -----------------------------------------------------------------------------------------
export const list = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
  sort_param: 1 | -1,
  page_param: number,
) => {

  const finalResult:any = await Calendar.aggregate([
    {
      $match: {
        user_id: user_id_param,
        calendar_dateStart: {
          $lte: dateEnd_param,
        },
        calendar_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 1,
        calendar_dateType: 1,
        calendar_dateStart: 1,
        calendar_dateEnd: 1,
        calendar_section: 1,
      }
    },
    {
      $sort: {
        calendar_dateStart: sort_param
      }
    },
    {
      $skip: (Number(page_param) - 1)
    }
  ]);

  return finalResult;
};

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.findOne(
    {
      user_id: user_id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. create ---------------------------------------------------------------------------------------
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      calendar_dummy: "N",
      calendar_dateType: dateType_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      calendar_section: OBJECT_param.calendar_section,
      calendar_regDt: newDate,
      calendar_updateDt: "",
    }
  );

  return finalResult;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = {

  // 1. update (기존항목 유지 + 타겟항목으로 수정)
  update: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Calendar.findOneAndUpdate(
      {
        user_id: user_id_param,
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      },
      {
        $set: {
          calendar_section: OBJECT_param.calendar_section,
          calendar_updateDt: newDate
        },
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  },

  // 2. insert (기존항목 제거 + 타겟항목에 추가)
  insert: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Calendar.findOneAndUpdate(
      {
        user_id: user_id_param,
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      },
      {
        $set: {
          calendar_updateDt: newDate,
        },
        $push: {
          calendar_section: OBJECT_param.calendar_section
        }
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  },

  // 3. replace (기존항목 제거 + 타겟항목을 교체)
  replace: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Calendar.findOneAndUpdate(
      {
        user_id: user_id_param,
        calendar_dateStart: dateStart_param,
        calendar_dateEnd: dateEnd_param,
        ...dateType_param ? { calendar_dateType: dateType_param } : {},
      },
      {
        $set: {
          calendar_section: OBJECT_param.calendar_section,
          calendar_updateDt: newDate
        },
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  }
};

// 4. insert (기존항목 제거 + 타겟항목에 끼워넣기) -------------------------------------------------
export const insert = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.findOneAndUpdate(
    {
      user_id: user_id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    },
    {
      $set: {
        calendar_updateDt: newDate,
      },
      $push: {
        calendar_section: OBJECT_param.calendar_section
      }
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 5. replace (기존항목 제거 + 타겟항목을 대체) ----------------------------------------------------
export const replace = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.findOneAndUpdate(
    {
      user_id: user_id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    },
    {
      $set: {
        calendar_section: OBJECT_param.calendar_section,
        calendar_updateDt: newDate
      },
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 5. delete ---------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Calendar.findOneAndDelete(
    {
      user_id: user_id_param,
      calendar_dateStart: dateStart_param,
      calendar_dateEnd: dateEnd_param,
      ...dateType_param ? { calendar_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};