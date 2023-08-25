// User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id: {
    type: String,
    required: true
  },
  user_pw: {
    type: String,
    required: true
  },
});

export default mongoose.model("User", UserSchema);