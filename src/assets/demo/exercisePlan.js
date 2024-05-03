import mongodb from 'mongodb';
import moment from 'moment-timezone';
import {ExercisePlan} from '../../schema/ExercisePlan.js';
import {randomNumber, randomTime} from '../js/utils.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const endDate = moment().subtract(i + 1, 'days').format('YYYY-MM-DD');
  const regDate = startDate;
  const updateDate = endDate;

  const record = {
    _id: new mongodb.ObjectId(),
    customer_id: "123",
    exercise_plan_number: i + 100,
    exercise_plan_demo: true,
    exercise_plan_startDt: startDate,
    exercise_plan_endDt: endDate,
    exercise_plan_count: randomNumber(100),
    exercise_plan_volume: randomNumber(1000),
    exercise_plan_cardio:  randomTime(),
    exercise_plan_weight: randomNumber(1000),
    exercise_plan_regDt: regDate,
    exercise_plan_updateDt: updateDate,
  };

  demoData.push(record);
};

// Create a new document in the ExercisePlan.
export const addExercisePlan = async () => {
  try {
    // 일단 전체 데이터 삭제
    const deleteResult = await ExercisePlan.deleteMany({
      customer_id: "123",
      exercise_plan_demo: true
    });
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await ExercisePlan.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}