/**
 * @file MoneyRecordRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { incrementSeq } from "@schemas/Counter";
import { MoneyRecord } from "@schemas/money/MoneyRecord";
import mongoose from "mongoose";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await MoneyRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_record_dateStart: {
          $lte: dateEnd_param,
        },
        money_record_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
      },
    },
    {
      $project: {
        _id: 0,
        money_record_dateType: 1,
        money_record_dateStart: 1,
        money_record_dateEnd: 1,
      },
    },
    {
      $sort: {
        money_record_dateStart: 1,
      },
    },
  ]);

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
  part_param?: string,
  title_param?: string,
) => {
  // part, title 필터 조건 구성
  const matchSection: any = {};
  if (part_param && part_param !== `all`) {
    matchSection[`money_section.money_record_part`] = part_param;
  }
  if (title_param && title_param !== `all`) {
    matchSection[`money_section.money_record_title`] = title_param;
  }

  const finalResult: any = await MoneyRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
        ...matchSection,
      },
    },
    {
      $project: {
        _id: 0,
        money_record_dateType: 1,
        money_record_dateStart: 1,
        money_record_dateEnd: 1,
        money_record_total_income: 1,
        money_record_total_expense: 1,
        money_section: {
          $filter: {
            input: `$money_section`,
            as: `section`,
            cond: {
              $and: [
                part_param && part_param !== `all`
                  ? { $eq: [`$$section.money_record_part`, part_param] }
                  : true,
                title_param && title_param !== `all`
                  ? { $eq: [`$$section.money_record_title`, title_param] }
                  : true,
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        money_record_total_income: {
          $toString: {
            $reduce: {
              input: `$money_section`,
              initialValue: 0,
              in: {
                $cond: [
                  {
                    $and: [
                      { $eq: [`$$this.money_record_part`, `income`] },
                      { $eq: [`$$this.money_record_include`, `Y`] },
                      {
                        $not: [
                          {
                            $and: [
                              { $eq: [`$$this.money_record_scheduled`, `Y`] },
                              {
                                $eq: [
                                  `$$this.money_record_scheduled_done`,
                                  `N`,
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    $add: [
                      `$$value`,
                      { $toDouble: `$$this.money_record_amount` },
                    ],
                  },
                  `$$value`,
                ],
              },
            },
          },
        },
        money_record_total_expense: {
          $toString: {
            $reduce: {
              input: `$money_section`,
              initialValue: 0,
              in: {
                $cond: [
                  {
                    $and: [
                      { $eq: [`$$this.money_record_part`, `expense`] },
                      { $eq: [`$$this.money_record_include`, `Y`] },
                      {
                        $not: [
                          {
                            $and: [
                              { $eq: [`$$this.money_record_scheduled`, `Y`] },
                              {
                                $eq: [
                                  `$$this.money_record_scheduled_done`,
                                  `N`,
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    $add: [
                      `$$value`,
                      { $toDouble: `$$this.money_record_amount` },
                    ],
                  },
                  `$$value`,
                ],
              },
            },
          },
        },
      },
    },
    {
      $sort: {
        money_record_dateStart: sort_param,
      },
    },
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
  const finalResult: any = await MoneyRecord.findOne({
    user_id: user_id_param,
    money_record_dateStart: dateStart_param,
    money_record_dateEnd: dateEnd_param,
    ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
  }).lean();

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
  const finalResult: any = await MoneyRecord.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    money_record_dateType: dateType_param,
    money_record_dateStart: dateStart_param,
    money_record_dateEnd: dateEnd_param,
    money_record_total_income: OBJECT_param.money_record_total_income,
    money_record_total_expense: OBJECT_param.money_record_total_expense,
    money_section: OBJECT_param.money_section,
    money_record_regDt: new Date(),
    money_record_updateDt: ``,
  });

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
    // upsert 신규 삽입 시 pre('save') 가 우회되어 number 가 0 으로 남는 문제 방지 (insert 일 때만 채번)
    const existDoc: any = await MoneyRecord.findOne({
      user_id: user_id_param,
      money_record_dateStart: dateStart_param,
      money_record_dateEnd: dateEnd_param,
      ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
    }).lean();
    const setOnInsert: any = existDoc
      ? {}
      : {
          money_record_number: await incrementSeq(
            `money_record_number`,
            `MoneyRecord`,
          ),
        };

    const finalResult: any = await MoneyRecord.findOneAndUpdate(
      {
        user_id: user_id_param,
        money_record_dateStart: dateStart_param,
        money_record_dateEnd: dateEnd_param,
        ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
      },
      {
        $set: {
          money_record_total_income: OBJECT_param.money_record_total_income,
          money_record_total_expense: OBJECT_param.money_record_total_expense,
          money_section: OBJECT_param.money_section,
          money_record_updateDt: new Date(),
        },
        $setOnInsert: setOnInsert,
      },
      {
        upsert: true,
        returnDocument: `after`,
      },
    ).lean();

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
    const findResult: any = await MoneyRecord.findOne({
      user_id: user_id_param,
      money_record_dateStart: dateStart_param,
      money_record_dateEnd: dateEnd_param,
      ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
    }).lean();

    // 대상 날짜에 기존 레코드가 없을 때 null 역참조 방지
    const base: any = findResult ?? {};
    const newIncome: string = String(
      Number.parseFloat((base.money_record_total_income as string) ?? `0`) +
        Number.parseFloat(OBJECT_param.money_record_total_income as string),
    );
    const newExpense: string = String(
      Number.parseFloat((base.money_record_total_expense as string) ?? `0`) +
        Number.parseFloat(OBJECT_param.money_record_total_expense as string),
    );

    // upsert 신규 삽입 시 number 0 잔존 방지 (기존 레코드 없을 때만 채번)
    const setOnInsert: any = findResult
      ? {}
      : {
          money_record_number: await incrementSeq(
            `money_record_number`,
            `MoneyRecord`,
          ),
        };

    const finalResult: any = await MoneyRecord.updateOne(
      {
        user_id: user_id_param,
        money_record_dateStart: dateStart_param,
        money_record_dateEnd: dateEnd_param,
        ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
      },
      {
        $set: {
          money_record_total_income: newIncome,
          money_record_total_expense: newExpense,
          money_record_updateDt: new Date(),
        },
        // 섹션 배열을 그대로 push 하면 중첩 배열이 되어 캐스팅이 실패하므로 원소 단위로 추가함
        $push: {
          money_section: {
            $each: Array.isArray(OBJECT_param.money_section)
              ? OBJECT_param.money_section
              : [ OBJECT_param.money_section ],
          },
        },
        $setOnInsert: setOnInsert,
      },
      {
        upsert: true,
      },
    ).lean();

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
    // upsert 신규 삽입 시 number 0 잔존 방지 (insert 일 때만 채번)
    const existDoc: any = await MoneyRecord.findOne({
      user_id: user_id_param,
      money_record_dateStart: dateStart_param,
      money_record_dateEnd: dateEnd_param,
      ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
    }).lean();
    const setOnInsert: any = existDoc
      ? {}
      : {
          money_record_number: await incrementSeq(
            `money_record_number`,
            `MoneyRecord`,
          ),
        };

    const finalResult: any = await MoneyRecord.findOneAndUpdate(
      {
        user_id: user_id_param,
        money_record_dateStart: dateStart_param,
        money_record_dateEnd: dateEnd_param,
        ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
      },
      {
        $set: {
          money_record_total_income: OBJECT_param.money_record_total_income,
          money_record_total_expense: OBJECT_param.money_record_total_expense,
          money_section: OBJECT_param.money_section,
          money_record_updateDt: new Date(),
        },
        $setOnInsert: setOnInsert,
      },
      {
        upsert: true,
        returnDocument: `after`,
      },
    ).lean();

    return finalResult;
  },
};

// 5. delete ---------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await MoneyRecord.findOneAndDelete({
    user_id: user_id_param,
    money_record_dateStart: dateStart_param,
    money_record_dateEnd: dateEnd_param,
    ...(dateType_param ? { money_record_dateType: dateType_param } : {}),
  }).lean();

  return finalResult;
};

// 6. restore --------------------------------------------------------------------------------------
// - 삭제 후 후속 쓰기가 실패한 경우 원본 문서를 그대로 되돌림 (트랜잭션 미사용 보상 처리)
// - 채번·훅을 우회해 _id 포함 원본을 손실 없이 되돌려야 하므로 드라이버 insertOne 을 사용함
export const restore = async (doc_param: any) => {
  if (!doc_param) {
    return null;
  }

  try {
    const finalResult: any = await MoneyRecord.collection.insertOne(doc_param);

    return finalResult;
  }
  catch (error: unknown) {
    console.error(`[restore] MoneyRecord 원본 복구 실패`, error);

    return null;
  }
};
