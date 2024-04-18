// WorkPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "./CounterPlan.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  work_plan_number: {
    type : Number,
    default: 0,
    unique : true
  },

  work_plan_startDt: {
    type: String,
    default: "",
    required: false
  },
  work_plan_endDt: {
    type: String,
    default: "",
    required: false
  },

  work_plan_count: {
    type: Number,
    default: 0,
    required: false
  },
  work_plan_volume: {
    type: Number,
    default: 0,
    required: false
  },
  work_plan_cardio: {
    type: String,
    default: "",
    required: false
  },
  work_plan_weight: {
    type: Number,
    default: 0,
    required: false
  },

  work_plan_regDt: {
    type: String,
    default: "",
    required: false
  },
  work_plan_updateDt: {
    type: String,
    default: "",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.work_plan_number = await incrementSeq("work_plan_number", "WorkPlan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const WorkPlan = mongoose.model(
  "WorkPlan", schema, "workPlan"
);