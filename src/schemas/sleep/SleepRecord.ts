// SleepRecord.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },

  sleep_record_number: {
    type: Number,
    default: 0,
    unique : true
  },

  sleep_record_dateType: {
    type: String,
    default: "",
    required: false
  },
  sleep_record_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  sleep_record_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  sleep_section: [{
    sleep_record_bedTime: {
      type: String,
      default: "00:00",
      required: false
    },
    sleep_record_wakeTime: {
      type: String,
      default: "00:00",
      required: false
    },
    sleep_record_sleepTime: {
      type: String,
      default: "00:00",
      required: false
    }
  }],

  sleep_record_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  sleep_record_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.sleep_record_number = await incrementSeq("sleep_record_number", "SleepRecord");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const SleepRecord = mongoose.model(
  "SleepRecord", schema, "sleepRecord"
);