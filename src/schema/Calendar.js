// Calendar.js

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  calendar_number : {
    type : Number,
    unique : true
  },
  user_id : {
    type :String,
    required : true
  },

  // 2. components
  calendar_title : {
    type : String,
    required : true
  },
  calendar_content :{
    type : String,
    required : true
  },
  calendar_start : {
    type : String,
    required : true
  },
  calendar_end : {
    type : String,
    required : true
  },
  calendar_image : {
    type : String,
    required : false
  },

  // 3. date
  calendar_day : {
    type : String,
    default : () => {
      return "";
    },
    required : true
  },
  calendar_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");
    },
    required : true
  },
  calendar_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");
    },
    required : true
  }
});

// 2. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.calendar_number = await incrementSeq("calendar_number", "Calendar");
  }
  next();
});

// 3. model --------------------------------------------------------------------------------------->
export const Calendar = mongoose.model(
  "Calendar", schema
);