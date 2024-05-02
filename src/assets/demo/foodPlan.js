import mongodb from 'mongodb';
import {FoodPlan} from '../../schema/FoodPlan.js';
import {randomNumber, randomDate, randomTime, formatDate1, formatDate2, calcDate} from '../js/utils.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const endDate = new Date(startDate.getTime() + Math.random() * 36000000);
  const regDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const updateDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));

  const record = {
    _id: new mongodb.ObjectId(),
    customer_id: "123",
    food_plan_number: i + 100,
    food_plan_demo: true,
    food_plan_startDt: formatDate1(startDate),
    food_plan_endDt: formatDate1(endDate),
    food_plan_kcal: randomNumber(1000),
    food_plan_carb: randomNumber(100),
    food_plan_protein:  randomNumber(100),
    food_plan_fat: randomNumber(100),
    food_plan_regDt: formatDate2(regDate),
    food_plan_updateDt: formatDate2(updateDate),
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

    // 중복된 날짜 항목 삭제 로직
    const docs = await FoodPlan.aggregate([
      {
        $group: {
          _id: "$food_plan_startDt",
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
        const deleteResult = await FoodPlan.deleteMany({ _id: { $in: doc.toDelete } });
        console.log("Deleted documents:", deleteResult.deletedCount);
      }
    }
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}