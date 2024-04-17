// Counter.js

import mongoose from "mongoose";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: "",
    required: true
  },
  seq: {
    type: Number,
    default: 0
  },
});

const Counter = mongoose.model("Counter", schema, "counter");

// 2. incrementSeq -------------------------------------------------------------------------------->
export async function incrementSeq(sequenceName, modelName) {
  // 시퀀스 번호 동기화 검증 로직
  const Model = mongoose.model(modelName);
  const latestDoc = await Model.findOne().sort({ [sequenceName]: -1 }).exec();
  const latestSeq = latestDoc ? latestDoc[sequenceName] : 0;

  // Counter 컬렉션 업데이트
  const upDt = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  .exec();

  // 시퀀스 번호가 최신 상태인지 검증하고 필요한 경우 재설정
  if (upDt.seq <= latestSeq) {
    await Counter.findOneAndUpdate({ _id: sequenceName }, { seq: latestSeq + 1 }, { new: true }).exec();
    return latestSeq + 1;
  }

  return upDt.seq;
};
