// Money.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  money_number: {
    type: Number,
    default: 0,
    unique : true
  },

  money_dateType: {
    type: String,
    default: "",
    required: false
  },
  money_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  money_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  money_total_income: {
    type: String,
    default: "",
    required: false
  },
  money_total_expense: {
    type: String,
    default: "",
    required: false
  },

  money_section: [{
    money_part : {
      type: String,
      default: "",
      required: false
    },
    money_title : {
      type: String,
      default: "",
      required: false
    },
    money_include : {
      type: String,
      default: "Y",
      required: false
    },
    money_amount : {
      type: String,
      default: 0,
      required: false
    },
    money_content :{
      type: String,
      default: "",
      required: false
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

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.money_number = await incrementSeq("money_number", "Money");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const Money = mongoose.model(
  "Money", schema, "money"
);