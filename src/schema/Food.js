// Food.js

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  food_number : {
    type : Number,
    unique : true
  },
  user_id : {
    type  : String,
    required : true
  },

  // 2. components
  food_title : {
    type : String,
    required : true
  },
  food_brand : {
    type : String,
    required : true
  },
  food_category : {
    type : String,
    required : true
  },
  food_serving : {
    type : String,
    required : true
  },
  food_calories : {
    type : Number,
    required : true
  },
  food_carb : {
    type : Number,
    required : true
  },
  food_protein : {
    type : Number,
    required : true
  },
  food_fat : {
    type : Number,
    required : true
  },
  food_select : {
    type : String,
    default : "daily",
    required : false
  },

  // 3. components
  food_planYn : {
    type : String,
    default : "N",
    required : true
  },

  // 4. date
  food_day : {
    type : String,
    default : () => {
      return "";
    },
    required : true
  },
  food_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");
    },
    required : true
  },
  food_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");
    },
    required : true
  }
});

// 2. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.food_number = await incrementSeq("food_number", "Food");
  }
  next();
});

// 3. model --------------------------------------------------------------------------------------->
export const Food = mongoose.model(
  "Food", schema
);