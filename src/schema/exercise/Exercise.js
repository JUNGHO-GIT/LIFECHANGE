// Exercise.js

import mongoose from "mongoose";
import { incrementSeq } from "../Counter.js";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  exercise_dummy: {
    type: String,
    default: "N",
    required: false
  },
  exercise_number: {
    type : Number,
    default: 0,
    unique : true
  },

  exercise_dateType : {
    type: String,
    default: "",
    required: false
  },
  exercise_dateStart : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  exercise_dateEnd : {
    type: String,
    default: "0000-00-00",
    required: false
  },

  exercise_total_volume: {
    type: String,
    default: "",
    required: false
  },
  exercise_total_cardio: {
    type: String,
    default: "00:00",
    required: false,
  },
  exercise_total_weight: {
    type: String,
    default: "",
    required: false
  },

  exercise_section: [{
    exercise_part_idx : {
      type: Number,
      default: 0,
      required: false,
    },
    exercise_part_val : {
      type: String,
      default: "",
      required: false,
    },
    exercise_title_idx : {
      type: Number,
      default: 0,
      required: false,
    },
    exercise_title_val : {
      type: String,
      default: "",
      required: false,
    },
    exercise_kg: {
      type: String,
      default: "",
      required: false,
    },
    exercise_set: {
      type: String,
      default: "",
      required: false,
    },
    exercise_rep: {
      type: String,
      default: "",
      required: false,
    },
    exercise_volume: {
      type: String,
      default: "",
      required: false
    },
    exercise_cardio: {
      type: String,
      default: "00:00",
      required: false,
    },
  }],

  exercise_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  exercise_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.exercise_number = await incrementSeq("exercise_number", "Exercise");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const Exercise = mongoose.model(
  "Exercise", schema, "exercise"
);