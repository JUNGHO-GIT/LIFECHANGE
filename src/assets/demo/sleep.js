import mongodb from 'mongodb';
import {Sleep} from '../../schema/Sleep.js';
import {randomNumber, randomDate, randomTime, formatDate1, formatDate2, calcDate} from '../js/utils.js';

// result ----------------------------------------------------------------------------------------->
let demoData = [];

for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const regDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const updateDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));

  const record = {
    _id: new mongodb.ObjectId(),
    customer_id: "123",
    sleep_number: i + 100,
    sleep_demo: true,
    sleep_startDt: formatDate1(startDate),
    sleep_endDt: formatDate1(startDate),
    sleep_section: [{
      _id: new mongodb.ObjectId(),
      sleep_night: randomTime(),
      sleep_morning: randomTime(),
      sleep_time: calcDate(randomTime(), randomTime()),
    }],
    sleep_regDt: formatDate2(regDate),
    sleep_updateDt: formatDate2(updateDate),
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

    // 중복된 날짜 항목 삭제 로직
    const docs = await Sleep.aggregate([
      {
        $group: {
          _id: "$sleep_startDt",
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
    ])

    // 필터링된 문서 ID로 deleteMany 실행
    for (const doc of docs) {
      if (doc.toDelete.length > 0) {
        const deleteResult = await Sleep.deleteMany({ _id: { $in: doc.toDelete } });
        console.log("Deleted documents:", deleteResult.deletedCount);
      }
    }
  } catch (error) {
    console.error('Error during database operations:', error);
  }
}
