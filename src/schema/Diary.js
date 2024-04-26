// Diary.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  customer_id: {
    type: String,
    default: "",
    required: true
  },
  diary_number: {
    type : Number,
    default: 0,
    unique : true
  },

  diary_startDt : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  diary_endDt : {
    type: String,
    default: "0000-00-00",
    required: false
  },

  diary_category: {
    type : String,
    default: "",
    unique : true
  },
  diary_color: {
    type : String,
    default: "",
    required : false
  },
  diary_detail: {
    type : String,
    default: "",
    required : false
  },

  diary_regDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  },
  diary_updateDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.diary_number = await incrementSeq("diary_number", "Diary");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Diary = mongoose.model(
  "Diary", schema, "diary"
);