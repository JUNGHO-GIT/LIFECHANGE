import mongodb from 'mongodb';
import moment from 'moment-timezone';
import {Exercise} from '../../schema/Exercise.js';
import {randomNumber, randomTime} from '../js/utils.js';
import {exerciseArray} from '../array/exerciseArray.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const endDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const regDate = startDate;
  const updateDate = endDate;

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
    exercise_startDt: startDate,
    exercise_endDt: endDate,
    exercise_total_volume: randomNumber(10000),
    exercise_total_cardio: randomTime(),
    exercise_body_weight: randomNumber(100),
    exercise_section: sections,
    exercise_regDt: regDate,
    exercise_updateDt: updateDate,
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
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}