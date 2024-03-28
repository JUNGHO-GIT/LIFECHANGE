// Work.js

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({

  // 1. id
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  work_number: {
    type: Number,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },

  // 2. section
  work_section: [{
    work_part_idx : {
      type: Number,
      required: false,
    },
    work_part_val : {
      type: String,
      required: true,
    },
    work_title_idx : {
      type: Number,
      required: false,
    },
    work_title_val : {
      type: String,
      required: true,
    },
    work_kg: {
      type: Number,
      required: true,
    },
    work_set: {
      type: Number,
      required: true,
    },
    work_count: {
      type: Number,
      required: true,
    },
    work_rest: {
      type: Number,
      required: true,
    },
  }],

  // 3. components
  work_start: {
    type: String,
    required: true,
  },
  work_end: {
    type: String,
    required: true,
  },
  work_time: {
    type: String,
    required: true,
  },
  work_planYn : {
    type : String,
    default : "N",
    required : true
  },

  // 4. date
  work_day: {
    type: String,
    default: () => {
      return "default";
    },
    required: true,
  },
  work_regdate: {
    type: String,
    default: () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required: true,
  },
  work_update: {
    type: String,
    default: () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required: true,
  },
});

// 2. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.work_number = await incrementSeq("work_number", "Work");
  }
  next();
});

// 3. model --------------------------------------------------------------------------------------->
export const Work = mongoose.model(
  "Work", schema
);