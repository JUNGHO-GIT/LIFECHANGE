import mongodb from 'mongodb';
import {Money} from '../../schema/Money.js';
import {randomNumber, randomDate, randomTime, formatDate1, formatDate2, calcDate} from '../js/utils.js';
import {moneyArray} from '../array/moneyArray.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const regDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const updateDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));

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
    money_startDt: formatDate1(startDate),
    money_endDt: formatDate1(startDate),
    money_total_in: randomNumber(100000),
    money_total_out: randomNumber(100000),
    money_section: sections,
    money_regDt: formatDate2(regDate),
    money_updateDt: formatDate2(updateDate),
  };

  demoData.push(record);
};

// Create a new document in the Money.
export const addMoney = async () => {
  try {

    // 일단 전체 데이터 삭제
    const deleteResult = await Money.deleteMany({});
    console.log('Deleted documents:', deleteResult.deletedCount);

    // 데이터 삽입
    const insertResult = await Money.insertMany(demoData);
    console.log('Inserted documents:', insertResult.length);

    // 중복된 날짜 항목 삭제 로직
    const docs = await Money.aggregate([
      {
        $group: {
          _id: "$money_startDt",
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
        const deleteResult = await Money.deleteMany({ _id: { $in: doc.toDelete } });
        console.log("Deleted documents:", deleteResult.deletedCount);
      }
    }
  }
  catch (error) {
    console.error('Error during database operations:', error);
  }
}