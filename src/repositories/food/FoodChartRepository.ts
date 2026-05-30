/**
 * @file FoodChartRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { FoodGoal } from "@schemas/food/FoodGoal";
import { FoodRecord } from "@schemas/food/FoodRecord";

// 1-1. chart (bar - goal) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const barGoal = async (
	usrIdPrm: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await FoodGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				food_goal_dateStart: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				food_goal_dateEnd: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
			},
		},
		{
			$project: {
				_id: 0,
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
				food_goal_dateStart: 1,
			},
		},
	]);

	return finalResult;
};

// 1-2. chart (bar - record) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const barRecord = async (
	usrIdPrm: string,
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
			},
		},
		{
			$project: {
				_id: 0,
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

// 2-1. chart (pie - kcal) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const pieKcal = async (
	usrIdPrm: string,
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
			},
		},
		{
			$unwind: `$food_section`,
		},
		{
			$group: {
				_id: `$food_section.food_record_name`,
				value: {
					$sum: {
						$toDouble: `$food_section.food_record_kcal`,
					},
				},
			},
		},
		{
			$sort: {
				value: -1,
			},
		},
		{
			$limit: 5,
		},
	]);

	return finalResult;
};

// 2-2. chart (pie - nut) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const pieNut = async (
	usrIdPrm: string,
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
			},
		},
		{
			$group: {
				_id: null,
				total_carb: {
					$sum: {
						$toDouble: `$food_record_total_carb`,
					},
				},
				total_protein: {
					$sum: {
						$toDouble: `$food_record_total_protein`,
					},
				},
				total_fat: {
					$sum: {
						$toDouble: `$food_record_total_fat`,
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				food_record_total_carb: `$total_carb`,
				food_record_total_protein: `$total_protein`,
				food_record_total_fat: `$total_fat`,
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

// 3-1. chart (line - kcal) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const lineKcal = async (
	usrIdPrm: string,
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
			},
		},
		{
			$project: {
				_id: 0,
				food_record_dateStart: 1,
				food_record_dateEnd: 1,
				food_record_total_kcal: 1,
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

// 3-2. chart (line - nut) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const lineNut = async (
	usrIdPrm: string,
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
			},
		},
		{
			$project: {
				_id: 0,
				food_record_dateStart: 1,
				food_record_dateEnd: 1,
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

// 4-1. chart (avg - kcal) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const avgKcal = async (
	usrIdPrm: string,
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
			},
		},
		{
			$project: {
				_id: 0,
				food_record_dateStart: 1,
				food_record_dateEnd: 1,
				food_record_total_kcal: 1,
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

// 4-2. chart (avg - nut) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const avgNut = async (
	usrIdPrm: string,
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
			},
		},
		{
			$project: {
				_id: 0,
				food_record_dateStart: 1,
				food_record_dateEnd: 1,
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
