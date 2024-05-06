// User.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";
import {calendarArray} from "../assets/array/calendarArray.js";
import {exerciseArray} from "../assets/array/exerciseArray.js";
import {moneyArray} from "../assets/array/moneyArray.js";
import {foodArray} from "../assets/array/foodArray.js";
import {sleepArray} from "../assets/array/sleepArray.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  user_pw : {
    type : String,
    default: "",
    required : false
  },
  user_number : {
    type : Number,
    default: 0,
    unique : true
  },

  user_sex: {
    type : String,
    default: "",
    required : false
  },
  user_age: {
    type : String,
    default: "",
    required : false
  },
  user_height: {
    type : String,
    default: "",
    required : false
  },
  user_weight: {
    type : String,
    default: "",
    required : false
  },
  user_email: {
    type : String,
    default: "",
    required : false
  },
  user_phone: {
    type : String,
    default: "",
    required : false
  },
  user_image: {
    type : String,
    default: "",
    required : false
  },

  user_dataset: {
    calendar: {
      type: Array,
      default: calendarArray,
      required: false
    },
    exercise: {
      type: Array,
      default: exerciseArray,
      required: false
    },
    food: {
      type: Array,
      default: foodArray,
      required: false
    },
    money: {
      type: Array,
      default: moneyArray,
      required: false
    },
    sleep: {
      type: Array,
      default: sleepArray,
      required: false
    }
  },

  user_regDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  },
  user_updateDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
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