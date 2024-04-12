// MoneyPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "./CounterPlan.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  money_plan_number: {
    type : Number,
    unique : true
  },
  money_plan_start: {
    type: String,
    required: false
  },
  money_plan_end: {
    type: String,
    required: false
  },

  money_plan_in: {
    type: String,
    required: false
  },
  money_plan_out: {
    type: String,
    required: false
  },

  money_plan_regdate: {
    type: String,
    required: false
  },
  money_plan_update: {
    type: String,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
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