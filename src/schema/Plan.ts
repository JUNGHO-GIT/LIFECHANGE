// Plan.ts

import mongoose from "mongoose";
import moment from "moment-timezone";

const PlanScheme = new mongoose.Schema ({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },

  // 2. section
  planSection: [{
    plan_part_idx : {
      type : Number,
      required : false
    },
    plan_part_val : {
      type : String,
      required : true
    },
    plan_title_idx : {
      type : Number,
      required : false
    },
    plan_title_val : {
      type : String,
      required : true
    },
    plan_content :{
      type : String,
      required : true
    },
    plan_yn : {
      type : Boolean,
      default : false,
      required : true
    }
  }],

  // 3. date
  plan_day : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  },
  plan_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  },
  plan_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  }
});

export default mongoose.model("Plan", PlanScheme);
