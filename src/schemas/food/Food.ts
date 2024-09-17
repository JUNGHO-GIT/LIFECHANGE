// Food.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  food_number: {
    type: Number,
    default: 0,
    unique : true
  },
  food_dummy: {
    type: String,
    default: "N",
    required: false
  },

  food_dateType: {
    type: String,
    default: "",
    required: false
  },
  food_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  food_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  food_total_kcal: {
    type: String,
    default: "",
    required: false
  },
  food_total_carb: {
    type: String,
    default: "",
    required: false
  },
  food_total_protein: {
    type: String,
    default: "",
    required: false
  },
  food_total_fat: {
    type: String,
    default: "",
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
    food_name : {
      type: String,
      default: "",
      required: false,
    },
    food_brand : {
      type: String,
      default: "",
      required: false
    },
    food_count : {
      type: String,
      default: "",
      required: false
    },
    food_serv : {
      type: String,
      default: "",
      required: false
    },
    food_gram : {
      type: String,
      default: "",
      required: false
    },
    food_kcal : {
      type: String,
      default: "",
      required: false
    },
    food_carb : {
      type: String,
      default: "",
      required: false
    },
    food_protein : {
      type: String,
      default: "",
      required: false
    },
    food_fat : {
      type: String,
      default: "",
      required: false
    },
  }],

  food_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  food_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.food_number = await incrementSeq("food_number", "Food");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const Food = mongoose.model(
  "Food", schema, "food"
);