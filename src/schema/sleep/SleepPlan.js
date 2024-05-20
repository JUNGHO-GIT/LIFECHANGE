// SleepPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "../Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  sleep_plan_demo: {
    type: Boolean,
    default: false,
    required: false
  },
  sleep_plan_number: {
    type : Number,
    default : 0,
    unique : true
  },

  sleep_plan_dateType: {
    type: String,
    default: "",
    required: false
  },
  sleep_plan_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  sleep_plan_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  sleep_plan_night: {
    type: String,
    default: "00:00",
    required: false
  },
  sleep_plan_morning: {
    type: String,
    default: "00:00",
    required: false
  },
  sleep_plan_time: {
    type: String,
    default: "00:00",
    required: false
  },

  sleep_plan_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  sleep_plan_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.sleep_plan_number = await incrementSeq("sleep_plan_number", "SleepPlan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const SleepPlan = mongoose.model(
  "SleepPlan", schema, "sleepPlan"
);