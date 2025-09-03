// calendarRepository.ts

import mongoose from "mongoose";
import { Calendar } from "@schemas/calendar/Calendar";
import { Exercise } from "@schemas/exercise/Exercise";
import { Food } from "@schemas/food/Food";
import { Money } from "@schemas/money/Money";
import { Sleep } from "@schemas/sleep/Sleep";

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
        _id: 1,
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

	// 1. excercise
	const exerciseResult:any = await Exercise.aggregate([
		{
			$match: {
				user_id: user_id_param,
				exercise_dateStart: {
					$lte: dateEnd_param
				},
				exercise_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { exercise_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				exercise_dateType: 1,
				exercise_dateStart: 1,
				exercise_dateEnd: 1,
				exercise_section: 1,
			}
		}
	]);

	// 2. food
	const foodResult:any = await Food.aggregate([
		{
			$match: {
				user_id: user_id_param,
				food_dateStart: {
					$lte: dateEnd_param
				},
				food_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { food_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				food_dateType: 1,
				food_dateStart: 1,
				food_dateEnd: 1,
				food_section: 1,
			}
		}
	]);

	// 3. money
	const moneyResult:any = await Money.aggregate([
		{
			$match: {
				user_id: user_id_param,
				money_dateStart: {
					$lte: dateEnd_param
				},
				money_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { money_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				money_dateType: 1,
				money_dateStart: 1,
				money_dateEnd: 1,
				money_section: 1,
			}
		}
	]);

	// 4. sleep
	const sleepResult:any = await Sleep.aggregate([
		{
			$match: {
				user_id: user_id_param,
				sleep_dateStart: {
					$lte: dateEnd_param
				},
				sleep_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { sleep_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				sleep_dateType: 1,
				sleep_dateStart: 1,
				sleep_dateEnd: 1,
				sleep_section: 1,
			}
		}
	]);

	// calendar 형식으로 합치기
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
		const exerciseItem = getSectionForDate(exerciseResult, "exercise_dateStart", "exercise_dateEnd", dateStr);
		const foodItem = getSectionForDate(foodResult, "food_dateStart", "food_dateEnd", dateStr);
		const moneyItem = getSectionForDate(moneyResult, "money_dateStart", "money_dateEnd", dateStr);
		const sleepItem = getSectionForDate(sleepResult, "sleep_dateStart", "sleep_dateEnd", dateStr);

		finalResult.push({
			_id: new mongoose.Types.ObjectId(),
			calendar_number: finalResult.length + 1,
			calendar_dateType: dateType_param || "",
			calendar_dateStart: dateStr,
			calendar_dateEnd: dateStr,

			calendar_exercise_dateType: exerciseItem?.exercise_dateType || "",
			calendar_exercise_dateStart: exerciseItem?.exercise_dateStart || "0000-00-00",
			calendar_exercise_dateEnd: exerciseItem?.exercise_dateEnd || "0000-00-00",
			calendar_exercise_section: exerciseItem?.exercise_section || [],

			calendar_food_dateType: foodItem?.food_dateType || "",
			calendar_food_dateStart: foodItem?.food_dateStart || "0000-00-00",
			calendar_food_dateEnd: foodItem?.food_dateEnd || "0000-00-00",
			calendar_food_section: foodItem?.food_section || [],

			calendar_money_dateType: moneyItem?.money_dateType || "",
			calendar_money_dateStart: moneyItem?.money_dateStart || "0000-00-00",
			calendar_money_dateEnd: moneyItem?.money_dateEnd || "0000-00-00",
			calendar_money_section: moneyItem?.money_section || [],

			calendar_sleep_dateType: sleepItem?.sleep_dateType || "",
			calendar_sleep_dateStart: sleepItem?.sleep_dateStart || "0000-00-00",
			calendar_sleep_dateEnd: sleepItem?.sleep_dateEnd || "0000-00-00",
			calendar_sleep_section: sleepItem?.sleep_section || [],
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
	const exerciseResult:any = await Exercise.aggregate([
		{
			$match: {
				user_id: user_id_param,
				exercise_dateStart: {
					$lte: dateEnd_param
				},
				exercise_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { exercise_dateType: dateType_param } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				exercise_dateType: 1,
				exercise_dateStart: 1,
				exercise_dateEnd: 1,
				exercise_section: 1,
			}
		}
	]);

	// 2. food
	const foodResult:any = await Food.aggregate([
		{
			$match: {
				user_id: user_id_param,
				food_dateStart: {
					$lte: dateEnd_param
				},
				food_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { food_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				food_dateType: 1,
				food_dateStart: 1,
				food_dateEnd: 1,
				food_section: 1,
			}
		}
	]);

	// 3. money
	const moneyResult:any = await Money.aggregate([
		{
			$match: {
				user_id: user_id_param,
				money_dateStart: {
					$lte: dateEnd_param
				},
				money_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { money_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				money_dateType: 1,
				money_dateStart: 1,
				money_dateEnd: 1,
				money_section: 1,
			}
		}
	]);

	// 4. sleep
	const sleepResult:any = await Sleep.aggregate([
		{
			$match: {
				user_id: user_id_param,
				sleep_dateStart: {
					$lte: dateEnd_param
				},
				sleep_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { sleep_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				sleep_dateType: 1,
				sleep_dateStart: 1,
				sleep_dateEnd: 1,
				sleep_section: 1,
			}
		}
	]);

	// calendar 형식으로 합치기
	const finalResult:any = [];
	const startDate = new Date(dateStart_param);
	const endDate = new Date(dateEnd_param);

	for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toISOString().split('T')[0];
		const exerciseItem = exerciseResult.find((item: any) =>
			dateStr >= item.exercise_dateStart && dateStr <= item.exercise_dateEnd
		) || null;
		const foodItem = foodResult.find((item: any) =>
			dateStr >= item.food_dateStart && dateStr <= item.food_dateEnd
		) || null;
		const moneyItem = moneyResult.find((item: any) =>
			dateStr >= item.money_dateStart && dateStr <= item.money_dateEnd
		) || null;
		const sleepItem = sleepResult.find((item: any) =>
			dateStr >= item.sleep_dateStart && dateStr <= item.sleep_dateEnd
		) || null;

		finalResult.push({
			_id: new mongoose.Types.ObjectId(),
			calendar_number: finalResult.length + 1,
			calendar_dateType: dateType_param || "",
			calendar_dateStart: dateStr,
			calendar_dateEnd: dateStr,

			calendar_exercise_dateType: exerciseItem?.exercise_dateType || "",
			calendar_exercise_dateStart: exerciseItem?.exercise_dateStart || "0000-00-00",
			calendar_exercise_dateEnd: exerciseItem?.exercise_dateEnd || "0000-00-00",
			calendar_exercise_section: exerciseItem?.exercise_section || [],

			calendar_food_dateType: foodItem?.food_dateType || "",
			calendar_food_dateStart: foodItem?.food_dateStart || "0000-00-00",
			calendar_food_dateEnd: foodItem?.food_dateEnd || "0000-00-00",
			calendar_food_section: foodItem?.food_section || [],

			calendar_money_dateType: moneyItem?.money_dateType || "",
			calendar_money_dateStart: moneyItem?.money_dateStart || "0000-00-00",
			calendar_money_dateEnd: moneyItem?.money_dateEnd || "0000-00-00",
			calendar_money_section: moneyItem?.money_section || [],

			calendar_sleep_dateType: sleepItem?.sleep_dateType || "",
			calendar_sleep_dateStart: sleepItem?.sleep_dateStart || "0000-00-00",
			calendar_sleep_dateEnd: sleepItem?.sleep_dateEnd || "0000-00-00",
			calendar_sleep_section: sleepItem?.sleep_section || [],
		});
	}

	return finalResult;
};