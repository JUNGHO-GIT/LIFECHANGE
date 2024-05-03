import mongodb from 'mongodb';
import moment from 'moment-timezone';
import {Sleep} from '../../schema/Sleep.js';
import {randomTime, calcDate} from '../js/utils.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const endDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const regDate = startDate;
  const updateDate = endDate;

  const record = {
    _id: new mongodb.ObjectId(),
    customer_id: "123",
    sleep_number: i + 100,
    sleep_demo: true,
    sleep_startDt: startDate,
    sleep_endDt: endDate,
    sleep_section: [{
      _id: new mongodb.ObjectId(),
      sleep_night: randomTime(),
      sleep_morning: randomTime(),
      sleep_time: calcDate(randomTime(), randomTime()),
    }],
    sleep_regDt: regDate,
    sleep_updateDt: updateDate,
  };

  demoData.push(record);
};

// Create a new document in the Sleep.
export const addSleep = async () => {
  try {
    // 전체 데이터 삭제
    const deleteResult = await Sleep.deleteMany({
      customer_id: "123",
      sleep_demo: true
    });
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await Sleep.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}
