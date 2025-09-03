// Sleep.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },

  sleep_number: {
    type: Number,
    default: 0,
    unique : true
  },

  sleep_dateType: {
    type: String,
    default: "",
    required: false
  },
  sleep_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  sleep_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  sleep_section: [{
    sleep_bedTime: {
      type: String,
      default: "00:00",
      required: false
    },
    sleep_wakeTime: {
      type: String,
      default: "00:00",
      required: false
    },
    sleep_sleepTime: {
      type: String,
      default: "00:00",
      required: false
    }
  }],

  sleep_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  sleep_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.sleep_number = await incrementSeq("sleep_number", "Sleep");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const Sleep = mongoose.model(
  "Sleep", schema, "sleep"
);