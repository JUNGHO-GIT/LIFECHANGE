// Food.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({

  user_id: {
    type: String,
    required: true
  },
  food_number: {
    type : String,
    unique : true
  },

  food_startDt: {
    type: String,
    required: false
  },
  food_endDt: {
    type: String,
    required: false
  },
  food_total_kcal: {
    type: String,
    required: false
  },

  food_total_carb: {
    type: String,
    required: false
  },
  food_total_protein: {
    type: String,
    required: false
  },
  food_total_fat: {
    type: String,
    required: false
  },

  food_section: [{
    food_part_val: {
      type: String,
      required: false,
    },
    food_title_val: {
      type: String,
      required: false,
    },
    food_brand : {
      type : String,
      required : false
    },
    food_count : {
      type : String,
      required : false
    },
    food_serv : {
      type : String,
      required : false
    },
    food_gram : {
      type : String,
      required : false
    },
    food_kcal : {
      type : String,
      required : false
    },
    food_carb : {
      type : String,
      required : false
    },
    food_protein : {
      type : String,
      required : false
    },
    food_fat : {
      type : String,
      required : false
    },
  }],

  food_regdate: {
    type: String,
    required: false
  },
  food_update: {
    type: String,
    required: false
  }

});

// 3. counter ------------------------------------------------------------------------------------->
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