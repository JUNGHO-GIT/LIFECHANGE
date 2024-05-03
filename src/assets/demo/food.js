import mongodb from 'mongodb';
import moment from 'moment-timezone';
import {Food} from '../../schema/Food.js';
import {randomNumber} from '../js/utils.js';
import {foodArray} from '../array/foodArray.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const endDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const regDate = startDate;
  const updateDate = endDate;

  const partIndex = randomNumber(foodArray.length - 1) + 1;
  const part = foodArray[partIndex];

  // title은 따로 랜덤생성
  const titleIndex = randomNumber(10);
  const titleArray = ["김치찌개", "된장찌개", "부대찌개", "순두부찌개", "갈비탕", "설렁탕", "뼈해장국", "칼국수", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이"]
  const title = titleArray[randomNumber(titleArray.length)];

  let sections = [];
  const sectionCount = randomNumber(5) + 1;
  for (let j = 0; j < sectionCount; j++) {
    sections.push({
      _id: new mongodb.ObjectId(),
      food_part_idx: partIndex,
      food_part_val: part.food_part,
      food_title : title,
      food_count: randomNumber(10),
      food_serv: "회",
      food_gram: randomNumber(100),
      food_kcal: randomNumber(10000),
      food_fat: randomNumber(100),
      food_carb: randomNumber(100),
      food_protein: randomNumber(100),
    });
  }

  const record = {
    _id: new mongodb.ObjectId(),
    customer_id: "123",
    food_number: i + 300,
    food_demo: true,
    food_startDt: startDate,
    food_endDt: endDate,
    food_total_kcal: randomNumber(10000),
    food_total_fat: randomNumber(100),
    food_total_carb: randomNumber(100),
    food_total_protein: randomNumber(100),
    food_section: sections,
    food_regDt: regDate,
    food_updateDt: updateDate,
  };

  demoData.push(record);
};

// Create a new document in the Food.
export const addFood = async () => {
  try {
    // 일단 전체 데이터 삭제
    const deleteResult = await Food.deleteMany({
      customer_id: "123",
      food_demo: true
    });
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await Food.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}