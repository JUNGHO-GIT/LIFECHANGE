// Work.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  work_number: {
    type : Number,
    default: 0,
    unique : true
  },

  work_startDt : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  work_endDt : {
    type: String,
    default: "0000-00-00",
    required: false
  },

  work_start: {
    type: String,
    default: "00:00",
    required: false,
  },
  work_end: {
    type: String,
    default: "00:00",
    required: false,
  },
  work_time: {
    type: String,
    default: "00:00",
    required: false,
  },

  work_total_volume: {
    type: Number,
    default: 0,
    required: false
  },
  work_total_cardio: {
    type: String,
    default: "00:00",
    required: false,
  },
  work_body_weight: {
    type: Number,
    default: 0,
    required: false
  },

  work_section: [{
    work_part_idx : {
      type: Number,
      default: 0,
      required: false,
    },
    work_part_val : {
      type: String,
      default: "",
      required: false,
    },
    work_title_idx : {
      type: Number,
      default: 0,
      required: false,
    },
    work_title_val : {
      type: String,
      default: "",
      required: false,
    },
    work_kg: {
      type: Number,
      default: 0,
      required: false,
    },
    work_set: {
      type: Number,
      default: 0,
      required: false,
    },
    work_rep: {
      type: Number,
      default: 0,
      required: false,
    },
    work_rest: {
      type: Number,
      default: 0,
      required: false,
    },
    work_volume: {
      type: Number,
      default: 0,
      required: false
    },
    work_cardio: {
      type: String,
      default: "00:00",
      required: false,
    },
  }],

  work_regDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  },
  work_updateDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.work_number = await incrementSeq("work_number", "Work");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Work = mongoose.model(
  "Work", schema, "work"
);