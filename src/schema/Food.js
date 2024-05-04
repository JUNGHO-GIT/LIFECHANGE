// Food.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  food_demo: {
    type: Boolean,
    default: false,
    required: false
  },
  food_number: {
    type: Number,
    default: 0,
    unique : true
  },

  food_startDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  food_endDt: {
    type: String,
    default: "0000-00-00",
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
    food_part_idx: {
      type: Number,
      default: 0,
      required: false
    },
    food_part_val: {
      type: String,
      default: "",
      required: false,
    },
    food_title : {
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

  food_regDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
    required: false
  },
  food_updateDt: {
    type: String,
    default: "0000-00-00 / 00:00:00",
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