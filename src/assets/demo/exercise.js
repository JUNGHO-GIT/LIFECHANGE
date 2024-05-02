import mongodb from 'mongodb';
import {Exercise} from '../../schema/Exercise.js';
import {randomNumber, randomDate, randomTime, formatDate1, formatDate2, calcDate} from '../js/utils.js';
import {exerciseArray} from '../array/exerciseArray.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];

for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const regDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const updateDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));

  const partIndex = randomNumber(exerciseArray.length - 1) + 1;
  const part = exerciseArray[partIndex];
  const titleIndex = randomNumber(part.exercise_title.length);
  const title = part.exercise_title[titleIndex];

  let sections = [];
  const sectionCount = randomNumber(5) + 1;
  for (let j = 0; j < sectionCount; j++) {
    sections.push({
      _id: new mongodb.ObjectId(),
      exercise_part_idx: partIndex,
      exercise_part_val: part.exercise_part,
      exercise_title_idx: titleIndex,
      exercise_title_val: title,
      exercise_set: randomNumber(10),
      exercise_rep: randomNumber(10),
      exercise_kg: randomNumber(100),
      exercise_rest: randomNumber(100),
      exercise_volume: randomNumber(1000),
      exercise_cardio: randomTime(),
    });
  }

  const record = {
    _id: new mongodb.ObjectId(),
    customer_id: "123",
    exercise_number: i + 100,
    exercise_demo: true,
    exercise_startDt: formatDate1(startDate),
    exercise_endDt: formatDate1(startDate),
    exercise_total_volume: randomNumber(10000),
    exercise_total_cardio: randomTime(),
    exercise_body_weight: randomNumber(100),
    exercise_section: sections,
    exercise_regDt: formatDate2(regDate),
    exercise_updateDt: formatDate2(updateDate),
  };

  demoData.push(record);
};

// Create a new document in the Exercise.
export const addExercise = async () => {
  try {

    // 일단 전체 데이터 삭제
    const deleteResult = await Exercise.deleteMany({
      customer_id: "123",
      exercise_demo: true
    });
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await Exercise.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);

    // 중복된 날짜 항목 삭제 로직
    const docs = await Exercise.aggregate([
      {
        $group: {
          _id: "$exercise_startDt",
          docIds: { $push: "$_id" },
          firstId: { $first: "$_id" }
        }
      },
      {
        $project: {
          _id: 0,
          toDelete: {
            $filter: {
              input: "$docIds",
              as: "docId",
              cond: { $ne: ["$$docId", "$firstId"] }
            }
          }
        }
      }
    ]);

    // 필터링된 문서 ID로 deleteMany 실행
    for (const doc of docs) {
      if (doc.toDelete.length > 0) {
        const deleteResult = await Exercise.deleteMany({ _id: { $in: doc.toDelete } });
        console.log("Deleted documents:", deleteResult.deletedCount);
      }
    }
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}