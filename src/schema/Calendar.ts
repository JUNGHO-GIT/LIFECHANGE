// Calendar.ts

import mongoose from "mongoose";
import moment from "moment-timezone";

const CalendarSchema = new mongoose.Schema ({

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
  calendar_title : {
    type : String,
    required : true
  },
  calendar_content :{
    type : String,
    required : true
  },
  calendar_start : {
    type : String,
    required : true
  },
  calendar_end : {
    type : String,
    required : true
  },
  calendar_image : {
    type : String,
    required : false
  },

  // 3. date
  calendar_day : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  },
  calendar_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  },
  calendar_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  }
});

export default mongoose.model("Calendar", CalendarSchema);
