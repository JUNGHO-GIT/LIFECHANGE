// ExerciseRecord.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  exercise_record_number: {
    type: Number,
    default: 0,
    unique : true
  },

  exercise_record_dateType : {
    type: String,
    default: "",
    required: false
  },
  exercise_record_dateStart : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  exercise_record_dateEnd : {
    type: String,
    default: "0000-00-00",
    required: false
  },

  exercise_record_total_volume: {
    type: String,
    default: "",
    required: false
  },
  exercise_record_total_cardio: {
    type: String,
    default: "00:00",
    required: false,
  },
  exercise_record_total_scale: {
    type: String,
    default: "",
    required: false
  },

  exercise_section: [{
    exercise_record_part : {
      type: String,
      default: "",
      required: false,
    },
    exercise_record_title : {
      type: String,
      default: "",
      required: false,
    },
    exercise_record_weight: {
      type: String,
      default: "",
      required: false,
    },
    exercise_record_set: {
      type: String,
      default: "",
      required: false,
    },
    exercise_record_rep: {
      type: String,
      default: "",
      required: false,
    },
    exercise_record_volume: {
      type: String,
      default: "",
      required: false
    },
    exercise_record_cardio: {
      type: String,
      default: "00:00",
      required: false,
    },
  }],

  exercise_record_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  exercise_record_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.exercise_record_number = await incrementSeq("exercise_record_number", "ExerciseRecord");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const ExerciseRecord = mongoose.model(
  "ExerciseRecord", schema, "exerciseRecord"
);