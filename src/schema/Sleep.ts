// Sleep.ts

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter";

const SleepSchema = new mongoose.Schema ({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  sleep_number : {
    type : Number,
    unique : true,
  },
  user_id : {
    type : String,
    required : true
  },

  // 2. components
  sleep_start : {
    type : String,
    required : true
  },
  sleep_end : {
    type : String,
    required : true
  },
  sleep_time : {
    type : String,
    required : true
  },
  sleep_planYn : {
    type : String,
    default : "N",
    required : true
  },

  // 3. date
  sleep_day : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  },
  sleep_regdate: {
    type: String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required: true,
  },
  sleep_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required: true,
  }
});

SleepSchema.pre("save", async function(next) {
  if (this.isNew) {
    this.sleep_number = await incrementSeq("sleep_number", "Sleep");
  }
  next();
});

export default mongoose.model("Sleep", SleepSchema);
