// MoneyRecord.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  money_record_number: {
    type: Number,
    default: 0,
    unique : true
  },

  money_record_dateType: {
    type: String,
    default: "",
    required: false
  },
  money_record_dateStart: {
    type: String,
    default: "0000-00-00",
    required: false
  },
  money_record_dateEnd: {
    type: String,
    default: "0000-00-00",
    required: false
  },

  money_record_total_income: {
    type: String,
    default: "",
    required: false
  },
  money_record_total_expense: {
    type: String,
    default: "",
    required: false
  },

  money_section: [{
    money_record_part : {
      type: String,
      default: "",
      required: false
    },
    money_record_title : {
      type: String,
      default: "",
      required: false
    },
    money_record_include : {
      type: String,
      default: "Y",
      required: false
    },
    money_record_amount : {
      type: String,
      default: 0,
      required: false
    },
    money_record_content :{
      type: String,
      default: "",
      required: false
    },
  }],

  money_record_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  money_record_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.money_record_number = await incrementSeq("money_record_number", "MoneyRecord");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const MoneyRecord = mongoose.model(
  "MoneyRecord", schema, "moneyRecord"
);