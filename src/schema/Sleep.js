// Sleep.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. section ------------------------------------------------------------------------------------->
const sectionSchema = new mongoose.Schema({
  sleep_section: [{
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
    }
  }]
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
  sleep_number: {
    type : Number,
    unique : true
  },
  sleep_day: {
    type: String,
    default: () => "default",
    required: true
  },
  sleep_plan: sectionSchema,
  sleep_real: sectionSchema,
  sleep_regdate: {
    type: String,
    default: () => "default",
    required: true,
  },
  sleep_update: {
    type: String,
    default: () => "default",
    required: true,
  }
});

// 3. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.sleep_number = await incrementSeq("sleep_number", "Sleep");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Sleep = mongoose.model(
  "Sleep", schema
);