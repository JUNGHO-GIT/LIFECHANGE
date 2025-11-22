// FoodGoal.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 0. types ---------------------------------------------------------------------------------------
declare type FoodGoalType = mongoose.Document & {
  user_id: string;
  food_goal_number: number;
  food_goal_dateType: string;
  food_goal_dateStart: string;
  food_goal_dateEnd: string;
  food_goal_kcal: string;
  food_goal_carb: string;
  food_goal_protein: string;
  food_goal_fat: string;
  food_goal_regDt: Date;
  food_goal_updateDt: Date;
};

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  food_goal_number: {
    type: Number,
    default: 0,
    unique: true
  },
  food_goal_dateType: {
    type: String,
    default: "",
    required: false
  },
  food_goal_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  food_goal_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  food_goal_kcal: {
    type: String,
    default: "",
    required: false
  },
  food_goal_carb: {
    type: String,
    default: "",
    required: false
  },
  food_goal_protein: {
    type: String,
    default: "",
    required: false
  },
  food_goal_fat: {
    type: String,
    default: "",
    required: false
  },
  food_goal_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  food_goal_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
}, {
  collection: "foodGoal",
  timestamps: {
    createdAt: "food_goal_regDt",
    updatedAt: "food_goal_updateDt"
  }
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre<FoodGoalType>("save", async function() {
  if (this.isNew) {
    this.food_goal_number = await incrementSeq("food_goal_number", "foodGoal");
  }
});

// 5. model ----------------------------------------------------------------------------------------
export const FoodGoal = mongoose.model<FoodGoalType>("foodGoal", schema);