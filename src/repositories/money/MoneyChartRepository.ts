/**
 * @file MoneyChartRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { MoneyRecord } from "@schemas/money/MoneyRecord";

// 1-1. chart (bar - goal) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const barGoal = async (
	usrIdPrm: string,
	dtStrtPrm: string,
	dtEndPrm: string,
) => {
	const finalResult: any = await MoneyGoal.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
				money_goal_dateStart: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
				money_goal_dateEnd: {
					$gte: dtStrtPrm,
					$lte: dtEndPrm,
				},
			},
		},
		{
			$project: {
				_id: 0,
				money_goal_dateStart: 1,
				money_goal_dateEnd: 1,
				money_goal_income: 1,
				money_goal_expense: 1,
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

// 1-2. chart (bar - record) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const barRecord = async (
	usrIdPrm: string,
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
			},
		},
		{
			$project: {
				_id: 0,
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

// 2-1. chart (pie - income) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const pieIncome = async (
	usrIdPrm: string,
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
			},
		},
		{
			$unwind: `$money_section`,
		},
		{
			$match: {
				"money_section.money_record_part": `income`,
			},
		},
		{
			$group: {
				_id: `$money_section.money_record_title`,
				value: {
					$sum: {
						$toDouble: `$money_section.money_record_amount`,
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

// 2-2. chart (pie - expense) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const pieExpense = async (
	usrIdPrm: string,
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
			},
		},
		{
			$unwind: `$money_section`,
		},
		{
			$match: {
				"money_section.money_record_part": `expense`,
			},
		},
		{
			$group: {
				_id: `$money_section.money_record_title`,
				value: {
					$sum: {
						$toDouble: `$money_section.money_record_amount`,
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

// 3-1. chart (line - all) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const lineAll = async (
	usrIdPrm: string,
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
			},
		},
		{
			$project: {
				_id: 0,
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

// 4-1. chart (avg - all) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const avgAll = async (
	usrIdPrm: string,
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
			},
		},
		{
			$project: {
				_id: 0,
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
