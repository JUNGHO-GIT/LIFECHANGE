// Customer.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";
import {diaryArray} from "../assets/array/diaryArray.js";
import {exerciseArray} from "../assets/array/exerciseArray.js";
import {moneyArray} from "../assets/array/moneyArray.js";
import {foodArray} from "../assets/array/foodArray.js";
import {sleepArray} from "../assets/array/sleepArray.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  customer_id: {
    type: String,
    default: "",
    required: true
  },
  customer_pw : {
    type : String,
    default: "",
    required : false
  },
  customer_number : {
    type : Number,
    default: 0,
    unique : true
  },

  customer_sex: {
    type : String,
    default: "",
    required : false
  },
  customer_age: {
    type : String,
    default: "",
    required : false
  },
  customer_height: {
    type : String,
    default: "",
    required : false
  },
  customer_weight: {
    type : String,
    default: "",
    required : false
  },
  customer_email: {
    type : String,
    default: "",
    required : false
  },
  customer_phone: {
    type : String,
    default: "",
    required : false
  },
  customer_image: {
    type : String,
    default: "",
    required : false
  },

  customer_dataset: {
    diary: {
      type: Array,
      default: diaryArray,
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

  customer_regDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  },
  customer_updateDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.customer_number = await incrementSeq("customer_number", "Customer");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Customer = mongoose.model(
  "Customer", schema, "customer"
);