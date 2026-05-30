/**
 * @file ExerciseGoalRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { ExerciseRecord as ExerRec2 } from "@schemas/exercise/ExerciseRecord";
import mongoose from "mongoose";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await ExerciseGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				exercise_goal_dateStart: {
					$lte: dtEndPrm,
				},
				exercise_goal_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { exercise_goal_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				exercise_goal_dateType: 1,
				exercise_goal_dateStart: 1,
				exercise_goal_dateEnd: 1,
			},
		},
		{
			$sort: {
				exercise_goal_dateStart: 1,
			},
		},
	]);

	return finalResult;
};

// 1-1. list (goal) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const listGoal = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
	sort_param: 1 | -1,
	page_param: number,
) => {
	const finalResult: any = await ExerciseGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				exercise_goal_dateStart: {
					$lte: dtEndPrm,
				},
				exercise_goal_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { exercise_goal_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				exercise_goal_dateType: 1,
				exercise_goal_dateStart: 1,
				exercise_goal_dateEnd: 1,
				exercise_goal_count: 1,
				exercise_goal_volume: 1,
				exercise_goal_cardio: 1,
				exercise_goal_scale: 1,
			},
		},
		{
			$sort: {
				exercise_goal_dateStart: sort_param,
			},
		},
		{
			$skip: Number(page_param - 1),
		},
	]);

	return finalResult;
};

// 1-2. list (record) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const listRecord: any[] = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await ExerRec2.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				exercise_record_dateStart: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				exercise_record_dateEnd: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				...(dtTypPrm2 ? { exercise_record_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				exercise_record_dateType: 1,
				exercise_record_dateStart: 1,
				exercise_record_dateEnd: 1,
				exercise_record_total_volume: 1,
				exercise_record_total_cardio: 1,
				exercise_record_total_scale: 1,
				exercise_record_total_count: {
					$cond: {
						if: {
							$and: [
								{
									$lte: [`$exercise_record_total_volume`, 1],
								},
								{
									$eq: [`$exercise_record_total_cardio`, `00:00`],
								},
							],
						},
						then: ``,
						else: `1`,
					},
				},
			},
		},
		{
			$sort: {
				exercise_record_dateStart: 1,
			},
		},
	]);

	return finalResult;
};

// 2. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const detail = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await ExerciseGoal.findOne({
		user_id: usrIdPrm,
		exercise_goal_dateStart: dtStrtPrm,
		exercise_goal_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { exercise_goal_dateType: dtTypPrm2 } : {}),
	}).lean();

	return finalResult;
};

// 3. create ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const create = async (
	usrIdPrm: string,
	OBJECT_param: any,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await ExerciseGoal.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		exercise_goal_dateType: dtTypPrm2,
		exercise_goal_dateStart: dtStrtPrm,
		exercise_goal_dateEnd: dtEndPrm,
		exercise_goal_count: OBJECT_param.exercise_goal_count,
		exercise_goal_volume: OBJECT_param.exercise_goal_volume,
		exercise_goal_cardio: OBJECT_param.exercise_goal_cardio,
		exercise_goal_scale: OBJECT_param.exercise_goal_scale,
		exercise_goal_regDt: new Date(),
		exercise_goal_updateDt: ``,
	});

	return finalResult;
};

// 4. update ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const update = {
	// 1. update (기존항목 유지 + 타겟항목으로 수정)
	update: async (
		usrIdPrm: string,
		OBJECT_param: any,
		dtTypPrm2: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await ExerciseGoal.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				exercise_goal_dateStart: dtStrtPrm,
				exercise_goal_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { exercise_goal_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					exercise_goal_count: OBJECT_param.exercise_goal_count,
					exercise_goal_volume: OBJECT_param.exercise_goal_volume,
					exercise_goal_cardio: OBJECT_param.exercise_goal_cardio,
					exercise_goal_scale: OBJECT_param.exercise_goal_scale,
					exercise_goal_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true,
			},
		).lean();

		return finalResult;
	},

	// 2. insert (기존항목 제거 + 타겟항목에 추가)

	// 3. replace (기존항목 제거 + 타겟항목을 교체)
	replace: async (
		usrIdPrm: string,
		OBJECT_param: any,
		dtTypPrm2: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await ExerciseGoal.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				exercise_goal_dateStart: dtStrtPrm,
				exercise_goal_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { exercise_goal_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					exercise_goal_count: OBJECT_param.exercise_goal_count,
					exercise_goal_volume: OBJECT_param.exercise_goal_volume,
					exercise_goal_cardio: OBJECT_param.exercise_goal_cardio,
					exercise_goal_scale: OBJECT_param.exercise_goal_scale,
					exercise_goal_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true,
			},
		).lean();

		return finalResult;
	},
};

// 5. delete ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const deletes = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await ExerciseGoal.findOneAndDelete({
		user_id: usrIdPrm,
		exercise_goal_dateStart: dtStrtPrm,
		exercise_goal_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { exercise_goal_dateType: dtTypPrm2 } : {}),
	}).lean();

	return finalResult;
};
