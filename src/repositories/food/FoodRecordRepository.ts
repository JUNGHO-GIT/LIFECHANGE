/**
 * @file FoodRecordRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { FoodRecord } from "@schemas/food/FoodRecord";
import { User } from "@schemas/user/User";
import mongoose from "mongoose";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
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
					$lte: dtEndPrm,
				},
				food_record_dateEnd: {
					$gte: dtStrtPrm,
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

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const list = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
	sort_param: 1 | -1,
	page_param: number,
	part_param?: string,
) => {
	// part 필터 조건 구성
	const matchSection: any = {};
	if (part_param && part_param !== `all`) {
		matchSection[`food_section.food_record_part`] = part_param;
	}

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
				...matchSection,
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
				food_section: {
					$filter: {
						input: `$food_section`,
						as: `section`,
						cond: {
							$and: [
								part_param && part_param !== `all`
									? { $eq: [`$$section.food_record_part`, part_param] }
									: true,
							],
						},
					},
				},
			},
		},
		{
			$addFields: {
				food_record_total_kcal: {
					$toString: {
						$reduce: {
							input: `$food_section`,
							initialValue: 0,
							in: {
								$add: [`$$value`, { $toDouble: `$$this.food_record_kcal` }],
							},
						},
					},
				},
				food_record_total_carb: {
					$toString: {
						$reduce: {
							input: `$food_section`,
							initialValue: 0,
							in: {
								$add: [`$$value`, { $toDouble: `$$this.food_record_carb` }],
							},
						},
					},
				},
				food_record_total_protein: {
					$toString: {
						$reduce: {
							input: `$food_section`,
							initialValue: 0,
							in: {
								$add: [`$$value`, { $toDouble: `$$this.food_record_protein` }],
							},
						},
					},
				},
				food_record_total_fat: {
					$toString: {
						$reduce: {
							input: `$food_section`,
							initialValue: 0,
							in: {
								$add: [`$$value`, { $toDouble: `$$this.food_record_fat` }],
							},
						},
					},
				},
			},
		},
		{
			$sort: {
				food_record_dateStart: sort_param,
			},
		},
		{
			$skip: Number(page_param) - 1,
		},
	]);

	return finalResult;
};

// 1-2. favorite ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const favorite = async (usrIdPrm: string) => {
	const finalResult: any = await User.findOne(
		{
			user_id: usrIdPrm,
		},
		{
			_id: 0,
			user_favorite: 1,
		},
	).lean();

	return finalResult?.user_favorite;
};

// 2. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const detail = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await FoodRecord.findOne({
		user_id: usrIdPrm,
		food_record_dateStart: dtStrtPrm,
		food_record_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { food_record_dateType: dtTypPrm2 } : {}),
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
	const finalResult: any = await FoodRecord.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		food_record_dateType: dtTypPrm2,
		food_record_dateStart: dtStrtPrm,
		food_record_dateEnd: dtEndPrm,
		food_record_total_kcal: OBJECT_param.food_record_total_kcal,
		food_record_total_carb: OBJECT_param.food_record_total_carb,
		food_record_total_protein: OBJECT_param.food_record_total_protein,
		food_record_total_fat: OBJECT_param.food_record_total_fat,
		food_section: OBJECT_param.food_section,
		food_record_regDt: new Date(),
		food_record_updateDt: ``,
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
		const finalResult: any = await FoodRecord.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				food_record_dateStart: dtStrtPrm,
				food_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { food_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					food_record_total_kcal: OBJECT_param.food_record_total_kcal,
					food_record_total_carb: OBJECT_param.food_record_total_carb,
					food_record_total_protein: OBJECT_param.food_record_total_protein,
					food_record_total_fat: OBJECT_param.food_record_total_fat,
					food_section: OBJECT_param.food_section,
					food_record_updateDt: new Date(),
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
	insert: async (
		usrIdPrm: string,
		OBJECT_param: any,
		dtTypPrm2: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const findResult: any = await FoodRecord.findOne({
			user_id: usrIdPrm,
			food_record_dateStart: dtStrtPrm,
			food_record_dateEnd: dtEndPrm,
			...(dtTypPrm2 ? { food_record_dateType: dtTypPrm2 } : {}),
		}).lean();

		const newKcal: string = String(
			Number.parseFloat(findResult.food_record_total_kcal as string) +
				Number.parseFloat(OBJECT_param.food_record_total_kcal as string),
		);
		const newCarb: string = String(
			Number.parseFloat(findResult.food_record_total_carb as string) +
				Number.parseFloat(OBJECT_param.food_record_total_carb as string),
		);
		const newProtein: string = String(
			Number.parseFloat(findResult.food_record_total_protein as string) +
				Number.parseFloat(OBJECT_param.food_record_total_protein as string),
		);
		const newFat: string = String(
			Number.parseFloat(findResult.food_record_total_fat as string) +
				Number.parseFloat(OBJECT_param.food_record_total_fat as string),
		);

		const finalResult: any = await FoodRecord.updateOne(
			{
				user_id: usrIdPrm,
				food_record_dateStart: dtStrtPrm,
				food_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { food_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					food_record_total_kcal: newKcal,
					food_record_total_carb: newCarb,
					food_record_total_protein: newProtein,
					food_record_total_fat: newFat,
					food_record_updateDt: new Date(),
				},
				$push: {
					food_section: OBJECT_param.food_section,
				},
			},
			{
				upsert: true,
			},
		).lean();

		return finalResult;
	},

	// 3. replace (기존항목 제거 + 타겟항목을 교체)
	replace: async (
		usrIdPrm: string,
		OBJECT_param: any,
		dtTypPrm2: string,
		dtStrtPrm: string,
		dtEndPrm: string,
	) => {
		const finalResult: any = await FoodRecord.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				food_record_dateStart: dtStrtPrm,
				food_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { food_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					food_record_total_kcal: OBJECT_param.food_record_total_kcal,
					food_record_total_carb: OBJECT_param.food_record_total_carb,
					food_record_total_protein: OBJECT_param.food_record_total_protein,
					food_record_total_fat: OBJECT_param.food_record_total_fat,
					food_section: OBJECT_param.food_section,
					food_record_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true,
			},
		).lean();

		return finalResult;
	},

	// 4. update
	favorite: async (usrIdPrm: string, fdFavPrm: any) => {
		const finalResult: any = await User.findOneAndUpdate(
			{
				user_id: usrIdPrm,
			},
			{
				$set: {
					user_favorite: fdFavPrm,
				},
			},
			{
				upsert: true,
				new: true,
			},
		).lean();

		return finalResult.user_favorite;
	},
};

// 5. delete ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const deletes = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await FoodRecord.findOneAndDelete({
		user_id: usrIdPrm,
		food_record_dateStart: dtStrtPrm,
		food_record_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { food_record_dateType: dtTypPrm2 } : {}),
	}).lean();

	return finalResult;
};
