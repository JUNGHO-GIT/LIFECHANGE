// User.js

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  user_number : {
    type : Number,
    unique : true
  },
  user_pw : {
    type : String,
    required : false
  },

  user_email: {
    type : String,
    required : false
  },
  user_phone: {
    type : String,
    required : false
  },

  user_sex: {
    type : String,
    required : false
  },
  user_age: {
    type : String,
    required : false
  },
  user_height: {
    type : String,
    required : false
  },
  user_weight: {
    type : String,
    required : false
  },

  user_regdate: {
    type: String,
    required: false
  },
  user_update: {
    type: String,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.user_number = await incrementSeq("user_number", "User");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const User = mongoose.model(
  "User", schema
);