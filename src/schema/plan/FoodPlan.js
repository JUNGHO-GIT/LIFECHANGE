// FoodPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "./CounterPlan.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  food_plan_number: {
    type : Number,
    unique : true
  },

  food_plan_startDt: {
    type: String,
    required: false
  },
  food_plan_endDt: {
    type: String,
    required: false
  },

  food_plan_kcal: {
    type: Number,
    required: false
  },
  food_plan_carb: {
    type: Number,
    required: false
  },
  food_plan_protein: {
    type: Number,
    required: false
  },
  food_plan_fat: {
    type: Number,
    required: false
  },

  food_plan_regdate: {
    type: String,
    required: false
  },
  food_plan_update: {
    type: String,
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