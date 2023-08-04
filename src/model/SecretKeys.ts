// SecretKeys.ts
import mongoose from "mongoose";

const SecretKeysSchema = new mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  secretKeys: String,
});

const SecretKeys = mongoose.model("SecretKeys", SecretKeysSchema);

export default SecretKeys;