// Money.ts

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter";

const MoneySchema = new mongoose.Schema ({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  money_number : {
    type : Number,
    unique : true
  },
  user_id : {
    type :String,
    required : true
  },

  // 2. section
  moneySection: [{
    money_part_idx : {
      type : Number,
      required : false
    },
    money_part_val : {
      type : String,
      required : true
    },
    money_title_idx : {
      type : Number,
      required : false
    },
    money_title_val : {
      type : String,
      required : true
    },
    money_amount : {
      type : Number,
      required : true
    },
    money_content :{
      type : String,
      required : true
    },
  }],

  // 3. date
  money_day : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  },
  money_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required : true
  },
  money_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required : true
  }
});

MoneySchema.pre("save", async function(next) {
  if (this.isNew) {
    this.money_number = await incrementSeq("money_number", "Money");
  }
  next();
});

export default mongoose.model("Money", MoneySchema);
