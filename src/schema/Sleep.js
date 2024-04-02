// Sleep.js

import mongoose from "mongoose";
import moment from "moment-timezone";

// 1. section ------------------------------------------------------------------------------------->
const sectionSchema = new mongoose.Schema({
  sleep_start: {
    type: String,
    required: false
  },
  sleep_end: {
    type: String,
    required: false
  },
  sleep_time: {
    type: String,
    required: false
  },
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
  sleep_day: {
    type: String,
    default: () => "default",
    required: true
  },
  sleep_real: sectionSchema,
  sleep_plan: sectionSchema,
  sleep_regdate: {
    type: String,
    default: () => moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss"),
    required: true,
  },
  sleep_update: {
    type: String,
    default: () => moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss"),
    required: true,
  }
});

// 5. model --------------------------------------------------------------------------------------->
export const Sleep = mongoose.model(
  "Sleep", schema
);