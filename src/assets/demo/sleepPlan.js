import mongodb from 'mongodb';
import moment from 'moment-timezone';
import {SleepPlan} from '../../schema/SleepPlan.js';
import {randomTime, calcDate} from '../js/utils.js';

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
    sleep_plan_number: i + 100,
    sleep_plan_demo: true,
    sleep_plan_startDt: startDate,
    sleep_plan_endDt: endDate,
    sleep_plan_night: randomTime(),
    sleep_plan_morning:  randomTime(),
    sleep_plan_time: calcDate(randomTime(), randomTime()),
    sleep_plan_regDt: regDate,
    sleep_plan_updateDt: updateDate,
  };

  demoData.push(record);
};

// Create a new document in the SleepPlan.
export const addSleepPlan = async () => {
  try {
    // 일단 전체 데이터 삭제
    const deleteResult = await SleepPlan.deleteMany({
      customer_id: "123",
      sleep_plan_demo: true
    });
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await SleepPlan.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}