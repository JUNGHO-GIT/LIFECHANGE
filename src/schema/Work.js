// Work.js

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter.js";

// 1. section ------------------------------------------------------------------------------------->
const sectionSchema = new mongoose.Schema({
  work_start: {
    type: String,
    required: false,
  },
  work_end: {
    type: String,
    required: false,
  },
  work_time: {
    type: String,
    required: false,
  },
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
      required: false,
    },
    work_set: {
      type: Number,
      required: false,
    },
    work_count: {
      type: Number,
      required: false,
    },
    work_rest: {
      type: Number,
      required: false,
    },
  }],
});

// 2. main ---------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  _id: {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id: {
    type: String,
    required: true
  },
  work_number: {
    type : Number,
    unique : true
  },
  work_day: {
    type: String,
    default: () => "default",
    required: true
  },
  work_plan: sectionSchema,
  work_real: sectionSchema,
  work_regdate: {
    type: String,
    default: () => moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
    required: true,
  },
  work_update: {
    type: String,
    default: () => moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
    required: true,
  }
});

// 3. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.work_number = await incrementSeq("work_number", "Work");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Work = mongoose.model(
  "Work", schema
);