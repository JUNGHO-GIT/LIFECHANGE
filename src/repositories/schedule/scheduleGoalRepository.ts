// scheduleGoalRepository.ts

import mongoose from "mongoose";
import { ScheduleGoal } from "@schemas/schedule/ScheduleGoal";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
	user_id_param: string,
	dateType_param: string,
	dateStart_param: string,
	dateEnd_param: string,
) => {

	const finalResult:any = await ScheduleGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				schedule_goal_dateStart: {
					$lte: dateEnd_param
				},
				schedule_goal_dateEnd: {
					$gte: dateStart_param,
				},
				...(dateType_param ? { schedule_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 1,
				schedule_goal_dateType: 1,
				schedule_goal_dateStart: 1,
				schedule_goal_dateEnd: 1,
			}
		},
		{
			$sort: {
				schedule_goal_dateStart: 1
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

	const finalResult:any = await ScheduleGoal.countDocuments(
		{
			user_id: user_id_param,
			schedule_goal_dateStart: {
				$lte: dateEnd_param,
			},
			schedule_goal_dateEnd: {
				$gte: dateStart_param,
			},
			...(dateType_param ? { schedule_goal_dateType: dateType_param } : {}),
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

	const finalResult:any = await ScheduleGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				schedule_goal_dateStart: {
					$lte: dateEnd_param
				},
				schedule_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { schedule_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 1,
				schedule_goal_number: 1,
				schedule_goal_dateType: 1,
				schedule_goal_dateStart: 1,
				schedule_goal_dateEnd: 1,
				schedule_goal_title: 1,
				schedule_goal_content: 1,
				schedule_goal_target: 1,
				schedule_goal_unit: 1,
				schedule_goal_current: 1,
			}
		},
		{
			$sort: {
				schedule_goal_dateStart: sort_param
			}
		},
		{
			$skip: (page_param - 1) * 10
		},
		{
			$limit: 10
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

	const finalResult:any = await ScheduleGoal.aggregate([
		{
			$match: {
				user_id: user_id_param,
				schedule_goal_dateStart: {
					$lte: dateEnd_param
				},
				schedule_goal_dateEnd: {
					$gte: dateStart_param
				},
				...(dateType_param ? { schedule_goal_dateType: dateType_param } : {}),
			}
		},
		{
			$project: {
				_id: 1,
				schedule_goal_number: 1,
				schedule_goal_dateType: 1,
				schedule_goal_dateStart: 1,
				schedule_goal_dateEnd: 1,
				schedule_goal_title: 1,
				schedule_goal_content: 1,
				schedule_goal_target: 1,
				schedule_goal_unit: 1,
				schedule_goal_current: 1,
			}
		}
	]);

	return finalResult;
};