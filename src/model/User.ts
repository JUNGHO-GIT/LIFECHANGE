// User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: String,
  user_pw: String,
});

export default mongoose.model("User", UserSchema);