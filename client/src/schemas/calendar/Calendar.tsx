/**
 * @file Calendar.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

export interface CalendarExerciseSectionType {
	exercise_record_part: string;
	exercise_record_title: string;
	exercise_record_weight: string;
	exercise_record_set: string;
	exercise_record_rep: string;
	exercise_record_volume: string;
	exercise_record_cardio: string;
}
export interface CalendarFoodSectionType {
	food_record_part: string;
	food_record_name: string;
	food_record_brand: string;
	food_record_count: string;
	food_record_serv: string;
	food_record_gram: string;
	food_record_kcal: string;
	food_record_carb: string;
	food_record_protein: string;
	food_record_fat: string;
}
export interface CalendarMoneySectionType {
	money_record_part: string;
	money_record_title: string;
	money_record_include: string;
	money_record_amount: string;
	money_record_content: string;
}
export interface CalendarSleepSectionType {
	sleep_record_bedTime: string;
	sleep_record_wakeTime: string;
	sleep_record_sleepTime: string;
}
export interface CalendarType {
	user_id: string;
	calendar_number: number;
	calendar_exercise_dateType: string;
	calendar_exercise_dateStart: string;
	calendar_exercise_dateEnd: string;
	calendar_exercise_record_total_volume: string;
	calendar_exercise_record_total_cardio: string;
	calendar_food_dateType: string;
	calendar_food_dateStart: string;
	calendar_food_dateEnd: string;
	calendar_food_record_total_calorie: string;
	calendar_food_record_total_carb: string;
	calendar_food_record_total_protein: string;
	calendar_food_record_total_fat: string;
	calendar_money_dateType: string;
	calendar_money_dateStart: string;
	calendar_money_dateEnd: string;
	calendar_money_record_total_income: string;
	calendar_money_record_total_expense: string;
	calendar_sleep_dateType: string;
	calendar_sleep_dateStart: string;
	calendar_sleep_dateEnd: string;
	calendar_sleep_record_total_time: string;
	calendar_exercise_section: {
		exercise_record_part: string;
		exercise_record_title: string;
		exercise_record_weight: string;
		exercise_record_set: string;
		exercise_record_rep: string;
		exercise_record_volume: string;
		exercise_record_cardio: string;
	}[];
	calendar_food_section: {
		food_record_part: string;
		food_record_name: string;
		food_record_brand: string;
		food_record_count: string;
		food_record_serv: string;
		food_record_gram: string;
		food_record_kcal: string;
		food_record_carb: string;
		food_record_protein: string;
		food_record_fat: string;
	}[];
	calendar_money_section: {
		money_record_part: string;
		money_record_title: string;
		money_record_include: string;
		money_record_amount: string;
		money_record_content: string;
	}[];
	calendar_sleep_section: {
		sleep_record_bedTime: string;
		sleep_record_wakeTime: string;
		sleep_record_sleepTime: string;
	}[];
	calendar_regDt: string;
	calendar_updateDt: string;
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Calendar: CalendarType = {
	user_id: ``,
	calendar_number: 0,
	calendar_exercise_dateType: ``,
	calendar_exercise_dateStart: `0000-00-00`,
	calendar_exercise_dateEnd: `0000-00-00`,
	calendar_exercise_record_total_volume: `0`,
	calendar_exercise_record_total_cardio: `00:00`,
	calendar_food_dateType: ``,
	calendar_food_dateStart: `0000-00-00`,
	calendar_food_dateEnd: `0000-00-00`,
	calendar_food_record_total_calorie: `0`,
	calendar_food_record_total_carb: `0`,
	calendar_food_record_total_protein: `0`,
	calendar_food_record_total_fat: `0`,
	calendar_money_dateType: ``,
	calendar_money_dateStart: `0000-00-00`,
	calendar_money_dateEnd: `0000-00-00`,
	calendar_money_record_total_income: `0`,
	calendar_money_record_total_expense: `0`,
	calendar_sleep_dateType: ``,
	calendar_sleep_dateStart: `0000-00-00`,
	calendar_sleep_dateEnd: `0000-00-00`,
	calendar_sleep_record_total_time: `00:00`,
	calendar_exercise_section: [],
	calendar_food_section: [],
	calendar_money_section: [],
	calendar_sleep_section: [],
	calendar_regDt: ``,
	calendar_updateDt: ``,
};
