// MoneyPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  money_plan_demo: {
    type: Boolean,
    default: false,
    required: false
  },
  money_plan_number: {
    type : Number,
    default : 0,
    unique : true
  },

  money_plan_startDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  money_plan_endDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  money_plan_in: {
    type: Number,
    default: 0,
    required: false
  },
  money_plan_out: {
    type: Number,
    default: 0,
    required: false
  },

  money_plan_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  money_plan_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.money_plan_number = await incrementSeq("money_plan_number", "MoneyPlan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const MoneyPlan = mongoose.model(
  "MoneyPlan", schema, "moneyPlan"
);