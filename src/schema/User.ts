// User.ts

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter";

const UserSchema = new mongoose.Schema ({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_number : {
    type : Number,
    unique : true
  },
  user_id : {
    type : String,
    required : true
  },
  user_pw : {
    type : String,
    required : true
  },

  // 3. date
  user_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required : true
  },
  user_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required : true
  }
});

UserSchema.pre("save", async function(next) {
  if (this.isNew) {
    this.user_number = await incrementSeq("user_number", "User");
  }
  next();
});

export default mongoose.model("User", UserSchema);