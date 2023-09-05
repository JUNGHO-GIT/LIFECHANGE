// Sleep.ts
import mongoose from "mongoose";

const SleepScheme = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },
  sleep_title : {
    type : String,
    required : true
  },
  sleep_night : {
    type : String,
    required : true
  },
  sleep_morning : {
    type : String,
    required : true
  },
  sleep_time : {
    type : String,
    required : true
  },
  sleep_regdate : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  },
  sleep_week : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      const modifiedDate = date.toISOString().split('T')[0];
      const week = new Date(modifiedDate).getDay();
      return week;
    },
    required : true
  },
  sleep_update : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  }
});

export default mongoose.model("Sleep", SleepScheme);
