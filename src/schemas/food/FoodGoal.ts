// FoodGoal.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  food_goal_dummy: {
    type: String,
    default: "N",
    required: false
  },
  food_goal_number: {
    type : Number,
    default : 0,
    unique : true
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
});

// 3. counter --------------------------------------------------------------------------------------
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.food_goal_number = await incrementSeq("food_goal_number", "FoodGoal");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const FoodGoal = mongoose.model(
  "FoodGoal", schema, "foodGoal"
);