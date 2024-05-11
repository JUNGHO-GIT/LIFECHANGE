// Exercise.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  exercise_demo: {
    type: Boolean,
    default: false,
    required: false
  },
  exercise_number: {
    type : Number,
    default: 0,
    unique : true
  },

  exercise_startDt : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  exercise_endDt : {
    type: String,
    default: "0000-00-00",
    required: false
  },

  exercise_total_volume: {
    type: Number,
    default: 0,
    required: false
  },
  exercise_total_cardio: {
    type: String,
    default: "00:00",
    required: false,
  },
  exercise_body_weight: {
    type: Number,
    default: 0,
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
      type: Number,
      default: 0,
      required: false,
    },
    exercise_set: {
      type: Number,
      default: 0,
      required: false,
    },
    exercise_rep: {
      type: Number,
      default: 0,
      required: false,
    },
    exercise_rest: {
      type: Number,
      default: 0,
      required: false,
    },
    exercise_volume: {
      type: Number,
      default: 0,
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

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.exercise_number = await incrementSeq("exercise_number", "Exercise");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Exercise = mongoose.model(
  "Exercise", schema, "exercise"
);