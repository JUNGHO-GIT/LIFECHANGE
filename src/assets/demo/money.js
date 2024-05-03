import mongodb from 'mongodb';
import moment from 'moment-timezone';
import {Money} from '../../schema/Money.js';
import {randomNumber} from '../js/utils.js';
import {moneyArray} from '../array/moneyArray.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const endDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
  const regDate = startDate;
  const updateDate = endDate;

  const partIndex = randomNumber(moneyArray.length - 1) + 1;
  const part = moneyArray[partIndex];
  const titleIndex = randomNumber(3);
  const title = part.money_title[titleIndex];

  let sections = [];
  const sectionCount = randomNumber(5) + 1;
  for (let j = 0; j < sectionCount; j++) {
    sections.push({
      _id: new mongodb.ObjectId(),
      money_part_idx: partIndex,
      money_part_val: part.money_part,
      money_title_idx: titleIndex,
      money_title_val: title,
      money_amount: randomNumber(100000),
      money_content: "content",
    });
  }

  const record = {
    _id: new mongodb.ObjectId(),
    customer_id: "123",
    money_number: i + 200,
    money_demo: true,
    money_startDt: startDate,
    money_endDt: endDate,
    money_total_in: randomNumber(100000),
    money_total_out: randomNumber(100000),
    money_section: sections,
    money_regDt: regDate,
    money_updateDt: updateDate,
  };

  demoData.push(record);
};

// Create a new document in the Money.
export const addMoney = async () => {
  try {
    // 일단 전체 데이터 삭제
    const deleteResult = await Money.deleteMany({
      customer_id: "123",
      money_demo: true
    });
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await Money.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}