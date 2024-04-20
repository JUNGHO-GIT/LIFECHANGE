// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test');
const randomNumber = (data) => {
  return Math.floor(Math.random() * data);
}
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
const randomTime = () => {
  const hour = Math.floor(Math.random() * 23).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}
const formatDate1 = (date) => {
  return `2024-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
const formatDate2 = (date) => {
  return `2024-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} / ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}
const calcDate = (startTime, endTime) => {
  const start = new Date(`1970/01/01 ${startTime}`);
  const end = new Date(`1970/01/01 ${endTime}`);
  const duration = new Date(end - start + 24 * 60 * 60 * 1000);
  return `${duration.getHours().toString().padStart(2, '0')}:${duration.getMinutes().toString().padStart(2, '0')}`;
}

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const endDate = new Date(startDate.getTime() + Math.random() * 36000000);
  const regDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const updateDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));

  const record = {
    _id: new ObjectId(),
    customer_id: "123",
    money_plan_number: i + 100,
    money_plan_startDt: formatDate1(startDate),
    money_plan_endDt: formatDate1(endDate),

    money_plan_in: randomNumber(100000),
    money_plan_out: randomNumber(100000),

    money_plan_regDt: formatDate2(regDate),
    money_plan_updateDt: formatDate2(updateDate),
  };

  demoData.push(record);
};



// Create a new document in the collection.
async function insertDataAndRemoveDuplicates() {
  try {
    const collection = db.getCollection('moneyPlan')

    // 데이터 삽입
    const insertResult = await collection.insertMany(demoData);
    console.log('Inserted documents:', insertResult.insertedCount);

    // 중복된 날짜 항목 삭제 로직
    const docs = await collection.aggregate([
      {
        $group: {
          _id: "$money_plan_startDt",
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
    ]).toArray();

    // 필터링된 문서 ID로 deleteMany 실행
    for (const doc of docs) {
      if (doc.toDelete.length > 0) {
        const deleteResult = await collection.deleteMany({ _id: { $in: doc.toDelete } });
        console.log("Deleted documents:", deleteResult.deletedCount);
      }
    }
  } catch (error) {
    console.error('Error during database operations:', error);
  }
}

// 함수 호출
insertDataAndRemoveDuplicates();