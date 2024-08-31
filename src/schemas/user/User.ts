// User.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";
import { calendarArray } from "@assets/arrays/calendarArray";
import { exerciseArray } from "@assets/arrays/exerciseArray";
import { moneyArray } from "@assets/arrays/moneyArray";
import { foodArray } from "@assets/arrays/foodArray";
import { sleepArray } from "@assets/arrays/sleepArray";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  user_google: {
    type: String,
    default: "N",
    required: false
  },
  user_token: {
    type: String,
    default: "",
    required: false
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

  user_image: {
    type : String,
    default: "",
    required : false
  },
  user_age: {
    type : String,
    default: "",
    required : false
  },
  user_gender: {
    type : String,
    default: "N",
    required : false
  },
  user_initScale: {
    type : String,
    default: "",
    required : false
  },
  user_curScale: {
    type : String,
    default: "",
    required : false
  },
  user_initProperty: {
    type : String,
    default: "",
    required : false
  },
  user_curProperty: {
    type : String,
    default: "",
    required : false
  },

  dataCategory: {
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
    type: Date,
    default: Date.now,
    required: false
  },
  user_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.user_number = await incrementSeq("user_number", "User");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const User = mongoose.model(
  "User", schema, "user"
);