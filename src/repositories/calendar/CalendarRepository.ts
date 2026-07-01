/**
 * @file CalendarRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { ExerciseRecord } from "@schemas/exercise/ExerciseRecord";
import { FoodRecord } from "@schemas/food/FoodRecord";
import { MoneyRecord } from "@schemas/money/MoneyRecord";
import { SleepRecord } from "@schemas/sleep/SleepRecord";
import mongoose from "mongoose";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  // 4개 컴렉션 aggregate 병렬 실행
  const [exerciseResult, foodResult, moneyResult, sleepResult] =
    await Promise.all([
      ExerciseRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            exercise_record_dateStart: { $lte: dateEnd_param },
            exercise_record_dateEnd: { $gte: dateStart_param },
          },
        },
        {
          $project: {
            _id: 0,
            exercise_dateType: `$exercise_record_dateType`,
            exercise_dateStart: `$exercise_record_dateStart`,
            exercise_dateEnd: `$exercise_record_dateEnd`,
          },
        },
      ]),
      FoodRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            food_record_dateStart: { $lte: dateEnd_param },
            food_record_dateEnd: { $gte: dateStart_param },
          },
        },
        {
          $project: {
            _id: 0,
            food_dateType: `$food_record_dateType`,
            food_dateStart: `$food_record_dateStart`,
            food_dateEnd: `$food_record_dateEnd`,
          },
        },
      ]),
      MoneyRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            money_record_dateStart: { $lte: dateEnd_param },
            money_record_dateEnd: { $gte: dateStart_param },
          },
        },
        {
          $project: {
            _id: 0,
            money_dateType: `$money_record_dateType`,
            money_dateStart: `$money_record_dateStart`,
            money_dateEnd: `$money_record_dateEnd`,
          },
        },
      ]),
      SleepRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            sleep_record_dateStart: { $lte: dateEnd_param },
            sleep_record_dateEnd: { $gte: dateStart_param },
          },
        },
        {
          $project: {
            _id: 0,
            sleep_dateType: `$sleep_record_dateType`,
            sleep_dateStart: `$sleep_record_dateStart`,
            sleep_dateEnd: `$sleep_record_dateEnd`,
          },
        },
      ]),
    ]);

  const finalResult: any[] = [];
  const allRecords: any[] = [
    ...exerciseResult,
    ...foodResult,
    ...moneyResult,
    ...sleepResult,
  ];

  for (const record of allRecords) {
    const dateType =
      record.exercise_dateType ??
      record.food_dateType ??
      record.money_dateType ??
      record.sleep_dateType ??
      ``;
    const dateStart =
      record.exercise_dateStart ??
      record.food_dateStart ??
      record.money_dateStart ??
      record.sleep_dateStart ??
      `0000-00-00`;
    const dateEnd =
      record.exercise_dateEnd ??
      record.food_dateEnd ??
      record.money_dateEnd ??
      record.sleep_dateEnd ??
      `0000-00-00`;
    finalResult.push({
      calendar_dateType: dateType,
      calendar_dateStart: dateStart,
      calendar_dateEnd: dateEnd,
    });
  }

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
  // 4개 컴렉션 aggregate 병렬 실행
  const [exerciseResult, foodResult, moneyResult, sleepResult] =
    await Promise.all([
      // 1. excercise
      ExerciseRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            exercise_record_dateStart: {
              $lte: dateEnd_param,
            },
            exercise_record_dateEnd: {
              $gte: dateStart_param,
            },
            ...(dateType_param
              ? { exercise_record_dateType: dateType_param }
              : {}),
          },
        },
        {
          $project: {
            _id: 0,
            exercise_dateType: `$exercise_record_dateType`,
            exercise_dateStart: `$exercise_record_dateStart`,
            exercise_dateEnd: `$exercise_record_dateEnd`,
            exercise_section: 1,
          },
        },
      ]),
      // 2. food
      FoodRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            food_record_dateStart: {
              $lte: dateEnd_param,
            },
            food_record_dateEnd: {
              $gte: dateStart_param,
            },
            ...(dateType_param ? { food_record_dateType: dateType_param } : {}),
          },
        },
        {
          $project: {
            _id: 0,
            food_dateType: `$food_record_dateType`,
            food_dateStart: `$food_record_dateStart`,
            food_dateEnd: `$food_record_dateEnd`,
            food_section: 1,
          },
        },
      ]),
      // 3. money
      MoneyRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            money_record_dateStart: {
              $lte: dateEnd_param,
            },
            money_record_dateEnd: {
              $gte: dateStart_param,
            },
            ...(dateType_param
              ? { money_record_dateType: dateType_param }
              : {}),
          },
        },
        {
          $project: {
            _id: 0,
            money_dateType: `$money_record_dateType`,
            money_dateStart: `$money_record_dateStart`,
            money_dateEnd: `$money_record_dateEnd`,
            money_section: 1,
          },
        },
      ]),
      // 4. sleep
      SleepRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            sleep_record_dateStart: {
              $lte: dateEnd_param,
            },
            sleep_record_dateEnd: {
              $gte: dateStart_param,
            },
            ...(dateType_param
              ? { sleep_record_dateType: dateType_param }
              : {}),
          },
        },
        {
          $project: {
            _id: 0,
            sleep_dateType: `$sleep_record_dateType`,
            sleep_dateStart: `$sleep_record_dateStart`,
            sleep_dateEnd: `$sleep_record_dateEnd`,
            sleep_section: 1,
          },
        },
      ]),
    ]);

  const finalResult: any[] = [];
  const startDate: Date = new Date(dateStart_param);
  const endDate: Date = new Date(dateEnd_param);

  const getSectionForDate = (
    list: any[],
    startKey: string,
    endKey: string,
    dateStr: string,
  ) => {
    return (
      list.find(
        (item) => dateStr >= item[startKey] && dateStr <= item[endKey],
      ) ?? null
    );
  };

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr: string = d.toISOString().split(`T`)[0];
    const exerciseItem: any = getSectionForDate(
      exerciseResult,
      `exercise_dateStart`,
      `exercise_dateEnd`,
      dateStr,
    );
    const foodItem: any = getSectionForDate(
      foodResult,
      `food_dateStart`,
      `food_dateEnd`,
      dateStr,
    );
    const moneyItem: any = getSectionForDate(
      moneyResult,
      `money_dateStart`,
      `money_dateEnd`,
      dateStr,
    );
    const sleepItem: any = getSectionForDate(
      sleepResult,
      `sleep_dateStart`,
      `sleep_dateEnd`,
      dateStr,
    );

    finalResult.push({
      _id: new mongoose.Types.ObjectId(),
      calendar_number: finalResult.length + 1,
      calendar_dateType: dateType_param ?? ``,
      calendar_dateStart: dateStr,
      calendar_dateEnd: dateStr,

      calendar_exercise_dateType: exerciseItem?.exercise_dateType ?? ``,
      calendar_exercise_dateStart:
        exerciseItem?.exercise_dateStart ?? `0000-00-00`,
      calendar_exercise_dateEnd: exerciseItem?.exercise_dateEnd ?? `0000-00-00`,
      calendar_exercise_section: exerciseItem?.exercise_section ?? [],

      calendar_food_dateType: foodItem?.food_dateType ?? ``,
      calendar_food_dateStart: foodItem?.food_dateStart ?? `0000-00-00`,
      calendar_food_dateEnd: foodItem?.food_dateEnd ?? `0000-00-00`,
      calendar_food_section: foodItem?.food_section ?? [],

      calendar_money_dateType: moneyItem?.money_dateType ?? ``,
      calendar_money_dateStart: moneyItem?.money_dateStart ?? `0000-00-00`,
      calendar_money_dateEnd: moneyItem?.money_dateEnd ?? `0000-00-00`,
      calendar_money_section: moneyItem?.money_section ?? [],

      calendar_sleep_dateType: sleepItem?.sleep_dateType ?? ``,
      calendar_sleep_dateStart: sleepItem?.sleep_dateStart ?? `0000-00-00`,
      calendar_sleep_dateEnd: sleepItem?.sleep_dateEnd ?? `0000-00-00`,
      calendar_sleep_section: sleepItem?.sleep_section ?? [],
    });
  }

  return finalResult;
};

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  // 4개 컴렉션 aggregate 병렬 실행
  const [exerciseResult, foodResult, moneyResult, sleepResult] =
    await Promise.all([
      // 1. excercise
      ExerciseRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            exercise_record_dateStart: {
              $lte: dateEnd_param,
            },
            exercise_record_dateEnd: {
              $gte: dateStart_param,
            },
            ...(dateType_param
              ? { exercise_record_dateType: dateType_param }
              : {}),
          },
        },
        {
          $project: {
            _id: 0,
            exercise_dateType: `$exercise_record_dateType`,
            exercise_dateStart: `$exercise_record_dateStart`,
            exercise_dateEnd: `$exercise_record_dateEnd`,
            exercise_section: 1,
          },
        },
      ]),
      // 2. food
      FoodRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            food_record_dateStart: {
              $lte: dateEnd_param,
            },
            food_record_dateEnd: {
              $gte: dateStart_param,
            },
            ...(dateType_param ? { food_record_dateType: dateType_param } : {}),
          },
        },
        {
          $project: {
            _id: 0,
            food_dateType: `$food_record_dateType`,
            food_dateStart: `$food_record_dateStart`,
            food_dateEnd: `$food_record_dateEnd`,
            food_section: 1,
          },
        },
      ]),
      // 3. money
      MoneyRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            money_record_dateStart: {
              $lte: dateEnd_param,
            },
            money_record_dateEnd: {
              $gte: dateStart_param,
            },
            ...(dateType_param
              ? { money_record_dateType: dateType_param }
              : {}),
          },
        },
        {
          $project: {
            _id: 0,
            money_dateType: `$money_record_dateType`,
            money_dateStart: `$money_record_dateStart`,
            money_dateEnd: `$money_record_dateEnd`,
            money_section: 1,
          },
        },
      ]),
      // 4. sleep
      SleepRecord.aggregate([
        {
          $match: {
            user_id: user_id_param,
            sleep_record_dateStart: {
              $lte: dateEnd_param,
            },
            sleep_record_dateEnd: {
              $gte: dateStart_param,
            },
            ...(dateType_param
              ? { sleep_record_dateType: dateType_param }
              : {}),
          },
        },
        {
          $project: {
            _id: 0,
            sleep_dateType: `$sleep_record_dateType`,
            sleep_dateStart: `$sleep_record_dateStart`,
            sleep_dateEnd: `$sleep_record_dateEnd`,
            sleep_section: 1,
          },
        },
      ]),
    ]);

  const finalResult: any[] = [];
  const startDate: Date = new Date(dateStart_param);
  const endDate: Date = new Date(dateEnd_param);

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr: string = d.toISOString().split(`T`)[0];
    const exerciseItem: any =
      exerciseResult.find(
        (item: any) =>
          dateStr >= item.exercise_dateStart &&
          dateStr <= item.exercise_dateEnd,
      ) ?? null;
    const foodItem: any =
      foodResult.find(
        (item: any) =>
          dateStr >= item.food_dateStart && dateStr <= item.food_dateEnd,
      ) ?? null;
    const moneyItem: any =
      moneyResult.find(
        (item: any) =>
          dateStr >= item.money_dateStart && dateStr <= item.money_dateEnd,
      ) ?? null;
    const sleepItem: any =
      sleepResult.find(
        (item: any) =>
          dateStr >= item.sleep_dateStart && dateStr <= item.sleep_dateEnd,
      ) ?? null;

    finalResult.push({
      _id: new mongoose.Types.ObjectId(),
      calendar_number: finalResult.length + 1,
      calendar_dateType: dateType_param ?? ``,
      calendar_dateStart: dateStr,
      calendar_dateEnd: dateStr,

      calendar_exercise_dateType: exerciseItem?.exercise_dateType ?? ``,
      calendar_exercise_dateStart:
        exerciseItem?.exercise_dateStart ?? `0000-00-00`,
      calendar_exercise_dateEnd: exerciseItem?.exercise_dateEnd ?? `0000-00-00`,
      calendar_exercise_section: exerciseItem?.exercise_section ?? [],

      calendar_food_dateType: foodItem?.food_dateType ?? ``,
      calendar_food_dateStart: foodItem?.food_dateStart ?? `0000-00-00`,
      calendar_food_dateEnd: foodItem?.food_dateEnd ?? `0000-00-00`,
      calendar_food_section: foodItem?.food_section ?? [],

      calendar_money_dateType: moneyItem?.money_dateType ?? ``,
      calendar_money_dateStart: moneyItem?.money_dateStart ?? `0000-00-00`,
      calendar_money_dateEnd: moneyItem?.money_dateEnd ?? `0000-00-00`,
      calendar_money_section: moneyItem?.money_section ?? [],

      calendar_sleep_dateType: sleepItem?.sleep_dateType ?? ``,
      calendar_sleep_dateStart: sleepItem?.sleep_dateStart ?? `0000-00-00`,
      calendar_sleep_dateEnd: sleepItem?.sleep_dateEnd ?? `0000-00-00`,
      calendar_sleep_section: sleepItem?.sleep_section ?? [],
    });
  }

  return finalResult;
};
