// Routine.js

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },
  routine_title : {
    type : String,
    required : true
  },
  routine_kg : {
    type : String,
    required : true
  },
  routine_set : {
    type : String,
    required : true
  },
  routine_count : {
    type : String,
    required : true
  },
  routine_rest : {
    type : String,
    required : true
  },
  routine_time : {
    type : String,
    required : true
  },
  routine_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required : true
  },
  routine_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required : true
  }
});

// 2. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.routine_number = await incrementSeq("routine_number", "Routine");
  }
  next();
});

// 3. model --------------------------------------------------------------------------------------->
export const Routine = mongoose.model(
  "Routine", schema
);