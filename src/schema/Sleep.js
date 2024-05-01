// Sleep.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  customer_id: {
    type: String,
    default: "",
    required: true
  },
  sleep_demo: {
    type: Boolean,
    default: false,
    required: false
  },
  sleep_number: {
    type : Number,
    default : 0,
    unique : true
  },

  sleep_startDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  sleep_endDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  sleep_section: [{
    sleep_night: {
      type: String,
      default: "00:00",
      required: false
    },
    sleep_morning: {
      type: String,
      default: "00:00",
      required: false
    },
    sleep_time: {
      type: String,
      default: "00:00",
      required: false
    }
  }],

  sleep_regDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  },
  sleep_updateDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.sleep_number = await incrementSeq("sleep_number", "Sleep");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Sleep = mongoose.model(
  "Sleep", schema, "sleep"
);