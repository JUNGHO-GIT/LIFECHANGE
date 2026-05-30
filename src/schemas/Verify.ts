/**
 * @file Verify.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";

// 0. types ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
declare interface VerifyType extends mongoose.Document {
  verify_id: string;
  verify_code: string;
  verify_regDt: Date;
  verify_updateDt: Date;
}

// 1. schema ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
const schema = new mongoose.Schema(
  {
    verify_id: {
      type: String,
      default: ``,
      required: true,
    },
    verify_code: {
      type: String,
      default: ``,
      required: true,
    },
    verify_regDt: {
      type: Date,
      default: Date.now,
      required: false,
    },
    verify_updateDt: {
      type: Date,
      default: Date.now,
      required: false,
    },
  },
  {
    collection: `Verify`,
    timestamps: {
      createdAt: `verify_regDt`,
      updatedAt: `verify_updateDt`,
    },
  },
);

// 5. model ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Verify = mongoose.model<VerifyType>(`Verify`, schema);
