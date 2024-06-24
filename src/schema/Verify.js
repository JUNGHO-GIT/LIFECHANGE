// Verify.js

import mongoose from "mongoose";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  verify_id: {
    type: String,
    default: "",
    required: true
  },
  verify_code: {
    type: String,
    default: "",
    required: true
  },
  verify_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
});

// 5. model ----------------------------------------------------------------------------------------
export const User = mongoose.model(
  "Verify", schema, "verify"
);