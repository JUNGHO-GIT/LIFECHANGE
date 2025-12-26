/**
 * @file Calendar.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 0. types ---------------------------------------------------------------------------------------
declare type CalendarExerciseSection = {
	exercise_part: string;
	exercise_title: string;
	exercise_weight: string;
	exercise_set: string;
	exercise_rep: string;
	exercise_volume: string;
	exercise_cardio: string;
};
declare type CalendarFoodSection = {
	food_part: string;
	food_name: string;
	food_brand: string;
	food_count: string;
	food_serv: string;
	food_gram: string;
	food_kcal: string;
	food_carb: string;
	food_protein: string;
	food_fat: string;
};
declare type CalendarMoneySection = {
	money_part: string;
	money_title: string;
	money_include: string;
	money_amount: string;
	money_content: string;
};
declare type CalendarSleepSection = {
	sleep_bedTime: string;
	sleep_wakeTime: string;
	sleep_sleepTime: string;
};
declare type CalendarType = mongoose.Document & {
	user_id: string;
	calendar_number: number;
	calendar_exercise_dateType: string;
	calendar_exercise_dateStart: string;
	calendar_exercise_dateEnd: string;
	calendar_food_dateType: string;
	calendar_food_dateStart: string;
	calendar_food_dateEnd: string;
	calendar_money_dateType: string;
	calendar_money_dateStart: string;
	calendar_money_dateEnd: string;
	calendar_sleep_dateType: string;
	calendar_sleep_dateStart: string;
	calendar_sleep_dateEnd: string;
	calendar_exercise_section: CalendarExerciseSection[];
	calendar_food_section: CalendarFoodSection[];
	calendar_money_section: CalendarMoneySection[];
	calendar_sleep_section: CalendarSleepSection[];
	calendar_regDt: Date;
	calendar_updateDt: Date;
};
// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema(
	{
		user_id: {
			type: String,
			default: ``,
			required: true,
		},
		calendar_number: {
			type: Number,
			default: 0,
			unique: true,
		},
		calendar_exercise_dateType: {
			type: String,
			default: ``,
			required: false,
		},
		calendar_exercise_dateStart: {
			type: String,
			default: `0000-00-00`,
			required: false,
		},
		calendar_exercise_dateEnd: {
			type: String,
			default: `0000-00-00`,
			required: false,
		},
		calendar_food_dateType: {
			type: String,
			default: ``,
			required: false,
		},
		calendar_food_dateStart: {
			type: String,
			default: `0000-00-00`,
			required: false,
		},
		calendar_food_dateEnd: {
			type: String,
			default: `0000-00-00`,
			required: false,
		},
		calendar_money_dateType: {
			type: String,
			default: ``,
			required: false,
		},
		calendar_money_dateStart: {
			type: String,
			default: `0000-00-00`,
			required: false,
		},
		calendar_money_dateEnd: {
			type: String,
			default: `0000-00-00`,
			required: false,
		},
		calendar_sleep_dateType: {
			type: String,
			default: ``,
			required: false,
		},
		calendar_sleep_dateStart: {
			type: String,
			default: `0000-00-00`,
			required: false,
		},
		calendar_sleep_dateEnd: {
			type: String,
			default: `0000-00-00`,
			required: false,
		},
		calendar_exercise_section: [
			{
				exercise_part: {
					type: String,
					default: ``,
					required: false,
				},
				exercise_title: {
					type: String,
					default: ``,
					required: false,
				},
				exercise_weight: {
					type: String,
					default: ``,
					required: false,
				},
				exercise_set: {
					type: String,
					default: ``,
					required: false,
				},
				exercise_rep: {
					type: String,
					default: ``,
					required: false,
				},
				exercise_volume: {
					type: String,
					default: ``,
					required: false,
				},
				exercise_cardio: {
					type: String,
					default: `00:00`,
					required: false,
				},
			},
		],
		calendar_food_section: [
			{
				food_part: {
					type: String,
					default: ``,
					required: false,
				},
				food_name: {
					type: String,
					default: ``,
					required: false,
				},
				food_brand: {
					type: String,
					default: ``,
					required: false,
				},
				food_count: {
					type: String,
					default: ``,
					required: false,
				},
				food_serv: {
					type: String,
					default: ``,
					required: false,
				},
				food_gram: {
					type: String,
					default: ``,
					required: false,
				},
				food_kcal: {
					type: String,
					default: ``,
					required: false,
				},
				food_carb: {
					type: String,
					default: ``,
					required: false,
				},
				food_protein: {
					type: String,
					default: ``,
					required: false,
				},
				food_fat: {
					type: String,
					default: ``,
					required: false,
				},
			},
		],
		calendar_money_section: [
			{
				money_part: {
					type: String,
					default: ``,
					required: false,
				},
				money_title: {
					type: String,
					default: ``,
					required: false,
				},
				money_include: {
					type: String,
					default: `Y`,
					required: false,
				},
				money_amount: {
					type: String,
					default: 0,
					required: false,
				},
				money_content: {
					type: String,
					default: ``,
					required: false,
				},
			},
		],
		calendar_sleep_section: [
			{
				sleep_bedTime: {
					type: String,
					default: `00:00`,
					required: false,
				},
				sleep_wakeTime: {
					type: String,
					default: `00:00`,
					required: false,
				},
				sleep_sleepTime: {
					type: String,
					default: `00:00`,
					required: false,
				},
			},
		],
		calendar_regDt: {
			type: Date,
			default: Date.now,
			required: false,
		},
		calendar_updateDt: {
			type: Date,
			default: Date.now,
			required: false,
		},
	},
	{
		collection: `Calendar`,
		timestamps: {
			createdAt: `calendar_regDt`,
			updatedAt: `calendar_updateDt`,
		},
	},
);

// 3. counter --------------------------------------------------------------------------------------
schema.pre<CalendarType>(`save`, async function() {
	if (this.isNew) {
		this.calendar_number = await incrementSeq(`calendar_number`, `Calendar`);
	}
});

// 5. model ----------------------------------------------------------------------------------------
export const Calendar = mongoose.model<CalendarType>(`Calendar`, schema);
