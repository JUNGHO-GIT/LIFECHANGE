// Money.ts

import mongoose from "mongoose";
import moment from "moment-timezone";

const MoneyScheme = new mongoose.Schema ({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },

  // 2. components
  money_title : {
    type : String,
    required : true
  },
  money_content :{
    type : String,
    required : true
  },
  money_amount : {
    type : String,
    required : true
  },
  money_memo : {
    type : String,
    required : false,
  },
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
    }
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
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  },
  money_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  }
});

export default mongoose.model("Money", MoneyScheme);
