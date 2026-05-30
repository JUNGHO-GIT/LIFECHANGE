/**
 * @file MoneyGoalRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { MoneyRecord } from "@schemas/money/MoneyRecord";
import mongoose from "mongoose";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await MoneyGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				money_goal_dateStart: {
					$lte: dtEndPrm,
				},
				money_goal_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { money_goal_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				money_goal_dateType: 1,
				money_goal_dateStart: 1,
				money_goal_dateEnd: 1,
			},
		},
		{
			$sort: {
				money_goal_dateStart: 1,
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
	const finalResult: any = await MoneyGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				money_goal_dateStart: {
					$lte: dtEndPrm,
				},
				money_goal_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { money_goal_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				money_goal_dateType: 1,
				money_goal_dateStart: 1,
				money_goal_dateEnd: 1,
				money_goal_income: 1,
				money_goal_expense: 1,
			},
		},
		{
			$sort: {
				money_goal_dateStart: sort_param,
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
	const finalResult: any = await MoneyRecord.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				money_record_dateStart: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				money_record_dateEnd: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				...(dtTypPrm2 ? { money_record_dateType: dtTypPrm2 } : {}),
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

// 2. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const detail = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await MoneyGoal.findOne({
		user_id: usrIdPrm,
		money_goal_dateStart: dtStrtPrm,
		money_goal_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { money_goal_dateType: dtTypPrm2 } : {}),
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
	const finalResult: any = await MoneyGoal.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		money_goal_dateType: dtTypPrm2,
		money_goal_dateStart: dtStrtPrm,
		money_goal_dateEnd: dtEndPrm,
		money_goal_income: OBJECT_param.money_goal_income,
		money_goal_expense: OBJECT_param.money_goal_expense,
		money_goal_regDt: new Date(),
		money_goal_updateDt: ``,
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
		const finalResult: any = await MoneyGoal.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				money_goal_dateStart: dtStrtPrm,
				money_goal_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { money_goal_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					money_goal_income: OBJECT_param.money_goal_income,
					money_goal_expense: OBJECT_param.money_goal_expense,
					money_goal_updateDt: new Date(),
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
		const finalResult: any = await MoneyGoal.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				money_goal_dateStart: dtStrtPrm,
				money_goal_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { money_goal_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					money_goal_income: OBJECT_param.money_goal_income,
					money_goal_expense: OBJECT_param.money_goal_expense,
					money_goal_updateDt: new Date(),
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
	const finalResult: any = await MoneyGoal.findOneAndDelete({
		user_id: usrIdPrm,
		money_goal_dateStart: dtStrtPrm,
		money_goal_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { money_goal_dateType: dtTypPrm2 } : {}),
	}).lean();

	return finalResult;
};
