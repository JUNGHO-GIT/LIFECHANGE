/**
 * @file User.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";
import { exerciseArray } from "@assets/arrays/exerciseArray";
import { moneyArray } from "@assets/arrays/moneyArray";
import { foodArray } from "@assets/arrays/foodArray";
import { sleepArray } from "@assets/arrays/sleepArray";

// 0. types ---------------------------------------------------------------------------------------
declare interface UserFavoriteItem {
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
}
declare interface UserType extends mongoose.Document {
  user_id: string;
  user_number: number;
  user_google: string;
  user_token: string;
  user_pw: string;
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
  user_favorite: UserFavoriteItem[];
  user_dataCategory: any;
  user_regDt: Date;
  user_updateDt: Date;
}

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: ``,
    required: true,
  },
  user_number: {
    type: Number,
    default: 0,
    unique: true,
  },
  user_google: {
    type: String,
    default: `N`,
    required: false,
  },
  user_token: {
    type: String,
    default: ``,
    required: false,
  },
  user_pw: {
    type: String,
    default: ``,
    required: false,
  },
  user_image: {
    type: String,
    default: ``,
    required: false,
  },

  user_initScale: {
    type: String,
    default: ``,
    required: false,
  },
  user_minScale: {
    type: String,
    default: ``,
    required: false,
  },
  user_maxScale: {
    type: String,
    default: ``,
    required: false,
  },
  user_curScale: {
    type: String,
    default: ``,
    required: false,
  },

  user_initAvgKcalIntake: {
    type: String,
    default: ``,
    required: false,
  },
  user_totalKcalIntake: {
    type: String,
    default: ``,
    required: false,
  },
  user_totalCarbIntake: {
    type: String,
    default: ``,
    required: false,
  },
  user_totalProteinIntake: {
    type: String,
    default: ``,
    required: false,
  },
  user_totalFatIntake: {
    type: String,
    default: ``,
    required: false,
  },
  user_curAvgKcalIntake: {
    type: String,
    default: ``,
    required: false,
  },
  user_curAvgCarbIntake: {
    type: String,
    default: ``,
    required: false,
  },
  user_curAvgProteinIntake: {
    type: String,
    default: ``,
    required: false,
  },
  user_curAvgFatIntake: {
    type: String,
    default: ``,
    required: false,
  },

  user_initProperty: {
    type: String,
    default: ``,
    required: false,
  },
  user_totalIncomeAll: {
    type: String,
    default: ``,
    required: false,
  },
  user_totalIncomeExclusion: {
    type: String,
    default: ``,
    required: false,
  },
  user_totalExpenseAll: {
    type: String,
    default: ``,
    required: false,
  },
  user_totalExpenseExclusion: {
    type: String,
    default: ``,
    required: false,
  },
  user_curPropertyAll: {
    type: String,
    default: ``,
    required: false,
  },
  user_curPropertyExclusion: {
    type: String,
    default: ``,
    required: false,
  },

  user_favorite: [
    {
      food_record_key: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_name: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_brand: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_count: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_serv: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_gram: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_kcal: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_carb: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_protein: {
        type: String,
        default: ``,
        required: false,
      },
      food_record_fat: {
        type: String,
        default: ``,
        required: false,
      },
    },
  ],

  user_dataCategory: {
    exercise: {
      type: Array,
      default: exerciseArray,
      required: false,
    },
    food: {
      type: Array,
      default: foodArray,
      required: false,
    },
    money: {
      type: Array,
      default: moneyArray,
      required: false,
    },
    sleep: {
      type: Array,
      default: sleepArray,
      required: false,
    },
  },

  user_regDt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  user_updateDt: {
    type: Date,
    default: Date.now,
    required: false,
  },
}, {
  collection: `User`,
  timestamps: {
    createdAt: `user_regDt`,
    updatedAt: `user_updateDt`,
  },
});

// 2. index ---------------------------------------------------------------------------------------
schema.index({
  user_id: 1,
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre<UserType>(`save`, async function() {
  if (this.isNew) {
    this.user_number = await incrementSeq(`user_number`, `User`);
  }
});

// 5. model ----------------------------------------------------------------------------------------
export const User = mongoose.model<UserType>(`User`, schema);
