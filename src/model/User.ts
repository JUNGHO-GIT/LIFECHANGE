// User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  userId: String,
  userPw: String,
});

const User = mongoose.model("User", UserSchema);

export default User;