/**
 * @file SleepRecordRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { SleepRecord } from "@schemas/sleep/SleepRecord";
import mongoose from "mongoose";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
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
					$lte: dtEndPrm,
				},
				sleep_record_dateEnd: {
					$gte: dtStrtPrm,
				},
				...(dtTypPrm2 ? { sleep_record_dateType: dtTypPrm2 } : {}),
			},
		},
		{
			$project: {
				_id: 0,
				sleep_record_dateType: 1,
				sleep_record_dateStart: 1,
				sleep_record_dateEnd: 1,
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

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const list = async (
	usrIdPrm: string,
	dtTypPrm2: string,
	dtStrtPrm: string,
	dtEndPrm: string,
	sort_param: 1 | -1,
	page_param: number,
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
			$project: {
				_id: 1,
				sleep_record_dateType: 1,
				sleep_record_dateStart: 1,
				sleep_record_dateEnd: 1,
				sleep_section: 1,
				sleep_record_regDt: 1,
				sleep_record_updateDt: 1,
			},
		},
		{
			$sort: {
				sleep_record_dateStart: sort_param,
			},
		},
		// pagination/grouping is handled in service layer to ensure unique dates
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
	const finalResult: any = await SleepRecord.findOne({
		user_id: usrIdPrm,
		sleep_record_dateStart: dtStrtPrm,
		sleep_record_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { sleep_record_dateType: dtTypPrm2 } : {}),
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
	const finalResult: any = await SleepRecord.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		sleep_record_dateType: dtTypPrm2,
		sleep_record_dateStart: dtStrtPrm,
		sleep_record_dateEnd: dtEndPrm,
		sleep_section: OBJECT_param.sleep_section,
		sleep_record_regDt: new Date(),
		sleep_record_updateDt: ``,
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
		const finalResult: any = await SleepRecord.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				sleep_record_dateStart: dtStrtPrm,
				sleep_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { sleep_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					sleep_section: OBJECT_param.sleep_section,
					sleep_record_updateDt: new Date(),
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
		const finalResult: any = await SleepRecord.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				sleep_record_dateStart: dtStrtPrm,
				sleep_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { sleep_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					sleep_section: OBJECT_param.sleep_section,
					sleep_record_updateDt: new Date(),
				},
			},
			{
				upsert: true,
				new: true,
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
		const finalResult: any = await SleepRecord.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				sleep_record_dateStart: dtStrtPrm,
				sleep_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { sleep_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					sleep_section: OBJECT_param.sleep_section,
					sleep_record_updateDt: new Date(),
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
	const finalResult: any = await SleepRecord.findOneAndDelete({
		user_id: usrIdPrm,
		sleep_record_dateStart: dtStrtPrm,
		sleep_record_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { sleep_record_dateType: dtTypPrm2 } : {}),
	}).lean();

	return finalResult;
};
