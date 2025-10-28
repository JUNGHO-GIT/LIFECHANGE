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
	user_google?: string;
	user_token?: string;
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
		food_record_key: string;
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

	user_dataCategory: {
		exercise: Array<{ exercise_record_part: string; exercise_record_title: Array<string> }>;
		food: Array<{ food_record_part: string; food_record_title?: Array<string> }>;
		money: Array<{ money_record_part: string; money_record_title: Array<string> }>;
		sleep: Array<{ sleep_record_part: string }>;
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
    food_record_key: "",
    food_record_name: "",
    food_record_brand: "",
    food_record_count: "",
    food_record_serv: "",
    food_record_gram: "",
    food_record_kcal: "",
    food_record_carb: "",
    food_record_protein: "",
    food_record_fat: "",
  }],

  user_dataCategory: {
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
  exercise: Array<{
    exercise_record_part: string;
    exercise_record_title: string[];
  }>;
  food: Array<{
    food_record_part: string;
    food_record_title?: string[];
  }>;
  money: Array<{
    money_record_part: string;
    money_record_title: string[];
  }>;
  sleep: Array<{
    sleep_record_part: string;
    sleep_record_title?: string[];
  }>;
};

// Schema -----------------------------------------------------------------------------------------
export const Category: CategoryType = {
  exercise: [
    {
      exercise_record_part: "",
      exercise_record_title: [""]
    }
  ],
  food: [
    {
      food_record_part: "",
			food_record_title: [""]
    }
  ],
  money: [
    {
      money_record_part: "",
      money_record_title: [""]
    }
  ],
  sleep: [
    {
      sleep_record_part: ""
    }
  ]
};