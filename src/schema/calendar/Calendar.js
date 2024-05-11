// Calendar.js

import mongoose from "mongoose";
import {incrementSeq} from "../Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  calendar_number: {
    type : Number,
    default: 0,
    unique : true
  },

  calendar_startDt : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_endDt : {
    type: String,
    default: "0000-00-00",
    required: false
  },

  calendar_section: [{
    calendar_part_idx : {
      type : Number,
      default : 0,
      required : false
    },
    calendar_part_val : {
      type : String,
      default : "",
      required : false
    },
    calendar_title : {
      type : String,
      default : "",
      required : false
    },
    calendar_color: {
      type : String,
      default: "",
      required : false
    },
    calendar_detail: {
      type : String,
      default: "",
      required : false
    }
  }],

  calendar_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  calendar_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.calendar_number = await incrementSeq("calendar_number", "Calendar");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Calendar = mongoose.model(
  "Calendar", schema, "calendar"
);