// Sleep.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  sleep_number: {
    type : Number,
    unique : true
  },

  sleep_startDt: {
    type: String,
    required: false
  },
  sleep_endDt: {
    type: String,
    required: false
  },

  sleep_section: [{
    sleep_night: {
      type: String,
      required: false
    },
    sleep_morning: {
      type: String,
      required: false
    },
    sleep_time: {
      type: String,
      required: false
    }
  }],

  sleep_regdate: {
    type: String,
    required: false
  },
  sleep_update: {
    type: String,
    required: false
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
  "Sleep", schema, "sleep"
);