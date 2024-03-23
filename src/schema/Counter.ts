// Counter.ts

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  },
});

const Counter = mongoose.model("Counter", counterSchema);

// 시퀀스 증가 함수
async function incrementSeq(sequenceName: string): Promise<number> {
  const update = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return update.seq;
}

// Counter 모델과 시퀀스 증가 함수 내보내기
export { Counter, incrementSeq };
