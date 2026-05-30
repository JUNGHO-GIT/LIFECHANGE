/**
 * @file MoneyRecordRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { MoneyRecord } from "@schemas/money/MoneyRecord";
import mongoose from "mongoose";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
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
					$lte: dtEndPrm,
				},
				money_record_dateEnd: {
					$gte: dtStrtPrm,
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

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const list = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
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
				...matchSection,
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
				money_section: {
					$filter: {
						input: `$money_section`,
						as: `section`,
						cond: {
							$and: [
								part_param && part_param !== `all`
									? { $eq: [`$$section.money_record_part`, part_param] }
									: true,
								title_param && title_param !== `all`
									? { $eq: [`$$section.money_record_title`, title_param] }
									: true,
							],
						},
					},
				},
			},
		},
		{
			$addFields: {
				money_record_total_income: {
					$toString: {
						$reduce: {
							input: `$money_section`,
							initialValue: 0,
							in: {
								$cond: [
									{
										$and: [
											{ $eq: [`$$this.money_record_part`, `income`] },
											{ $eq: [`$$this.money_record_include`, `Y`] },
										],
									},
									{
										$add: [
											`$$value`,
											{ $toDouble: `$$this.money_record_amount` },
										],
									},
									`$$value`,
								],
							},
						},
					},
				},
				money_record_total_expense: {
					$toString: {
						$reduce: {
							input: `$money_section`,
							initialValue: 0,
							in: {
								$cond: [
									{
										$and: [
											{ $eq: [`$$this.money_record_part`, `expense`] },
											{ $eq: [`$$this.money_record_include`, `Y`] },
										],
									},
									{
										$add: [
											`$$value`,
											{ $toDouble: `$$this.money_record_amount` },
										],
									},
									`$$value`,
								],
							},
						},
					},
				},
			},
		},
		{
			$sort: {
				money_record_dateStart: sort_param,
			},
		},
		{
			$skip: Number(page_param) - 1,
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
	const finalResult: any = await MoneyRecord.findOne({
		user_id: usrIdPrm,
		money_record_dateStart: dtStrtPrm,
		money_record_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { money_record_dateType: dtTypPrm2 } : {}),
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
	const finalResult: any = await MoneyRecord.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		money_record_dateType: dtTypPrm2,
		money_record_dateStart: dtStrtPrm,
		money_record_dateEnd: dtEndPrm,
		money_record_total_income: OBJECT_param.money_record_total_income,
		money_record_total_expense: OBJECT_param.money_record_total_expense,
		money_section: OBJECT_param.money_section,
		money_record_regDt: new Date(),
		money_record_updateDt: ``,
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
		const finalResult: any = await MoneyRecord.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				money_record_dateStart: dtStrtPrm,
				money_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { money_record_dateType: dtTypPrm2 } : {}),
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
		const findResult: any = await MoneyRecord.findOne({
			user_id: usrIdPrm,
			money_record_dateStart: dtStrtPrm,
			money_record_dateEnd: dtEndPrm,
			...(dtTypPrm2 ? { money_record_dateType: dtTypPrm2 } : {}),
		}).lean();

		const newIncome: string = String(
			Number.parseFloat(findResult.money_record_total_income as string) +
				Number.parseFloat(OBJECT_param.money_record_total_income as string),
		);
		const newExpense: string = String(
			Number.parseFloat(findResult.money_record_total_expense as string) +
				Number.parseFloat(OBJECT_param.money_record_total_expense as string),
		);

		const finalResult: any = await MoneyRecord.updateOne(
			{
				user_id: usrIdPrm,
				money_record_dateStart: dtStrtPrm,
				money_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { money_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					money_record_total_income: newIncome,
					money_record_total_expense: newExpense,
					money_record_updateDt: new Date(),
				},
				$push: {
					money_section: OBJECT_param.money_section,
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
		const finalResult: any = await MoneyRecord.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				money_record_dateStart: dtStrtPrm,
				money_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { money_record_dateType: dtTypPrm2 } : {}),
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
	const finalResult: any = await MoneyRecord.findOneAndDelete({
		user_id: usrIdPrm,
		money_record_dateStart: dtStrtPrm,
		money_record_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { money_record_dateType: dtTypPrm2 } : {}),
	}).lean();

	return finalResult;
};
