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
  sleep_regdate: {
    type: String,
    default : () => {
      return "default";
    },
    required : true
  },
  sleep_week: {
    type: String,
    default : () => {
      return "default";
    },
    required: true
  },
  sleep_month: {
    type: String,
    default : () => {
      return "default";
    },
    required: true
  },
  sleep_year: {
    type: String,
    default : () => {
      return "default";
    },
    required: true
  },
  sleep_update : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  }
});

export default mongoose.model("Sleep", SleepScheme);
