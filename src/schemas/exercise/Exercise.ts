// Exercise.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  exercise_number: {
    type: Number,
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
    default: "0000/00/00",
    required: false
  },
  exercise_dateEnd : {
    type: String,
    default: "0000/00/00",
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
  exercise_total_scale: {
    type: String,
    default: "",
    required: false
  },

  exercise_section: [{
    exercise_part : {
      type: String,
      default: "",
      required: false,
    },
    exercise_title : {
      type: String,
      default: "",
      required: false,
    },
    exercise_weight: {
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