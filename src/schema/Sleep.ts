// Sleep.ts
import mongoose from "mongoose";
import moment from "moment-timezone";

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
  sleep_day : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  },
  sleep_duration : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  },
  sleep_regdate: {
    type: String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD").toString();
    },
    required : true
  },
  sleep_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD").toString();
    },
    required : false
  }
});

export default mongoose.model("Sleep", SleepScheme);
