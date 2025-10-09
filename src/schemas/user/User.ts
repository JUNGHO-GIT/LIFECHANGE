// User.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";
import { exerciseArray } from "@assets/arrays/ExerciseArray";
import { moneyArray } from "@assets/arrays/MoneyArray";
import { foodArray } from "@assets/arrays/FoodArray";
import { sleepArray } from "@assets/arrays/SleepArray";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  user_number : {
    type: Number,
    default: 0,
    unique : true
  },
  user_google: {
    type: String,
    default: "N",
    required: false
  },
  user_token: {
    type: String,
    default: "",
    required: false
  },
  user_pw : {
    type: String,
    default: "",
    required: false
  },
  user_image: {
    type: String,
    default: "",
    required: false
  },

  user_initScale: {
    type: String,
    default: "",
    required: false
  },
  user_minScale: {
    type: String,
    default: "",
    required: false
  },
  user_maxScale: {
    type: String,
    default: "",
    required: false
  },
  user_curScale: {
    type: String,
    default: "",
    required: false
  },

  user_initAvgKcalIntake: {
    type: String,
    default: "",
    required: false
  },
  user_totalKcalIntake: {
    type: String,
    default: "",
    required: false
  },
  user_totalCarbIntake: {
    type: String,
    default: "",
    required: false
  },
  user_totalProteinIntake: {
    type: String,
    default: "",
    required: false
  },
  user_totalFatIntake: {
    type: String,
    default: "",
    required: false
  },
  user_curAvgKcalIntake: {
    type: String,
    default: "",
    required: false
  },
  user_curAvgCarbIntake: {
    type: String,
    default: "",
    required: false
  },
  user_curAvgProteinIntake: {
    type: String,
    default: "",
    required: false
  },
  user_curAvgFatIntake: {
    type: String,
    default: "",
    required: false
  },

  user_initProperty: {
    type: String,
    default: "",
    required: false
  },
  user_totalIncomeAll: {
    type: String,
    default: "",
    required: false
  },
  user_totalIncomeExclusion: {
    type: String,
    default: "",
    required: false
  },
  user_totalExpenseAll: {
    type: String,
    default: "",
    required: false
  },
  user_totalExpenseExclusion: {
    type: String,
    default: "",
    required: false
  },
  user_curPropertyAll: {
    type: String,
    default: "",
    required: false
  },
  user_curPropertyExclusion: {
    type: String,
    default: "",
    required: false
  },

  user_favorite: [{
    food_record_key : {
      type: String,
      default: "",
      required: false
    },
    food_record_name : {
      type: String,
      default: "",
      required: false,
    },
    food_record_brand : {
      type: String,
      default: "",
      required: false
    },
    food_record_count : {
      type: String,
      default: "",
      required: false
    },
    food_record_serv : {
      type: String,
      default: "",
      required: false
    },
    food_record_gram : {
      type: String,
      default: "",
      required: false
    },
    food_record_kcal : {
      type: String,
      default: "",
      required: false
    },
    food_record_carb : {
      type: String,
      default: "",
      required: false
    },
    food_record_protein : {
      type: String,
      default: "",
      required: false
    },
    food_record_fat : {
      type: String,
      default: "",
      required: false
    },
  }],

  user_dataCategory: {
    exercise: {
      type: Array,
      default: exerciseArray,
      required: false
    },
    food: {
      type: Array,
      default: foodArray,
      required: false
    },
    money: {
      type: Array,
      default: moneyArray,
      required: false
    },
    sleep: {
      type: Array,
      default: sleepArray,
      required: false
    }
  },

  user_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  user_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.user_number = await incrementSeq("user_number", "User");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const User = mongoose.model(
  "User", schema, "user"
);