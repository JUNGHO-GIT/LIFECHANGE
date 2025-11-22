// MoneyGoal.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 0. types ---------------------------------------------------------------------------------------
declare type MoneyGoalType = mongoose.Document & {
  user_id: string;
  money_goal_number: number;
  money_goal_dateType: string;
  money_goal_dateStart: string;
  money_goal_dateEnd: string;
  money_goal_income: string;
  money_goal_expense: string;
  money_goal_regDt: Date;
  money_goal_updateDt: Date;
};

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      default: "",
      required: true
    },
    money_goal_number: {
      type: Number,
      default: 0,
      unique: true
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
      type: String,
      default: "",
      required: false
    },
    money_goal_expense: {
      type: String,
      default: "",
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
  },
  {
    collection: "MoneyGoal",
    timestamps: {
      createdAt: "money_goal_regDt",
      updatedAt: "money_goal_updateDt"
    },
  }
);

// 3. counter --------------------------------------------------------------------------------------
schema.pre<MoneyGoalType>("save", async function() {
  if (this.isNew) {
    this.money_goal_number = await incrementSeq("money_goal_number", "MoneyGoal");
  }
});

// 5. model ----------------------------------------------------------------------------------------
export const MoneyGoal = mongoose.model<MoneyGoalType>("MoneyGoal", schema);