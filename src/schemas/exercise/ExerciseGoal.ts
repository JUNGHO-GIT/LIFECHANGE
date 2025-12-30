/**
 * @file ExerciseGoal.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 0. types ---------------------------------------------------------------------------------------
declare interface ExerciseGoalType extends mongoose.Document {
  user_id: string;
  exercise_goal_number: number;
  exercise_goal_dateType: string;
  exercise_goal_dateStart: string;
  exercise_goal_dateEnd: string;
  exercise_goal_count: string;
  exercise_goal_volume: string;
  exercise_goal_cardio: string;
  exercise_goal_scale: string;
  exercise_goal_regDt: Date;
  exercise_goal_updateDt: Date;
}

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: ``,
    required: true,
  },
  exercise_goal_number: {
    type: Number,
    default: 0,
    unique: true,
  },
  exercise_goal_dateType: {
    type: String,
    default: ``,
    required: false,
  },
  exercise_goal_dateStart: {
    type: String,
    default: `0000-00-00`,
    required: false,
  },
  exercise_goal_dateEnd: {
    type: String,
    default: `0000-00-00`,
    required: false,
  },
  exercise_goal_count: {
    type: String,
    default: ``,
    required: false,
  },
  exercise_goal_volume: {
    type: String,
    default: ``,
    required: false,
  },
  exercise_goal_cardio: {
    type: String,
    default: `00:00`,
    required: false,
  },
  exercise_goal_scale: {
    type: String,
    default: ``,
    required: false,
  },
  exercise_goal_regDt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  exercise_goal_updateDt: {
    type: Date,
    default: Date.now,
    required: false,
  },
}, {
  collection: `ExerciseGoal`,
  timestamps: {
    createdAt: `exercise_goal_regDt`,
    updatedAt: `exercise_goal_updateDt`,
  },
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre<ExerciseGoalType>(`save`, async function() {
  if (this.isNew) {
    this.exercise_goal_number = await incrementSeq(`exercise_goal_number`, `ExerciseGoal`);
  }
});

// 5. model ----------------------------------------------------------------------------------------
export const ExerciseGoal = mongoose.model<ExerciseGoalType>(`ExerciseGoal`, schema);
