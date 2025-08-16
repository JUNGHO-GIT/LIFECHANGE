// User.tsx

// Types ------------------------------------------------------------------------------------------
export type UserType = {
	_id: string;
	user_number: number;
	user_id: string;
	user_id_sended: boolean;
	user_verify_code: string;
	user_id_verified: boolean;
	user_pw: string;
	user_pw_verified: string;
	user_image: string;

	user_initScale: string;
	user_minScale: string;
	user_maxScale: string;
	user_curScale: string;

	user_initAvgKcalIntake: string;
	user_totalKcalIntake: string;
	user_totalCarbIntake: string;
	user_totalProteinIntake: string;
	user_totalFatIntake: string;
	user_curAvgKcalIntake: string;
	user_curAvgCarbIntake: string;
	user_curAvgProteinIntake: string;
	user_curAvgFatIntake: string;

	user_initProperty: string;
	user_totalIncomeAll: string;
	user_totalIncomeExclusion: string;
	user_totalExpenseAll: string;
	user_totalExpenseExclusion: string;
	user_curPropertyAll: string;
	user_curPropertyExclusion: string;

	user_favorite: Array<{
		food_key: string,
		food_name: string;
		food_brand: string;
		food_kcal: string;
		food_carb: string;
		food_protein: string;
		food_fat: string;
	}>;

	user_dataCategory: {
		calendar: Array<{ calendar_part: string }>;
		exercise: Array<{ exercise_part: string; exercise_title: Array<string> }>;
		food: Array<{ food_part: string }>;
		money: Array<{ money_part: string; money_title: Array<string> }>;
		sleep: Array<{ sleep_part: string }>;
	};

	user_regDt: string;
	user_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const User: UserType = {
  _id: "",
  user_number: 0,
  user_id: "",
  user_id_sended: false,
  user_verify_code: "",
  user_id_verified: false,
  user_pw: "",
  user_pw_verified: "",
  user_image: "",

  user_initScale: "",
  user_minScale: "",
  user_maxScale: "",
  user_curScale: "",

  user_initAvgKcalIntake: "",
  user_totalKcalIntake: "",
  user_totalCarbIntake: "",
  user_totalProteinIntake: "",
  user_totalFatIntake: "",
  user_curAvgKcalIntake: "",
  user_curAvgCarbIntake: "",
  user_curAvgProteinIntake: "",
  user_curAvgFatIntake: "",

  user_initProperty: "",
  user_totalIncomeAll: "",
  user_totalIncomeExclusion: "",
  user_totalExpenseAll: "",
  user_totalExpenseExclusion: "",
  user_curPropertyAll: "",
  user_curPropertyExclusion: "",

  user_favorite: [{
    food_key: "",
    food_name: "",
    food_brand: "",
    food_kcal: "",
    food_carb: "",
    food_protein: "",
    food_fat: "",
  }],

  user_dataCategory: {
    calendar: [],
    exercise: [],
    food: [],
    money: [],
    sleep: [],
  },

  user_regDt: "",
  user_updateDt: "",
};

// Types ------------------------------------------------------------------------------------------
export type CategoryType = {
  calendar: Array<{
    calendar_part: string;
    calendar_title?: string[];
  }>;
  exercise: Array<{
    exercise_part: string;
    exercise_title: string[];
  }>;
  food: Array<{
    food_part: string;
    food_title?: string[];
  }>;
  money: Array<{
    money_part: string;
    money_title: string[];
  }>;
  sleep: Array<{
    sleep_part: string;
    sleep_title?: string[];
  }>;
};

// Schema -----------------------------------------------------------------------------------------
export const Category: CategoryType = {
  calendar: [
    {
      calendar_part: ""
    }
  ],
  exercise: [
    {
      exercise_part: "",
      exercise_title: [""]
    }
  ],
  food: [
    {
      food_part: ""
    }
  ],
  money: [
    {
      money_part: "",
      money_title: [""]
    }
  ],
  sleep: [
    {
      sleep_part: ""
    }
  ]
};