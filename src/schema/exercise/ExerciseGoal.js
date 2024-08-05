// ExerciseGoal.js

import mongoose from "mongoose";
import {incrementSeq} from "../Counter.js";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  exercise_goal_dummy: {
    type: String,
    default: "N",
    required: false
  },
  exercise_goal_number: {
    type : Number,
    default: 0,
    unique : true
  },

  exercise_goal_dateType: {
    type: String,
    default: "",
    required: false
  },
  exercise_goal_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  exercise_goal_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  exercise_goal_count: {
    type: String,
    default: "",
    required: false
  },
  exercise_goal_volume: {
    type: String,
    default: "",
    required: false
  },
  exercise_goal_cardio: {
    type: String,
    default: "00:00",
    required: false
  },
  exercise_goal_weight: {
    type: String,
    default: "",
    required: false
  },

  exercise_goal_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  exercise_goal_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.exercise_goal_number = await incrementSeq("exercise_goal_number", "ExerciseGoal");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const ExerciseGoal = mongoose.model(
  "ExerciseGoal", schema, "exerciseGoal"
);