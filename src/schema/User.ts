// User.ts

import mongoose from "mongoose";
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
});

UserSchema.pre("save", async function(next) {
  if (this.isNew) {
    this.user_number = await incrementSeq("user_number");
  }
  next();
});

export default mongoose.model("User", UserSchema);