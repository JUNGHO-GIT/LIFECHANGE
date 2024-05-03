import mongodb from 'mongodb';
import moment from 'moment-timezone';
import {MoneyPlan} from '../../schema/MoneyPlan.js';
import {randomNumber} from '../js/utils.js';

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
    money_plan_number: i + 100,
    money_plan_demo: true,
    money_plan_startDt: startDate,
    money_plan_endDt: endDate,
    money_plan_in: randomNumber(100000),
    money_plan_out: randomNumber(100000),
    money_plan_regDt: regDate,
    money_plan_updateDt: updateDate,
  };

  demoData.push(record);
};

// Create a new document in the MoneyPlan.
export const addMoneyPlan = async () => {
  try {
    // 일단 전체 데이터 삭제
    const deleteResult = await MoneyPlan.deleteMany({
      customer_id: "123",
      money_plan_demo: true
    });
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await MoneyPlan.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}