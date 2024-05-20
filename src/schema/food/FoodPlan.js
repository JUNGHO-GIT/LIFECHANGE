// FoodPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "../Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  food_plan_demo: {
    type: Boolean,
    default: false,
    required: false
  },
  food_plan_number: {
    type : Number,
    default : 0,
    unique : true
  },

  food_plan_dateType: {
    type: String,
    default: "",
    required: false
  },
  food_plan_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  food_plan_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  food_plan_kcal: {
    type: Number,
    default: 0,
    required: false
  },
  food_plan_carb: {
    type: Number,
    default: 0,
    required: false
  },
  food_plan_protein: {
    type: Number,
    default: 0,
    required: false
  },
  food_plan_fat: {
    type: Number,
    default: 0,
    required: false
  },

  food_plan_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  food_plan_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.food_plan_number = await incrementSeq("food_plan_number", "FoodPlan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const FoodPlan = mongoose.model(
  "FoodPlan", schema, "foodPlan"
);