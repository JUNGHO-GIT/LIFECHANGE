/**
 * @file ExerciseRecord.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 0. types ---------------------------------------------------------------------------------------
declare interface ExerciseRecordSection {
  exercise_record_part: string;
  exercise_record_title: string;
  exercise_record_weight: string;
  exercise_record_set: string;
  exercise_record_rep: string;
  exercise_record_volume: string;
  exercise_record_cardio: string;
}
declare interface ExerciseRecordType extends mongoose.Document {
  user_id: string;
  exercise_record_number: number;
  exercise_record_dateType: string;
  exercise_record_dateStart: string;
  exercise_record_dateEnd: string;
  exercise_record_total_volume: string;
  exercise_record_total_cardio: string;
  exercise_record_total_scale: string;
  exercise_section: ExerciseRecordSection[];
  exercise_record_regDt: Date;
  exercise_record_updateDt: Date;
}

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: ``,
    required: true,
  },
  exercise_record_number: {
    type: Number,
    default: 0,
    unique: true,
  },
  exercise_record_dateType: {
    type: String,
    default: ``,
    required: false,
  },
  exercise_record_dateStart: {
    type: String,
    default: `0000-00-00`,
    required: false,
  },
  exercise_record_dateEnd: {
    type: String,
    default: `0000-00-00`,
    required: false,
  },
  exercise_record_total_volume: {
    type: String,
    default: ``,
    required: false,
  },
  exercise_record_total_cardio: {
    type: String,
    default: `00:00`,
    required: false,
  },
  exercise_record_total_scale: {
    type: String,
    default: ``,
    required: false,
  },
  exercise_section: [
    {
      exercise_record_part: {
        type: String,
        default: ``,
        required: false,
      },
      exercise_record_title: {
        type: String,
        default: ``,
        required: false,
      },
      exercise_record_weight: {
        type: String,
        default: ``,
        required: false,
      },
      exercise_record_set: {
        type: String,
        default: ``,
        required: false,
      },
      exercise_record_rep: {
        type: String,
        default: ``,
        required: false,
      },
      exercise_record_volume: {
        type: String,
        default: ``,
        required: false,
      },
      exercise_record_cardio: {
        type: String,
        default: `00:00`,
        required: false,
      },
    },
  ],
  exercise_record_regDt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  exercise_record_updateDt: {
    type: Date,
    default: Date.now,
    required: false,
  },
}, {
  collection: `ExerciseRecord`,
  timestamps: {
    createdAt: `exercise_record_regDt`,
    updatedAt: `exercise_record_updateDt`,
  },
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre<ExerciseRecordType>(`save`, async function() {
  if (this.isNew) {
    this.exercise_record_number = await incrementSeq(`exercise_record_number`, `ExerciseRecord`);
  }
});

// 5. model ----------------------------------------------------------------------------------------
export const ExerciseRecord = mongoose.model<ExerciseRecordType>(`ExerciseRecord`, schema);
