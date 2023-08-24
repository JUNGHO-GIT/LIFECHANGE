// SecretKeys.ts
import mongoose from "mongoose";

const SecretKeysSchema = new mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  secretKeys: String,
});

export default mongoose.model("SecretKeys", SecretKeysSchema);