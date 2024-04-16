// UserPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "./CounterPlan.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  user_plan_number: {
    type : Number,
    unique : true
  },
  user_plan_startDt: {
    type: String,
    default: "",
    required: false
  },
  user_plan_endDt: {
    type: String,
    default: "",
    required: false
  },
  user_plan_regdate: {
    type: String,
    default: "",
    required: false
  },
  user_plan_update: {
    type: String,
    default: "",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.user_plan_number = await incrementSeq("user_plan_number", "UserPlan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const UserPlan = mongoose.model(
  "UserPlan", schema, "userPlan"
);