// User.ts

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: { type: String, required: true },
  user_pw: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);