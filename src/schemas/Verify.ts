/**
 * @file Verify.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";

// 0. types ---------------------------------------------------------------------------------------
declare interface VerifyType extends mongoose.Document {
  verify_id: string;
  verify_code: string;
  verify_ticket: string;
  verify_regDt: Date;
  verify_updateDt: Date;
}

// 1. schema ---------------------------------------------------------------------------------------
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
    // 코드 대조 성공 시 발급되는 일회용 재설정·가입 티켓 (인증 사실의 서버측 증거)
    verify_ticket: {
      type: String,
      default: ``,
      required: false,
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

// 2. index ---------------------------------------------------------------------------------------
// - 조회 키 인덱스가 없어 매 인증마다 컬렉션 전수탐색이 발생하므로 보완함
// - TTL 로 만료 인증코드를 자동 정리해 무기한 유효한 코드가 남지 않게 함
schema.index({
  verify_id: 1,
});
schema.index({
  verify_regDt: 1,
}, {
  expireAfterSeconds: Number(process.env.VERIFY_TTL_SEC ?? 600),
});

// 5. model ----------------------------------------------------------------------------------------
export const Verify = mongoose.model<VerifyType>(`Verify`, schema);
