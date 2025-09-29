// ScheduleRecord.tsx

// Types ------------------------------------------------------------------------------------------
export type ScheduleRecordType = {
	_id: string;
	schedule_record_number: number;
	schedule_record_dateType: string;
	schedule_record_dateStart: string;
	schedule_record_dateEnd: string;

	// 1. exercise
	schedule_exercise_record_dateType: string;
	schedule_exercise_record_dateStart: string;
	schedule_exercise_record_dateEnd: string;
	schedule_exercise_section: Array<{
		exercise_record_part: string;
		exercise_record_title: string;
		exercise_record_weight: string;
		exercise_record_set: string;
		exercise_record_rep: string;
		exercise_record_volume: string;
		exercise_record_cardio: string;
	}>;

	// 2. food
	schedule_food_record_dateType: string;
	schedule_food_record_dateStart: string;
	schedule_food_record_dateEnd: string;
	schedule_food_section: Array<{
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
	schedule_money_section: Array<{
		money_record_part: string;
		money_record_title: string;
		money_record_amount: string;
		money_record_content: string;
		money_record_include: string;
	}>;

	// 4. sleep
	schedule_sleep_section: Array<{
		sleep_record_bedTime: string;
		sleep_record_bedTime_color: string;
		sleep_record_wakeTime: string;
		sleep_record_wakeTime_color: string;
		sleep_record_sleepTime: string;
		sleep_record_sleepTime_color: string;
	}>;

	schedule_regDt: string;
	schedule_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const ScheduleRecord: ScheduleRecordType = {
	_id: "",
	schedule_record_number: 0,
	schedule_record_dateType: "",
	schedule_record_dateStart: "0000-00-00",
	schedule_record_dateEnd: "0000-00-00",

	// 1. exercise
	schedule_exercise_record_dateType: "",
	schedule_exercise_record_dateStart: "0000-00-00",
	schedule_exercise_record_dateEnd: "0000-00-00",
	schedule_exercise_section: [
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
	schedule_food_record_dateType: "",
	schedule_food_record_dateStart: "0000-00-00",
	schedule_food_record_dateEnd: "0000-00-00",
	schedule_food_section: [
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
	schedule_money_section: [
		{
			money_record_part: "",
			money_record_title: "",
			money_record_amount: "0",
			money_record_content: "",
			money_record_include: "Y",
		}
	],

	// 4. sleep
	schedule_sleep_section: [
		{
			sleep_record_bedTime: "00:00",
			sleep_record_bedTime_color: "",
			sleep_record_wakeTime: "00:00",
			sleep_record_wakeTime_color: "",
			sleep_record_sleepTime: "00:00",
			sleep_record_sleepTime_color: "",
		}
	],

	schedule_regDt: "",
	schedule_updateDt: "",
};