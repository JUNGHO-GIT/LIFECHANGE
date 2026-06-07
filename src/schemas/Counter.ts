/**
 * @file Counter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";

// 1. schema ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: ``,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});
const Counter = mongoose.model(`Counter`, schema, `Counter`);

// 2. incrementSeq ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const incrementSeq = async (sequenceName: string, modelName: string) => {
  // 기존 컬렉션 최댓값 조회 (*_number unique 인덱스로 IXSCAN, lean 으로 가볍게)
  const Model = mongoose.model(modelName);
  const latestDoc: any = await Model.findOne()
    .sort({ [sequenceName]: -1 })
    .lean()
    .exec();
  const latestSeq = latestDoc ? latestDoc[sequenceName] : 0;

  // Counter 갱신을 파이프라인 업데이트 1회로 원자 채번 (seq=max(seq,latestSeq)+1)
  const updateDt = await Counter.findOneAndUpdate(
    {
      _id: sequenceName,
    },
    [
      {
        $set: {
          seq: { $add: [{ $max: [{ $ifNull: ["$seq", 0] }, latestSeq] }, 1] },
        },
      },
    ],
    {
      returnDocument: `after`,
      upsert: true,
      updatePipeline: true,
    },
  ).exec();

  return updateDt.seq;
};
