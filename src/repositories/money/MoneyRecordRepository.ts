/**
 * @file MoneyRecordRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";
import { MoneyRecord } from "@schemas/money/MoneyRecord";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
	user_id_param: string,
	dateType_param: string,
	dateStart_param: string,
	dateEnd_param: string,
) => {

	const finalResult = await MoneyRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				money_record_dateStart: {
					$lte: dateEnd_param
				},
				money_record_dateEnd: {
					$gte: dateStart_param,
				},
				...dateType_param ? { money_record_dateType: dateType_param } : {},
			}
		},
		{
			$project: {
				_id: 0,
				money_record_dateType: 1,
				money_record_dateStart: 1,
				money_record_dateEnd: 1,
			}
		},
		{
			$sort: {
				money_record_dateStart: 1
			}
		}
	]);

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
	part_param?: string,
	title_param?: string,
) => {

	// part, title 필터 조건 구성
	const matchSection: any = {};
	if (part_param && part_param !== `all`) {
		matchSection[`money_section.money_record_part`] = part_param;
	}
	if (title_param && title_param !== `all`) {
		matchSection[`money_section.money_record_title`] = title_param;
	}

	const finalResult = await MoneyRecord.aggregate([
		{
			$match: {
				user_id: user_id_param,
				money_record_dateStart: {
					$gte: dateStart_param,
					$lte: dateEnd_param
				},
				money_record_dateEnd: {
					$gte: dateStart_param,
					$lte: dateEnd_param
				},
				...dateType_param ? { money_record_dateType: dateType_param } : {},
				...matchSection,
			}
		},
		{
			$project: {
				_id: 0,
				money_record_dateType: 1,
				money_record_dateStart: 1,
				money_record_dateEnd: 1,
				money_record_total_income: 1,
				money_record_total_expense: 1,
				money_section: 1,
			}
		},
		{
			$sort: {
				money_record_dateStart: sort_param
			}
		},
		{
			$skip: (Number(page_param) - 1)
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

	const finalResult = await MoneyRecord.findOne(
		{
			user_id: user_id_param,
			money_record_dateStart: dateStart_param,
			money_record_dateEnd: dateEnd_param,
			...dateType_param ? { money_record_dateType: dateType_param } : {},
		}
	)
	.lean();

	return finalResult;
};

// 3. create ---------------------------------------------------------------------------------------
export const create = async (
	user_id_param: string,
	OBJECT_param: any,
	dateType_param: string,
	dateStart_param: string,
	dateEnd_param: string,
) => {

	const finalResult = await MoneyRecord.create(
		{
			_id: new mongoose.Types.ObjectId(),
			user_id: user_id_param,
			money_record_dateType: dateType_param,
			money_record_dateStart: dateStart_param,
			money_record_dateEnd: dateEnd_param,
			money_record_total_income: OBJECT_param.money_record_total_income,
			money_record_total_expense: OBJECT_param.money_record_total_expense,
			money_section: OBJECT_param.money_section,
			money_record_regDt: new Date(),
			money_record_updateDt: ``,
		}
	);

	return finalResult;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = {

	// 1. update (기존항목 유지 + 타겟항목으로 수정)
	update: async (
		user_id_param: string,
		OBJECT_param: any,
		dateType_param: string,
		dateStart_param: string,
		dateEnd_param: string,
	) => {

		const finalResult = await MoneyRecord.findOneAndUpdate(
			{
				user_id: user_id_param,
				money_record_dateStart: dateStart_param,
				money_record_dateEnd: dateEnd_param,
				...dateType_param ? { money_record_dateType: dateType_param } : {},
			},
			{
				$set: {
					money_record_total_income: OBJECT_param.money_record_total_income,
					money_record_total_expense: OBJECT_param.money_record_total_expense,
					money_section: OBJECT_param.money_section,
					money_record_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true
			}
		)
		.lean();

		return finalResult;
	},

	// 2. insert (기존항목 제거 + 타겟항목에 추가)
	insert: async (
		user_id_param: string,
		OBJECT_param: any,
		dateType_param: string,
		dateStart_param: string,
		dateEnd_param: string,
	) => {

		const findResult: any = await MoneyRecord.findOne(
			{
				user_id: user_id_param,
				money_record_dateStart: dateStart_param,
				money_record_dateEnd: dateEnd_param,
				...dateType_param ? { money_record_dateType: dateType_param } : {},
			},
		)
		.lean();

		const newIncome: string = String(
			Number.parseFloat(findResult.money_record_total_income as string) +
      Number.parseFloat(OBJECT_param.money_record_total_income as string)
		);
		const newExpense: string = String(
			Number.parseFloat(findResult.money_record_total_expense as string) +
      Number.parseFloat(OBJECT_param.money_record_total_expense as string)
		);

		const finalResult = await MoneyRecord.updateOne(
			{
				user_id: user_id_param,
				money_record_dateStart: dateStart_param,
				money_record_dateEnd: dateEnd_param,
				...dateType_param ? { money_record_dateType: dateType_param } : {},
			},
			{
				$set: {
					money_record_total_income: newIncome,
					money_record_total_expense: newExpense,
					money_record_updateDt: new Date(),
				},
				$push: {
					money_section: OBJECT_param.money_section
				}
			},
			{
				upsert: true,
			}
		)
		.lean();

		return finalResult;
	},

	// 3. replace (기존항목 제거 + 타겟항목을 교체)
	replace: async (
		user_id_param: string,
		OBJECT_param: any,
		dateType_param: string,
		dateStart_param: string,
		dateEnd_param: string,
	) => {

		const finalResult = await MoneyRecord.findOneAndUpdate(
			{
				user_id: user_id_param,
				money_record_dateStart: dateStart_param,
				money_record_dateEnd: dateEnd_param,
				...dateType_param ? { money_record_dateType: dateType_param } : {},
			},
			{
				$set: {
					money_record_total_income: OBJECT_param.money_record_total_income,
					money_record_total_expense: OBJECT_param.money_record_total_expense,
					money_section: OBJECT_param.money_section,
					money_record_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true
			}
		)
		.lean();

		return finalResult;
	}
};

// 5. delete ---------------------------------------------------------------------------------------
export const deletes = async (
	user_id_param: string,
	dateType_param: string,
	dateStart_param: string,
	dateEnd_param: string,
) => {

	const finalResult = await MoneyRecord.findOneAndDelete(
		{
			user_id: user_id_param,
			money_record_dateStart: dateStart_param,
			money_record_dateEnd: dateEnd_param,
			...dateType_param ? { money_record_dateType: dateType_param } : {},
		}
	)
	.lean();

	return finalResult;
};
