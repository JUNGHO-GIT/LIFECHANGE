// User.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";
import {workArray} from "../../assets/data/WorkArray.js";
import {moneyArray} from "../../assets/data/MoneyArray.js";

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

  user_dataset: {
    money: {
      type: Array,
      default: moneyArray,
      required: false
    },
    work: {
      type: Array,
      default: workArray,
      required: false
    }
  },

  user_regdate: {
    type: String,
    default: "",
    required: false
  },
  user_update: {
    type: String,
    default: "",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.user_number = await incrementSeq("user_number", "User");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const User = mongoose.model(
  "User", schema, "user"
);