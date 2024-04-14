// Money.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  money_number: {
    type : Number,
    unique : true
  },

  money_startDt: {
    type: String,
    required: false
  },
  money_endDt: {
    type: String,
    required: false
  },

  money_total_in: {
    type: String,
    required: false
  },
  money_total_out: {
    type: String,
    required: false
  },

  money_section: [{
    money_part_idx : {
      type : Number,
      required : false
    },
    money_part_val : {
      type : String,
      required : false
    },
    money_title_idx : {
      type : Number,
      required : false
    },
    money_title_val : {
      type : String,
      required : false
    },
    money_amount : {
      type : Number,
      required : false
    },
    money_content :{
      type : String,
      required : false
    },
  }],

  money_regdate: {
    type: String,
    required: false
  },
  money_update: {
    type: String,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
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