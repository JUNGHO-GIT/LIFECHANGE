import mongodb from 'mongodb';
import moment from 'moment-timezone';
import {FoodPlan} from '../../schema/FoodPlan.js';
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
    food_plan_number: i + 100,
    food_plan_demo: true,
    food_plan_startDt: startDate,
    food_plan_endDt: endDate,
    food_plan_kcal: randomNumber(1000),
    food_plan_carb: randomNumber(100),
    food_plan_protein:  randomNumber(100),
    food_plan_fat: randomNumber(100),
    food_plan_regDt: regDate,
    food_plan_updateDt: updateDate,
  };

  demoData.push(record);
};

// Create a new document in the FoodPlan.
export const addFoodPlan = async () => {
  try {
    // 일단 전체 데이터 삭제
    const deleteResult = await FoodPlan.deleteMany({
      customer_id: "123",
      food_plan_demo: true
    });
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await FoodPlan.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}