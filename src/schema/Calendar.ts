// Calendar.ts
import mongoose from "mongoose";

const CalendarScheme = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },
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
    required : true
  },
  calendar_regdate : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  },
  calendar_update : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  }
});

export default mongoose.model("Calendar", CalendarScheme);
