// Calendar.tsx

// -------------------------------------------------------------------------------------------------
export const Calendar: any = {
  _id: "",
  calendar_number: 0,
	calendar_dateType: "",
	calendar_dateStart: "0000-00-00",
	calendar_dateEnd: "0000-00-00",

	// 1. exercise
	calendar_exercise_dateType: "",
	calendar_exercise_dateStart: "0000-00-00",
	calendar_exercise_dateEnd: "0000-00-00",
	calendar_exercise_section: [
		{
			exercise_part: "",
			exercise_title: "",
			exercise_weight: "0",
			exercise_set: "0",
			exercise_rep: "0",
			exercise_volume: "0",
			exercise_cardio: "00:00",
		}
	],

	// 2. food
	calendar_food_dateType: "",
	calendar_food_dateStart: "0000-00-00",
	calendar_food_dateEnd: "0000-00-00",
	calendar_food_section: [
		{
			food_part: "",
			food_name: "",
			food_brand: "",
			food_count: "0",
			food_serv: "회",
			food_gram: "0",
			food_kcal: "0",
			food_carb: "0",
			food_protein: "0",
			food_fat: "0",
		}
	],

	// 3. money
	calendar_money_section: [
		{
			money_part: "",
			money_title: "",
			money_amount: "0",
			money_content: "",
			money_include: "Y",
		}
	],

	// 4. sleep
	calendar_sleep_section: [
		{
			sleep_bedTime: "00:00",
			sleep_bedTime_color: "",
			sleep_wakeTime: "00:00",
			sleep_wakeTime_color: "",
			sleep_sleepTime: "00:00",
			sleep_sleepTime_color: "",
		}
	],

	calendar_regDt: "",
	calendar_updateDt: "",
};