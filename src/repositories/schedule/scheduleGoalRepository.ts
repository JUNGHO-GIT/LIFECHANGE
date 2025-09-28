// scheduleRepository.ts

import mongoose from "mongoose";
import { Schedule } from "@schemas/schedule/Schedule";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { SleepGoal } from "@schemas/sleep/SleepGoal";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Schedule.aggregate([
    {
      $match: {
        user_id: user_id_param,
        schedule_dateStart: {
          $lte: dateEnd_param
        },
        schedule_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { schedule_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 1,
        schedule_dateType: 1,
        schedule_dateStart: 1,
        schedule_dateEnd: 1,
      }
    },
    {
      $sort: {
        schedule_dateStart: 1
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

  const finalResult:any = await Schedule.countDocuments(
    {
      user_id: user_id_param,
      schedule_dateStart: {
        $lte: dateEnd_param,
      },
      schedule_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? { schedule_dateType: dateType_param } : {},
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
	const exerciseResult:any = await ExerciseGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				exercise_goal_dateStart: {
					$lte: dateEnd_param
				},
				exercise_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { exercise_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				exercise_goal_dateType: 1,
				exercise_goal_dateStart: 1,
				exercise_goal_dateEnd: 1,
				exercise_section: 1,
			}
		}
	]);

	// 2. food
	const foodResult:any = await FoodGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				food_goal_dateStart: {
					$lte: dateEnd_param
				},
				food_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { food_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				food_goal_dateType: 1,
				food_goal_dateStart: 1,
				food_goal_dateEnd: 1,
				food_section: 1,
			}
		}
	]);

	// 3. money
	const moneyResult:any = await MoneyGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				money_goal_dateStart: {
					$lte: dateEnd_param
				},
				money_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { money_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				money_goal_dateType: 1,
				money_goal_dateStart: 1,
				money_goal_dateEnd: 1,
				money_section: 1,
			}
		}
	]);

	// 4. sleep
	const sleepResult:any = await SleepGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				sleep_goal_dateStart: {
					$lte: dateEnd_param
				},
				sleep_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				sleep_goal_dateType: 1,
				sleep_goal_dateStart: 1,
				sleep_goal_dateEnd: 1,
				sleep_section: 1,
			}
		}
	]);

	// schedule 형식으로 합치기
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
		const exerciseItem = getSectionForDate(exerciseResult, "exercise_goal_dateStart", "exercise_goal_dateEnd", dateStr);
		const foodItem = getSectionForDate(foodResult, "food_goal_dateStart", "food_goal_dateEnd", dateStr);
		const moneyItem = getSectionForDate(moneyResult, "money_goal_dateStart", "money_goal_dateEnd", dateStr);
		const sleepItem = getSectionForDate(sleepResult, "sleep_goal_dateStart", "sleep_goal_dateEnd", dateStr);

		finalResult.push({
			_id: new mongoose.Types.ObjectId(),
			schedule_number: finalResult.length + 1,
			schedule_dateType: dateType_param || "",
			schedule_dateStart: dateStr,
			schedule_dateEnd: dateStr,

			schedule_exercise_goal_dateType: exerciseItem?.exercise_goal_dateType || "",
			schedule_exercise_goal_dateStart: exerciseItem?.exercise_goal_dateStart || "0000-00-00",
			schedule_exercise_goal_dateEnd: exerciseItem?.exercise_goal_dateEnd || "0000-00-00",
			schedule_exercise_section: exerciseItem?.exercise_section || [],

			schedule_food_goal_dateType: foodItem?.food_goal_dateType || "",
			schedule_food_goal_dateStart: foodItem?.food_goal_dateStart || "0000-00-00",
			schedule_food_goal_dateEnd: foodItem?.food_goal_dateEnd || "0000-00-00",
			schedule_food_section: foodItem?.food_section || [],

			schedule_money_goal_dateType: moneyItem?.money_goal_dateType || "",
			schedule_money_goal_dateStart: moneyItem?.money_goal_dateStart || "0000-00-00",
			schedule_money_goal_dateEnd: moneyItem?.money_goal_dateEnd || "0000-00-00",
			schedule_money_section: moneyItem?.money_section || [],

			schedule_sleep_goal_dateType: sleepItem?.sleep_goal_dateType || "",
			schedule_sleep_goal_dateStart: sleepItem?.sleep_goal_dateStart || "0000-00-00",
			schedule_sleep_goal_dateEnd: sleepItem?.sleep_goal_dateEnd || "0000-00-00",
			schedule_sleep_section: sleepItem?.sleep_section || [],
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
	const exerciseResult:any = await ExerciseGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				exercise_goal_dateStart: {
					$lte: dateEnd_param
				},
				exercise_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { exercise_goal_dateType: dateType_param } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				exercise_goal_dateType: 1,
				exercise_goal_dateStart: 1,
				exercise_goal_dateEnd: 1,
				exercise_section: 1,
			}
		}
	]);

	// 2. food
	const foodResult:any = await FoodGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				food_goal_dateStart: {
					$lte: dateEnd_param
				},
				food_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { food_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				food_goal_dateType: 1,
				food_goal_dateStart: 1,
				food_goal_dateEnd: 1,
				food_section: 1,
			}
		}
	]);

	// 3. money
	const moneyResult:any = await MoneyGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				money_goal_dateStart: {
					$lte: dateEnd_param
				},
				money_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { money_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				money_goal_dateType: 1,
				money_goal_dateStart: 1,
				money_goal_dateEnd: 1,
				money_section: 1,
			}
		}
	]);

	// 4. sleep
	const sleepResult:any = await SleepGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				sleep_goal_dateStart: {
					$lte: dateEnd_param
				},
				sleep_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 0,
				sleep_goal_dateType: 1,
				sleep_goal_dateStart: 1,
				sleep_goal_dateEnd: 1,
				sleep_section: 1,
			}
		}
	]);

	// schedule 형식으로 합치기
	const finalResult:any = [];
	const startDate = new Date(dateStart_param);
	const endDate = new Date(dateEnd_param);

	for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toISOString().split('T')[0];
		const exerciseItem = exerciseResult.find((item: any) =>
			dateStr >= item.exercise_goal_dateStart && dateStr <= item.exercise_goal_dateEnd
		) || null;
		const foodItem = foodResult.find((item: any) =>
			dateStr >= item.food_goal_dateStart && dateStr <= item.food_goal_dateEnd
		) || null;
		const moneyItem = moneyResult.find((item: any) =>
			dateStr >= item.money_goal_dateStart && dateStr <= item.money_goal_dateEnd
		) || null;
		const sleepItem = sleepResult.find((item: any) =>
			dateStr >= item.sleep_goal_dateStart && dateStr <= item.sleep_goal_dateEnd
		) || null;

		finalResult.push({
			_id: new mongoose.Types.ObjectId(),
			schedule_number: finalResult.length + 1,
			schedule_dateType: dateType_param || "",
			schedule_dateStart: dateStr,
			schedule_dateEnd: dateStr,

			schedule_exercise_goal_dateType: exerciseItem?.exercise_goal_dateType || "",
			schedule_exercise_goal_dateStart: exerciseItem?.exercise_goal_dateStart || "0000-00-00",
			schedule_exercise_goal_dateEnd: exerciseItem?.exercise_goal_dateEnd || "0000-00-00",
			schedule_exercise_section: exerciseItem?.exercise_section || [],

			schedule_food_goal_dateType: foodItem?.food_goal_dateType || "",
			schedule_food_goal_dateStart: foodItem?.food_goal_dateStart || "0000-00-00",
			schedule_food_goal_dateEnd: foodItem?.food_goal_dateEnd || "0000-00-00",
			schedule_food_section: foodItem?.food_section || [],

			schedule_money_goal_dateType: moneyItem?.money_goal_dateType || "",
			schedule_money_goal_dateStart: moneyItem?.money_goal_dateStart || "0000-00-00",
			schedule_money_goal_dateEnd: moneyItem?.money_goal_dateEnd || "0000-00-00",
			schedule_money_section: moneyItem?.money_section || [],

			schedule_sleep_goal_dateType: sleepItem?.sleep_goal_dateType || "",
			schedule_sleep_goal_dateStart: sleepItem?.sleep_goal_dateStart || "0000-00-00",
			schedule_sleep_goal_dateEnd: sleepItem?.sleep_goal_dateEnd || "0000-00-00",
			schedule_sleep_section: sleepItem?.sleep_section || [],
		});
	}

	return finalResult;
};