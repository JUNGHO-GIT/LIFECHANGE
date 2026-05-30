/**
 * @file ExerciseRecordRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { decimalToTime as dcmlTTm, timeToDecimal as tmTDcml } from "@assets/scripts/utils";
import { ExerciseRecord as ExerRec2 } from "@schemas/exercise/ExerciseRecord";
import mongoose from "mongoose";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
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
					$lte: dtEndPrm,
				},
				exercise_record_dateEnd: {
					$gte: dtStrtPrm,
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
		matchSection[`exercise_section.exercise_record_part`] = part_param;
	}
	if (title_param && title_param !== `all`) {
		matchSection[`exercise_section.exercise_record_title`] = title_param;
	}

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
				...matchSection,
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
				exercise_section: {
					$filter: {
						input: `$exercise_section`,
						as: `section`,
						cond: {
							$and: [
								part_param && part_param !== `all`
									? { $eq: [`$$section.exercise_record_part`, part_param] }
									: true,
								title_param && title_param !== `all`
									? { $eq: [`$$section.exercise_record_title`, title_param] }
									: true,
							],
						},
					},
				},
			},
		},
		{
			$addFields: {
				exercise_record_total_volume: {
					$toString: {
						$reduce: {
							input: `$exercise_section`,
							initialValue: 0,
							in: {
								$add: [
									`$$value`,
									{ $toDouble: `$$this.exercise_record_volume` },
								],
							},
						},
					},
				},
				exercise_record_total_cardio_minutes: {
					$reduce: {
						input: `$exercise_section`,
						initialValue: 0,
						in: {
							$let: {
								vars: {
									parts: { $split: [`$$this.exercise_record_cardio`, `:`] },
								},
								in: {
									$add: [
										`$$value`,
										{
											$add: [
												{
													$multiply: [
														{ $toInt: { $arrayElemAt: [`$$parts`, 0] } },
														60,
													],
												},
												{ $toInt: { $arrayElemAt: [`$$parts`, 1] } },
											],
										},
									],
								},
							},
						},
					},
				},
			},
		},
		{
			$addFields: {
				exercise_record_total_cardio: {
					$concat: [
						{
							$cond: [
								{
									$lt: [
										{
											$floor: {
												$divide: [`$exercise_record_total_cardio_minutes`, 60],
											},
										},
										10,
									],
								},
								{
									$concat: [
										`0`,
										{
											$toString: {
												$floor: {
													$divide: [
														`$exercise_record_total_cardio_minutes`,
														60,
													],
												},
											},
										},
									],
								},
								{
									$toString: {
										$floor: {
											$divide: [`$exercise_record_total_cardio_minutes`, 60],
										},
									},
								},
							],
						},
						`:`,
						{
							$cond: [
								{
									$lt: [
										{ $mod: [`$exercise_record_total_cardio_minutes`, 60] },
										10,
									],
								},
								{
									$concat: [
										`0`,
										{
											$toString: {
												$mod: [`$exercise_record_total_cardio_minutes`, 60],
											},
										},
									],
								},
								{
									$toString: {
										$mod: [`$exercise_record_total_cardio_minutes`, 60],
									},
								},
							],
						},
					],
				},
			},
		},
		{
			$project: {
				exercise_record_total_cardio_minutes: 0,
			},
		},
		{
			$sort: {
				exercise_record_dateStart: sort_param,
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
	const finalResult: any = await ExerRec2.findOne({
		user_id: usrIdPrm,
		exercise_record_dateStart: dtStrtPrm,
		exercise_record_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { exercise_record_dateType: dtTypPrm2 } : {}),
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
	const finalResult: any = await ExerRec2.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		exercise_record_dateType: dtTypPrm2,
		exercise_record_dateStart: dtStrtPrm,
		exercise_record_dateEnd: dtEndPrm,
		exercise_record_total_volume: OBJECT_param.exercise_record_total_volume,
		exercise_record_total_cardio: OBJECT_param.exercise_record_total_cardio,
		exercise_record_total_scale: OBJECT_param.exercise_record_total_scale,
		exercise_section: OBJECT_param.exercise_section,
		exercise_record_regDt: new Date(),
		exercise_record_updateDt: ``,
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
		const finalResult: any = await ExerRec2.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				exercise_record_dateStart: dtStrtPrm,
				exercise_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { exercise_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					exercise_record_total_volume:
						OBJECT_param.exercise_record_total_volume,
					exercise_record_total_cardio:
						OBJECT_param.exercise_record_total_cardio,
					exercise_record_total_scale: OBJECT_param.exercise_record_total_scale,
					exercise_section: OBJECT_param.exercise_section,
					exercise_record_updateDt: new Date(),
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
		const findResult: any = await ExerRec2.findOne({
			user_id: usrIdPrm,
			exercise_record_dateStart: dtStrtPrm,
			exercise_record_dateEnd: dtEndPrm,
			...(dtTypPrm2 ? { exercise_record_dateType: dtTypPrm2 } : {}),
		}).lean();

		const newVolume: string = String(
			Number.parseFloat(findResult.exercise_record_total_volume as string) +
				Number.parseFloat(OBJECT_param.exercise_record_total_volume as string),
		);
		const newCardio: string = String(
			dcmlTTm(
				Number.parseFloat(
					String(
						tmTDcml(findResult.exercise_record_total_cardio as string),
					),
				) +
					Number.parseFloat(
						String(
							tmTDcml(
								OBJECT_param.exercise_record_total_cardio as string,
							),
						),
					),
			),
		);
		const newScale: string = String(
			Number.parseFloat(findResult.exercise_record_total_scale as string) +
				Number.parseFloat(OBJECT_param.exercise_record_total_scale as string),
		);

		const finalResult: any = await ExerRec2.updateOne(
			{
				user_id: usrIdPrm,
				exercise_record_dateStart: dtStrtPrm,
				exercise_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { exercise_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					exercise_record_total_volume: newVolume,
					exercise_record_total_cardio: newCardio,
					exercise_record_total_scale: newScale,
					exercise_record_updateDt: new Date(),
				},
				$push: {
					exercise_section: OBJECT_param.exercise_section,
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
		const finalResult: any = await ExerRec2.findOneAndUpdate(
			{
				user_id: usrIdPrm,
				exercise_record_dateStart: dtStrtPrm,
				exercise_record_dateEnd: dtEndPrm,
				...(dtTypPrm2 ? { exercise_record_dateType: dtTypPrm2 } : {}),
			},
			{
				$set: {
					exercise_record_total_volume:
						OBJECT_param.exercise_record_total_volume,
					exercise_record_total_cardio:
						OBJECT_param.exercise_record_total_cardio,
					exercise_record_total_scale: OBJECT_param.exercise_record_total_scale,
					exercise_section: OBJECT_param.exercise_section,
					exercise_record_updateDt: new Date(),
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
	const finalResult: any = await ExerRec2.findOneAndDelete({
		user_id: usrIdPrm,
		exercise_record_dateStart: dtStrtPrm,
		exercise_record_dateEnd: dtEndPrm,
		...(dtTypPrm2 ? { exercise_record_dateType: dtTypPrm2 } : {}),
	}).lean();

	return finalResult;
};
