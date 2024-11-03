// User.tsx

// -------------------------------------------------------------------------------------------------
export const User: any = {
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

// -------------------------------------------------------------------------------------------------
export const Category: any = {
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