// SleepGoal.js

import mongoose from "mongoose";
import {incrementSeq} from "../Counter.js";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  sleep_goal_dummy: {
    type: String,
    default: "N",
    required: false
  },
  sleep_goal_number: {
    type : Number,
    default : 0,
    unique : true
  },

  sleep_goal_dateType: {
    type: String,
    default: "",
    required: false
  },
  sleep_goal_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  sleep_goal_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  sleep_goal_bedTime: {
    type: String,
    default: "00:00",
    required: false
  },
  sleep_goal_wakeTime: {
    type: String,
    default: "00:00",
    required: false
  },
  sleep_goal_sleepTime: {
    type: String,
    default: "00:00",
    required: false
  },

  sleep_goal_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  sleep_goal_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.sleep_goal_number = await incrementSeq("sleep_goal_number", "SleepGoal");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const SleepGoal = mongoose.model(
  "SleepGoal", schema, "sleepGoal"
);