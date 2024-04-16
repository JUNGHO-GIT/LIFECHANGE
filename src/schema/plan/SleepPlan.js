// SleepPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "./CounterPlan.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  sleep_plan_number: {
    type : Number,
    unique : true
  },

  sleep_plan_startDt: {
    type: String,
    default: "",
    required: false
  },
  sleep_plan_endDt: {
    type: String,
    default: "",
    required: false
  },

  sleep_plan_night: {
    type: String,
    default: "",
    required: false
  },
  sleep_plan_morning: {
    type: String,
    default: "",
    required: false
  },
  sleep_plan_time: {
    type: String,
    default: "",
    required: false
  },

  sleep_plan_regdate: {
    type: String,
    default: "",
    required: false
  },
  sleep_plan_update: {
    type: String,
    default: "",
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