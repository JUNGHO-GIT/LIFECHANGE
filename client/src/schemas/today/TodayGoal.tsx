// TodayGoal.tsx

// Types ------------------------------------------------------------------------------------------
export type TodayGoalType = {
	_id: string;
	today_record_number: number;
	today_record_dateType: string;
	today_record_dateStart: string;
	today_record_dateEnd: string;

	// 1. exercise
	today_exercise_record_dateType: string;
	today_exercise_record_dateStart: string;
	today_exercise_record_dateEnd: string;
	today_exercise_section: Array<{
		exercise_record_part: string;
		exercise_record_title: string;
		exercise_record_weight: string;
		exercise_record_set: string;
		exercise_record_rep: string;
		exercise_record_volume: string;
		exercise_record_cardio: string;
	}>;

	// 2. food
	today_food_record_dateType: string;
	today_food_record_dateStart: string;
	today_food_record_dateEnd: string;
	today_food_section: Array<{
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
	}>;

	// 3. money
	today_money_section: Array<{
		money_record_part: string;
		money_record_title: string;
		money_record_amount: string;
		money_record_content: string;
		money_record_include: string;
	}>;

	// 4. sleep
	today_sleep_section: Array<{
		sleep_record_bedTime: string;
		sleep_record_bedTime_color: string;
		sleep_record_wakeTime: string;
		sleep_record_wakeTime_color: string;
		sleep_record_sleepTime: string;
		sleep_record_sleepTime_color: string;
	}>;

	today_regDt: string;
	today_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const TodayGoal: TodayGoalType = {
	_id: "",
	today_record_number: 0,
	today_record_dateType: "",
	today_record_dateStart: "0000-00-00",
	today_record_dateEnd: "0000-00-00",

	// 1. exercise
	today_exercise_record_dateType: "",
	today_exercise_record_dateStart: "0000-00-00",
	today_exercise_record_dateEnd: "0000-00-00",
	today_exercise_section: [
		{
			exercise_record_part: "",
			exercise_record_title: "",
			exercise_record_weight: "0",
			exercise_record_set: "0",
			exercise_record_rep: "0",
			exercise_record_volume: "0",
			exercise_record_cardio: "00:00",
		}
	],

	// 2. food
	today_food_record_dateType: "",
	today_food_record_dateStart: "0000-00-00",
	today_food_record_dateEnd: "0000-00-00",
	today_food_section: [
		{
			food_record_part: "",
			food_record_name: "",
			food_record_brand: "",
			food_record_count: "0",
			food_record_serv: "serv",
			food_record_gram: "0",
			food_record_kcal: "0",
			food_record_carb: "0",
			food_record_protein: "0",
			food_record_fat: "0",
		}
	],

	// 3. money
	today_money_section: [
		{
			money_record_part: "",
			money_record_title: "",
			money_record_amount: "0",
			money_record_content: "",
			money_record_include: "Y",
		}
	],

	// 4. sleep
	today_sleep_section: [
		{
			sleep_record_bedTime: "00:00",
			sleep_record_bedTime_color: "",
			sleep_record_wakeTime: "00:00",
			sleep_record_wakeTime_color: "",
			sleep_record_sleepTime: "00:00",
			sleep_record_sleepTime_color: "",
		}
	],

	today_regDt: "",
	today_updateDt: "",
};