// Money.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  money_demo: {
    type: Boolean,
    default: false,
    required: false
  },
  money_number: {
    type : Number,
    default: 0,
    unique : true
  },

  money_startDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  money_endDt: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  money_total_in: {
    type: Number,
    default: 0,
    required: false
  },
  money_total_out: {
    type: Number,
    default: 0,
    required: false
  },
  money_property: {
    type: Number,
    default: 0,
    required: false
  },

  money_section: [{
    money_part_idx : {
      type : Number,
      default : 0,
      required : false
    },
    money_part_val : {
      type : String,
      default : "",
      required : false
    },
    money_title_idx : {
      type : Number,
      default : 0,
      required : false
    },
    money_title_val : {
      type : String,
      default : "",
      required : false
    },
    money_amount : {
      type : Number,
      default : 0,
      required : false
    },
    money_content :{
      type : String,
      default : "",
      required : false
    },
  }],

  money_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  money_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.money_number = await incrementSeq("money_number", "Money");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Money = mongoose.model(
  "Money", schema, "money"
);