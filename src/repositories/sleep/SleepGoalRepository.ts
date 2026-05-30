/**
 * @file SleepGoalRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { SleepRecord } from "@schemas/sleep/SleepRecord";
import mongoose from "mongoose";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await SleepGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				sleep_goal_dateStart: {
					$lte: dtEndPrm,
				},
				sleep_goal_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { sleep_goal_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				sleep_goal_dateType: 1,
				sleep_goal_dateStart: 1,
				sleep_goal_dateEnd: 1,
			},
		},
		{
			$sort: {
				sleep_goal_dateStart: 1,
			},
		},
	]);

	return finalResult;
};

// 1. list (goal) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const listGoal = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
	sort_param: 1 | -1,
	page_param: number,
) => {
	const finalResult: any = await SleepGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				sleep_goal_dateStart: {
					$lte: dtEndPrm,
				},
				sleep_goal_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { sleep_goal_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				sleep_goal_dateType: 1,
				sleep_goal_dateStart: 1,
				sleep_goal_dateEnd: 1,
				sleep_goal_bedTime: 1,
				sleep_goal_wakeTime: 1,
				sleep_goal_sleepTime: 1,
			},
		},
		{
			$sort: {
				sleep_goal_dateStart: sort_param,
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
	const finalResult: any = await SleepRecord.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				sleep_record_dateStart: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				sleep_record_dateEnd: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				...(dtTypPrm2 ? { sleep_record_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$unwind: `$sleep_section`,
		},
		{
			$project: {
				_id: 0,
				sleep_record_dateStart: 1,
				sleep_record_dateEnd: 1,
				sleep_record_dateType: 1,
				sleep_record_bedTime: `$sleep_section.sleep_record_bedTime`,
				sleep_record_wakeTime: `$sleep_section.sleep_record_wakeTime`,
				sleep_record_sleepTime: `$sleep_section.sleep_record_sleepTime`,
			},
		},
		{
			$sort: {
				sleep_record_dateStart: 1,
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
	const finalResult: any = await SleepGoal.findOne({
		user_id: usrIdPrm,
		sleep_goal_dateStart: dtStrtPrm,
		sleep_goal_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { sleep_goal_dateType: dtTypPrm2 } : {}),
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
	const finalResult: any = await SleepGoal.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		sleep_goal_dateType: dtTypPrm2,
		sleep_goal_dateStart: dtStrtPrm,
		sleep_goal_dateEnd: dtEndPrm,
		sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
		sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
		sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
		sleep_goal_regDt: new Date(),
		sleep_goal_updateDt: ``,
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
		const finalResult: any = await SleepGoal.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				sleep_goal_dateStart: dtStrtPrm,
				sleep_goal_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { sleep_goal_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
					sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
					sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
					sleep_goal_updateDt: new Date(),
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
		const finalResult: any = await SleepGoal.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				sleep_goal_dateStart: dtStrtPrm,
				sleep_goal_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { sleep_goal_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
					sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
					sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
					sleep_goal_updateDt: new Date(),
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
	const finalResult: any = await SleepGoal.findOneAndDelete({
		user_id: usrIdPrm,
		sleep_goal_dateType: dtTypPrm2,
		sleep_goal_dateStart: dtStrtPrm,
		...(dtEndPrm ? { sleep_goal_dateEnd: dtEndPrm } : {}),
	}).lean();

	return finalResult;
};
