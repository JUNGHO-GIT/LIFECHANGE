// Food.js

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  food_number: {
    type : String,
    default : "",
    unique : true
  },

  food_startDt: {
    type: String,
    default: "",
    required: false
  },
  food_endDt: {
    type: String,
    default: "",
    required: false
  },

  food_total_kcal: {
    type: Number,
    default: 0,
    required: false
  },
  food_total_carb: {
    type: Number,
    default: 0,
    required: false
  },
  food_total_protein: {
    type: Number,
    default: 0,
    required: false
  },
  food_total_fat: {
    type: Number,
    default: 0,
    required: false
  },

  food_section: [{
    food_part_val: {
      type: String,
      default: "",
      required: false,
    },
    food_title_val: {
      type: String,
      default: "",
      required: false,
    },
    food_brand : {
      type : String,
      default : "",
      required : false
    },
    food_count : {
      type: Number,
      default: 0,
      required: false
    },
    food_serv : {
      type : String,
      default : "",
      required : false
    },
    food_gram : {
      type: Number,
      default: 0,
      required: false
    },
    food_kcal : {
      type: Number,
      default: 0,
      required: false
    },
    food_carb : {
      type: Number,
      default: 0,
      required: false
    },
    food_protein : {
      type: Number,
      default: 0,
      required: false
    },
    food_fat : {
      type: Number,
      default: 0,
      required: false
    },
  }],

  food_regdate: {
    type: String,
    default: "",
    required: false
  },
  food_update: {
    type: String,
    default: "",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.food_number = await incrementSeq("food_number", "Food");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Food = mongoose.model(
  "Food", schema, "food"
);