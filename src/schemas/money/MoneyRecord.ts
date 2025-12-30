/**
 * @file MoneyRecord.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 0. types ---------------------------------------------------------------------------------------
declare interface MoneyRecordSection {
  money_record_part: string;
  money_record_title: string;
  money_record_include: string;
  money_record_amount: string;
  money_record_content: string;
}
declare interface MoneyRecordType extends mongoose.Document {
  user_id: string;
  money_record_number: number;
  money_record_dateType: string;
  money_record_dateStart: string;
  money_record_dateEnd: string;
  money_record_total_income: string;
  money_record_total_expense: string;
  money_section: MoneyRecordSection[];
  money_record_regDt: Date;
  money_record_updateDt: Date;
}

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: ``,
    required: true,
  },
  money_record_number: {
    type: Number,
    default: 0,
    unique: true,
  },
  money_record_dateType: {
    type: String,
    default: ``,
    required: false,
  },
  money_record_dateStart: {
    type: String,
    default: `0000-00-00`,
    required: false,
  },
  money_record_dateEnd: {
    type: String,
    default: `0000-00-00`,
    required: false,
  },
  money_record_total_income: {
    type: String,
    default: ``,
    required: false,
  },
  money_record_total_expense: {
    type: String,
    default: ``,
    required: false,
  },
  money_section: [
    {
      money_record_part: {
        type: String,
        default: ``,
        required: false,
      },
      money_record_title: {
        type: String,
        default: ``,
        required: false,
      },
      money_record_include: {
        type: String,
        default: `Y`,
        required: false,
      },
      money_record_amount: {
        type: String,
        default: 0,
        required: false,
      },
      money_record_content: {
        type: String,
        default: ``,
        required: false,
      },
    },
  ],
  money_record_regDt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  money_record_updateDt: {
    type: Date,
    default: Date.now,
    required: false,
  },
}, {
  collection: `MoneyRecord`,
  timestamps: {
    createdAt: `money_record_regDt`,
    updatedAt: `money_record_updateDt`,
  },
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre<MoneyRecordType>(`save`, async function() {
  if (this.isNew) {
    this.money_record_number = await incrementSeq(`money_record_number`, `MoneyRecord`);
  }
});

// 5. model ----------------------------------------------------------------------------------------
export const MoneyRecord = mongoose.model<MoneyRecordType>(`MoneyRecord`, schema);
