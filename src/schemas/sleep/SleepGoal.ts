// SleepGoal.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 0. types ---------------------------------------------------------------------------------------
declare type SleepGoalType = mongoose.Document & {
  user_id: string;
  sleep_goal_number: number;
  sleep_goal_dateType: string;
  sleep_goal_dateStart: string;
  sleep_goal_dateEnd: string;
  sleep_goal_bedTime: string;
  sleep_goal_wakeTime: string;
  sleep_goal_sleepTime: string;
  sleep_goal_regDt: Date;
  sleep_goal_updateDt: Date;
};

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      default: "",
      required: true
    },
    sleep_goal_number: {
      type: Number,
      default: 0,
      unique: true
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
  },
  {
    collection: "SleepGoal",
    timestamps: {
      createdAt: "sleep_goal_regDt",
      updatedAt: "sleep_goal_updateDt"
    }
  }
);

// 3. counter --------------------------------------------------------------------------------------
schema.pre<SleepGoalType>("save", async function() {
  if (this.isNew) {
    this.sleep_goal_number = await incrementSeq("sleep_goal_number", "SleepGoal");
  }
});

// 5. model ----------------------------------------------------------------------------------------
export const SleepGoal = mongoose.model<SleepGoalType>("SleepGoal", schema);