// MoneyGoal.js

import mongoose from "mongoose";
import {incrementSeq} from "../Counter.js";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  money_goal_dummy: {
    type: String,
    default: "N",
    required: false
  },
  money_goal_number: {
    type : Number,
    default : 0,
    unique : true
  },

  money_goal_dateType: {
    type: String,
    default: "",
    required: false
  },
  money_goal_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  money_goal_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  money_goal_income: {
    type: Number,
    default: 0,
    required: false
  },
  money_goal_expense: {
    type: Number,
    default: 0,
    required: false
  },

  money_goal_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  money_goal_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.money_goal_number = await incrementSeq("money_goal_number", "MoneyGoal");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const MoneyGoal = mongoose.model(
  "MoneyGoal", schema, "moneyGoal"
);