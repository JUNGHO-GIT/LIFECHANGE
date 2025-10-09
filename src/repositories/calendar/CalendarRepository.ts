// CalendarRepository.ts

import mongoose from "mongoose";
import { ExerciseRecord } from "@schemas/exercise/ExerciseRecord";
import { FoodRecord } from "@schemas/food/FoodRecord";
import { MoneyRecord } from "@schemas/money/MoneyRecord";
import { SleepRecord } from "@schemas/sleep/SleepRecord";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
	user_id_param: string,
	dateType_param: string,
	dateStart_param: string,
	dateEnd_param: string,
) => {

	const finalResult:any = null;

	return finalResult;
};

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
	user_id_param: string,
	dateType_param: string,
	dateStart_param: string,
	dateEnd_param: string,
) => {

	const finalResult:any = null;

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

	// 1. excercise
	const exerciseResult:any = await ExerciseRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				exercise_record_dateStart: {
					$lte: dateEnd_param
				},
				exercise_record_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { exercise_record_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				exercise_record_dateType: 1,
				exercise_record_dateStart: 1,
				exercise_record_dateEnd: 1,
				exercise_section: 1,
			}
		}
	]);

	// 2. food
	const foodResult:any = await FoodRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				food_record_dateStart: {
					$lte: dateEnd_param
				},
				food_record_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { food_record_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				food_record_dateType: 1,
				food_record_dateStart: 1,
				food_record_dateEnd: 1,
				food_section: 1,
			}
		}
	]);

	// 3. money
	const moneyResult:any = await MoneyRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				money_record_dateStart: {
					$lte: dateEnd_param
				},
				money_record_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { money_record_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				money_record_dateType: 1,
				money_record_dateStart: 1,
				money_record_dateEnd: 1,
				money_section: 1,
			}
		}
	]);

	// 4. sleep
	const sleepResult:any = await SleepRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				sleep_record_dateStart: {
					$lte: dateEnd_param
				},
				sleep_record_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				sleep_record_dateType: 1,
				sleep_record_dateStart: 1,
				sleep_record_dateEnd: 1,
				sleep_section: 1,
			}
		}
	]);

	const finalResult:any = [];
	const startDate = new Date(dateStart_param);
	const endDate = new Date(dateEnd_param);

	// Map 대신 배열로 조회
	const getSectionForDate = (list: any[], startKey: string, endKey: string, dateStr: string) => {
		return list.find(item =>
			dateStr >= item[startKey] && dateStr <= item[endKey]
		) || null;
	};

	for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toISOString().split('T')[0];
		const exerciseItem = getSectionForDate(exerciseResult, "exercise_record_dateStart", "exercise_record_dateEnd", dateStr);
		const foodItem = getSectionForDate(foodResult, "food_record_dateStart", "food_record_dateEnd", dateStr);
		const moneyItem = getSectionForDate(moneyResult, "money_record_dateStart", "money_record_dateEnd", dateStr);
		const sleepItem = getSectionForDate(sleepResult, "sleep_record_dateStart", "sleep_record_dateEnd", dateStr);

		finalResult.push({
			_id: new mongoose.Types.ObjectId(),
			today_record_number: finalResult.length + 1,
			today_record_dateType: dateType_param || "",
			today_record_dateStart: dateStr,
			today_record_dateEnd: dateStr,

			today_exercise_record_dateType: exerciseItem?.exercise_record_dateType || "",
			today_exercise_record_dateStart: exerciseItem?.exercise_record_dateStart || "0000-00-00",
			today_exercise_record_dateEnd: exerciseItem?.exercise_record_dateEnd || "0000-00-00",
			today_exercise_section: exerciseItem?.exercise_section || [],

			today_food_record_dateType: foodItem?.food_record_dateType || "",
			today_food_record_dateStart: foodItem?.food_record_dateStart || "0000-00-00",
			today_food_record_dateEnd: foodItem?.food_record_dateEnd || "0000-00-00",
			today_food_section: foodItem?.food_section || [],

			today_money_record_dateType: moneyItem?.money_record_dateType || "",
			today_money_record_dateStart: moneyItem?.money_record_dateStart || "0000-00-00",
			today_money_record_dateEnd: moneyItem?.money_record_dateEnd || "0000-00-00",
			today_money_section: moneyItem?.money_section || [],

			today_sleep_record_dateType: sleepItem?.sleep_record_dateType || "",
			today_sleep_record_dateStart: sleepItem?.sleep_record_dateStart || "0000-00-00",
			today_sleep_record_dateEnd: sleepItem?.sleep_record_dateEnd || "0000-00-00",
			today_sleep_section: sleepItem?.sleep_section || [],
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

	// 1. excercise
	const exerciseResult:any = await ExerciseRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				exercise_record_dateStart: {
					$lte: dateEnd_param
				},
				exercise_record_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { exercise_record_dateType: dateType_param } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				exercise_record_dateType: 1,
				exercise_record_dateStart: 1,
				exercise_record_dateEnd: 1,
				exercise_section: 1,
			}
		}
	]);

	// 2. food
	const foodResult:any = await FoodRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				food_record_dateStart: {
					$lte: dateEnd_param
				},
				food_record_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { food_record_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				food_record_dateType: 1,
				food_record_dateStart: 1,
				food_record_dateEnd: 1,
				food_section: 1,
			}
		}
	]);

	// 3. money
	const moneyResult:any = await MoneyRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				money_record_dateStart: {
					$lte: dateEnd_param
				},
				money_record_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { money_record_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				money_record_dateType: 1,
				money_record_dateStart: 1,
				money_record_dateEnd: 1,
				money_section: 1,
			}
		}
	]);

	// 4. sleep
	const sleepResult:any = await SleepRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				sleep_record_dateStart: {
					$lte: dateEnd_param
				},
				sleep_record_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				sleep_record_dateType: 1,
				sleep_record_dateStart: 1,
				sleep_record_dateEnd: 1,
				sleep_section: 1,
			}
		}
	]);

	const finalResult:any = [];
	const startDate = new Date(dateStart_param);
	const endDate = new Date(dateEnd_param);

	for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toISOString().split('T')[0];
		const exerciseItem = exerciseResult.find((item: any) =>
			dateStr >= item.exercise_record_dateStart && dateStr <= item.exercise_record_dateEnd
		) || null;
		const foodItem = foodResult.find((item: any) =>
			dateStr >= item.food_record_dateStart && dateStr <= item.food_record_dateEnd
		) || null;
		const moneyItem = moneyResult.find((item: any) =>
			dateStr >= item.money_record_dateStart && dateStr <= item.money_record_dateEnd
		) || null;
		const sleepItem = sleepResult.find((item: any) =>
			dateStr >= item.sleep_record_dateStart && dateStr <= item.sleep_record_dateEnd
		) || null;

		finalResult.push({
			_id: new mongoose.Types.ObjectId(),
			today_record_number: finalResult.length + 1,
			today_record_dateType: dateType_param || "",
			today_record_dateStart: dateStr,
			today_record_dateEnd: dateStr,

			today_exercise_record_dateType: exerciseItem?.exercise_record_dateType || "",
			today_exercise_record_dateStart: exerciseItem?.exercise_record_dateStart || "0000-00-00",
			today_exercise_record_dateEnd: exerciseItem?.exercise_record_dateEnd || "0000-00-00",
			today_exercise_section: exerciseItem?.exercise_section || [],

			today_food_record_dateType: foodItem?.food_record_dateType || "",
			today_food_record_dateStart: foodItem?.food_record_dateStart || "0000-00-00",
			today_food_record_dateEnd: foodItem?.food_record_dateEnd || "0000-00-00",
			today_food_section: foodItem?.food_section || [],

			today_money_record_dateType: moneyItem?.money_record_dateType || "",
			today_money_record_dateStart: moneyItem?.money_record_dateStart || "0000-00-00",
			today_money_record_dateEnd: moneyItem?.money_record_dateEnd || "0000-00-00",
			today_money_section: moneyItem?.money_section || [],

			today_sleep_record_dateType: sleepItem?.sleep_record_dateType || "",
			today_sleep_record_dateStart: sleepItem?.sleep_record_dateStart || "0000-00-00",
			today_sleep_record_dateEnd: sleepItem?.sleep_record_dateEnd || "0000-00-00",
			today_sleep_section: sleepItem?.sleep_section || [],
		});
	}

	return finalResult;
};