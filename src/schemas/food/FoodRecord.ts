// FoodRecord.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  food_record_number: {
    type: Number,
    default: 0,
    unique : true
  },

  food_record_dateType: {
    type: String,
    default: "",
    required: false
  },
  food_record_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  food_record_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  food_record_total_kcal: {
    type: String,
    default: "",
    required: false
  },
  food_record_total_carb: {
    type: String,
    default: "",
    required: false
  },
  food_record_total_protein: {
    type: String,
    default: "",
    required: false
  },
  food_record_total_fat: {
    type: String,
    default: "",
    required: false
  },

  food_section: [{
    food_record_part: {
      type: String,
      default: "",
      required: false,
    },
    food_record_name : {
      type: String,
      default: "",
      required: false,
    },
    food_record_brand : {
      type: String,
      default: "",
      required: false
    },
    food_record_count : {
      type: String,
      default: "",
      required: false
    },
    food_record_serv : {
      type: String,
      default: "",
      required: false
    },
    food_record_gram : {
      type: String,
      default: "",
      required: false
    },
    food_record_kcal : {
      type: String,
      default: "",
      required: false
    },
    food_record_carb : {
      type: String,
      default: "",
      required: false
    },
    food_record_protein : {
      type: String,
      default: "",
      required: false
    },
    food_record_fat : {
      type: String,
      default: "",
      required: false
    },
  }],

  food_record_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  food_record_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.food_record_number = await incrementSeq("food_record_number", "FoodRecord");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const FoodRecord = mongoose.model(
  "FoodRecord", schema, "foodRecord"
);