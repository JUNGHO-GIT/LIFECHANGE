// ExercisePlan.js

import mongoose from "mongoose";
import {incrementSeq} from "../Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  exercise_plan_demo: {
    type: Boolean,
    default: false,
    required: false
  },
  exercise_plan_number: {
    type : Number,
    default: 0,
    unique : true
  },

  exercise_plan_startDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  exercise_plan_endDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  exercise_plan_count: {
    type: Number,
    default: 0,
    required: false
  },
  exercise_plan_volume: {
    type: Number,
    default: 0,
    required: false
  },
  exercise_plan_cardio: {
    type: String,
    default: "00:00",
    required: false
  },
  exercise_plan_weight: {
    type: Number,
    default: 0,
    required: false
  },

  exercise_plan_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  exercise_plan_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.exercise_plan_number = await incrementSeq("exercise_plan_number", "ExercisePlan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const ExercisePlan = mongoose.model(
  "ExercisePlan", schema, "exercisePlan"
);