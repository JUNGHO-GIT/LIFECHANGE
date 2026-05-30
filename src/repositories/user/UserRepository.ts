/**
 * @file UserRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { exerciseArray as exerArry } from "@assets/arrays/exerciseArray";
import { foodArray } from "@assets/arrays/foodArray";
import { moneyArray } from "@assets/arrays/moneyArray";
import { sleepArray } from "@assets/arrays/sleepArray";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { ExerciseRecord as ExerRec2 } from "@schemas/exercise/ExerciseRecord";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { FoodRecord } from "@schemas/food/FoodRecord";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { MoneyRecord } from "@schemas/money/MoneyRecord";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { SleepRecord } from "@schemas/sleep/SleepRecord";
import { User } from "@schemas/user/User";
import { Verify } from "@schemas/Verify";
import mongoose from "mongoose";

// 1-1. email - findId ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const emailFindId = async (usrIdPrm: string) => {
	const finalResult: any = await User.findOne({
		user_id: usrIdPrm,
	}).lean();

	return finalResult;
};

// 1-2. email - sendEmail ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const emlSndEml = async (
	usrIdPrm: string,
	code_param: string,
) => {
	const findResult: any = await Verify.findOne({
		verify_id: usrIdPrm,
	}).lean();

	if (findResult !== null) {
		await Verify.deleteMany({
			verify_id: usrIdPrm,
		});
	}

	const finalResult: any = await Verify.create({
		verify_id: usrIdPrm,
		verify_code: code_param,
		verify_regDt: new Date(),
	});

	return finalResult;
};

// 1-3. email - verifyEmail ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const emlVrfyEml = async (usrIdPrm: string) => {
	const finalResult: any = await Verify.findOne({
		verify_id: usrIdPrm,
	}).lean();

	return finalResult;
};

// 2-1. user - checkId ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const userCheckId = async (usrIdPrm: string) => {
	const finalResult: any = await User.findOne({
		user_id: usrIdPrm,
	}).lean();

	return finalResult;
};

// 2-2. user - signup ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const userSignup = async (usrIdPrm: string, OBJECT_param: any) => {
	const finalResult: any = await User.create({
		_id: new mongoose.Types.ObjectId(),
		user_id: usrIdPrm,
		user_google: `N`,
		user_token: OBJECT_param.user_token,
		user_pw: OBJECT_param.user_pw,
		user_image: OBJECT_param.user_image,

		user_initScale: OBJECT_param.user_initScale,
		user_minScale: ``,
		user_maxScale: ``,
		user_curScale: ``,

		user_initAvgKcalIntake: OBJECT_param.user_initAvgKcalIntake,
		user_totalKcalIntake: ``,
		user_totalCarbIntake: ``,
		user_totalProteinIntake: ``,
		user_totalFatIntake: ``,
		user_curAvgKcalIntake: ``,
		user_curAvgCarbIntake: ``,
		user_curAvgProteinIntake: ``,
		user_curAvgFatIntake: ``,

		user_initProperty: OBJECT_param.user_initProperty,
		user_totalIncomeAll: ``,
		user_totalIncomeExclusion: ``,
		user_totalExpenseAll: ``,
		user_totalExpenseExclusion: ``,
		user_curPropertyAll: ``,
		user_curPropertyExclusion: ``,

		user_favorite: [
			{
				food_record_key: ``,
				food_record_name: ``,
				food_record_brand: ``,
				food_record_kcal: ``,
				food_record_carb: ``,
				food_record_protein: ``,
				food_record_fat: ``,
			},
		],
		user_dataCategory: {
			exercise: exerArry,
			food: foodArray,
			money: moneyArray,
			sleep: sleepArray,
		},
		user_regDt: new Date(),
		user_updateDt: ``,
	});

	return finalResult;
};

// 2-3. user - resetPw ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const userResetPw = async (usrIdPrm: string, OBJECT_param: any) => {
	const finalResult: any = await User.findOneAndUpdate(
		{
			user_id: usrIdPrm,
		},
		{
			$set: {
				user_token: OBJECT_param.user_token,
				user_pw: OBJECT_param.user_pw,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	return finalResult;
};

// 2-4. user - login ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const userLogin = async (
	usrIdPrm: string,
	usrPwPrm: string,
) => {
	const finalResult: any = await User.findOne({
		user_id: usrIdPrm,
		user_pw: usrPwPrm,
	}).lean();

	return finalResult;
};

// 2-5. user - detail ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const userDetail = async (usrIdPrm: string) => {
	const finalResult: any = await User.findOne({
		user_id: usrIdPrm,
	}).lean();

	return finalResult;
};

// 2-6. user - update ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const userUpdate = async (usrIdPrm: string, OBJECT_param: any) => {
	const finalResult: any = await User.findOneAndUpdate(
		{
			user_id: usrIdPrm,
		},
		{
			$set: {
				user_image: OBJECT_param.user_image,
				user_initScale: OBJECT_param.user_initScale,
				user_initAvgKcalIntake: OBJECT_param.user_initAvgKcalIntake,
				user_initProperty: OBJECT_param.user_initProperty,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	return finalResult;
};

// 2-7. user - delete ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const userDelete = async (usrIdPrm: string) => {
	const finalResult = await ExerciseGoal.deleteMany({
		user_id: usrIdPrm,
	});
	await ExerRec2.deleteMany({
		user_id: usrIdPrm,
	});
	await FoodGoal.deleteMany({
		user_id: usrIdPrm,
	});
	await FoodRecord.deleteMany({
		user_id: usrIdPrm,
	});
	await MoneyGoal.deleteMany({
		user_id: usrIdPrm,
	});
	await MoneyRecord.deleteMany({
		user_id: usrIdPrm,
	});
	await SleepGoal.deleteMany({
		user_id: usrIdPrm,
	});
	await SleepRecord.deleteMany({
		user_id: usrIdPrm,
	});
	await User.deleteOne({
		user_id: usrIdPrm,
	});

	return finalResult;
};

// 3-2. category - detail ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const catDtl = async (usrIdPrm: string) => {
	const finalResult: any = await User.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
			},
		},
		{
			$project: {
				_id: 0,
				exercise: `$user_dataCategory.exercise`,
				food: `$user_dataCategory.food`,
				money: `$user_dataCategory.money`,
				sleep: `$user_dataCategory.sleep`,
			},
		},
	]);

	return finalResult[0];
};

// 3-4. category - update ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const catUpdt = async (
	usrIdPrm: string,
	OBJECT_param: any,
) => {
	const finalResult: any = await User.findOneAndUpdate(
		{
			user_id: usrIdPrm,
		},
		{
			$set: {
				user_dataCategory: {
					exercise: OBJECT_param.exercise,
					food: OBJECT_param.food,
					money: OBJECT_param.money,
					sleep: OBJECT_param.sleep,
				},
				user_updateDt: new Date(),
			},
		},
		{
			upsert: true,
			new: true,
		},
	).lean();

	return finalResult;
};
