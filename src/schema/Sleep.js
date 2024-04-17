// Sleep.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  sleep_number: {
    type : Number,
    default : 0,
    unique : true
  },

  sleep_startDt: {
    type: String,
    default: "",
    required: false
  },
  sleep_endDt: {
    type: String,
    default: "",
    required: false
  },

  sleep_section: [{
    sleep_night: {
      type: String,
      default: "",
      required: false
    },
    sleep_morning: {
      type: String,
      default: "",
      required: false
    },
    sleep_time: {
      type: String,
      default: "",
      required: false
    }
  }],

  sleep_regDt: {
    type: String,
    default: "",
    required: false
  },
  sleep_upDt: {
    type: String,
    default: "",
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