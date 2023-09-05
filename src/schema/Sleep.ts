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
    type : Array,
    default : () => {
      const weekArray = [];
      const date = new Date();
      date.setHours(date.getHours() + 9);
      const currentMonth = date.toISOString().split('T')[0].split('-')[1];

      for(let i = 1; i <= 5; i++) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + (i * 7));
        // 주의 첫날 (월요일)

        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() - date.getDay() + 6 + (i * 7));
        // 주의 마지막날 (일요일)

        const startString = startOfWeek.toISOString().split('T')[0];
        const endString = endOfWeek.toISOString().split('T')[0];
        const startMonth = startString.split('-')[1];
        const endMonth = endString.split('-')[1];

        if (startMonth === currentMonth && endMonth === currentMonth) {
          weekArray.push(`${i}번: ${startString} ~ ${endString}`);
        }
      }
      return weekArray;
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
