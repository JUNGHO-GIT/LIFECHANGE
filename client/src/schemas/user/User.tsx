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
  user_age: "",
  user_image: "",

  user_initScale: "",
  user_curScale: "",

  user_foodFavorite: [{
    food_key: "",
    food_name: "",
    food_brand: "",
    food_kcal: "",
    food_carb: "",
    food_protein: "",
    food_fat: "",
  }],

  user_initProperty: "",
  user_curPropertyInclude: "",
  user_curPropertyExclude: "",

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

// -------------------------------------------------------------------------------------------------
export const AppInfo: any = {
  version: "",
  date: "",
  git: "",
  license: "",
};