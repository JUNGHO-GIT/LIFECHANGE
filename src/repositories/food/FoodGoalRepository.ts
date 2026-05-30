/**
 * @file FoodGoalRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { FoodGoal } from "@schemas/food/FoodGoal";
import { FoodRecord } from "@schemas/food/FoodRecord";
import mongoose from "mongoose";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await FoodGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				food_goal_dateStart: {
					$lte: dtEndPrm,
				},
				food_goal_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { food_goal_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				food_goal_dateType: 1,
				food_goal_dateStart: 1,
				food_goal_dateEnd: 1,
			},
		},
		{
			$sort: {
				food_goal_dateStart: 1,
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
	const finalResult: any = await FoodGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				food_goal_dateStart: {
					$lte: dtEndPrm,
				},
				food_goal_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { food_goal_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				food_goal_dateType: 1,
				food_goal_dateStart: 1,
				food_goal_dateEnd: 1,
				food_goal_kcal: 1,
				food_goal_carb: 1,
				food_goal_protein: 1,
				food_goal_fat: 1,
			},
		},
		{
			$sort: {
				food_goal_dateStart: sort_param,
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
	const finalResult: any = await FoodRecord.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				food_record_dateStart: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				food_record_dateEnd: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				...(dtTypPrm2 ? { food_record_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				food_record_dateType: 1,
				food_record_dateStart: 1,
				food_record_dateEnd: 1,
				food_record_total_kcal: 1,
				food_record_total_carb: 1,
				food_record_total_protein: 1,
				food_record_total_fat: 1,
			},
		},
		{
			$sort: {
				food_record_dateStart: 1,
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
	const finalResult: any = await FoodGoal.findOne({
		user_id: usrIdPrm,
		food_goal_dateStart: dtStrtPrm,
		food_goal_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { food_goal_dateType: dtTypPrm2 } : {}),
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
	const finalResult: any = await FoodGoal.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		food_goal_dateType: dtTypPrm2,
		food_goal_dateStart: dtStrtPrm,
		food_goal_dateEnd: dtEndPrm,
		food_goal_kcal: OBJECT_param.food_goal_kcal,
		food_goal_carb: OBJECT_param.food_goal_carb,
		food_goal_protein: OBJECT_param.food_goal_protein,
		food_goal_fat: OBJECT_param.food_goal_fat,
		food_goal_regDt: new Date(),
		food_goal_updateDt: ``,
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
		const finalResult: any = await FoodGoal.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				food_goal_dateStart: dtStrtPrm,
				food_goal_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { food_goal_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					food_goal_kcal: OBJECT_param.food_goal_kcal,
					food_goal_carb: OBJECT_param.food_goal_carb,
					food_goal_protein: OBJECT_param.food_goal_protein,
					food_goal_fat: OBJECT_param.food_goal_fat,
					food_goal_updateDt: new Date(),
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
		const finalResult: any = await FoodGoal.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				food_goal_dateStart: dtStrtPrm,
				food_goal_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { food_goal_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					food_goal_kcal: OBJECT_param.food_goal_kcal,
					food_goal_carb: OBJECT_param.food_goal_carb,
					food_goal_protein: OBJECT_param.food_goal_protein,
					food_goal_fat: OBJECT_param.food_goal_fat,
					food_goal_updateDt: new Date(),
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
	const finalResult: any = await FoodGoal.findOneAndDelete({
		user_id: usrIdPrm,
		food_goal_dateStart: dtStrtPrm,
		food_goal_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { food_goal_dateType: dtTypPrm2 } : {}),
	}).lean();

	return finalResult;
};
