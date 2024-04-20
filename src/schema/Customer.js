// Customer.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";
import {exerciseArray} from "../assets/data/ExerciseArray.js";
import {moneyArray} from "../assets/data/MoneyArray.js";
import {foodArray} from "../assets/data/FoodArray.js";
import {sleepArray} from "../assets/data/SleepArray.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  customer_id: {
    type: String,
    default: "",
    required: true
  },
  customer_number : {
    type : Number,
    default: 0,
    unique : true
  },
  customer_pw : {
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

  customer_dataset: {
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