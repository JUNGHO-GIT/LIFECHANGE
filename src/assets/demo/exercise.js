// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The current database to use.
use('test');

// array ----------------------------------------------------------------------------------------->
const exerciseArray = [
  // 0
  {
    exercise_part: "전체",
    exercise_title: [
      "전체"
    ]
  },
  // 1
  {
    exercise_part: "등",
    exercise_title: [
      "전체", "데드리프트", "바벨로우", "덤벨로우", "시티드로우", "랫풀다운", "풀업"
    ]
  },
  // 2
  {
    exercise_part : "하체",
    exercise_title : [
      "전체", "백스쿼트", "프론트스쿼트", "핵스쿼트", "바벨런지", "덤벨런지", "레그프레스", "레그익스텐션", "레그컬"
    ]
  },
  // 3
  {
    exercise_part: "가슴",
    exercise_title: [
      "전체", "바벨벤치프레스", "덤벨벤치프레스", "머신벤치프레스", "인클라인벤치프레스", "디클라인벤치프레스", "덤벨플라이", "케이블플라이", "케이블크로스오버", "딥스", "푸쉬업"
    ]
  },
  // 4
  {
    exercise_part: "어깨",
    exercise_title: [
      "전체", "밀리터리프레스", "바벨프레스", "덤벨프레스", "머신프레스", "비하인드넥프레스", "프론트레터럴레이즈", "사이드레터럴레이즈", "벤트오버레터럴레이즈", "페이스풀"
    ]
  },
  // 5
  {
    exercise_part: "삼두",
    exercise_title: [
      "전체", "라잉트라이셉스익스텐션", "덤벨트라이셉스익스텐션", "오버헤드트라이셉스익스텐션", "클로즈그립벤치프레스", "케이블트라이셉스푸쉬다운", "케이블트라이셉스로프다운", "킥백"
    ]
  },
  // 6
  {
    exercise_part: "이두",
    exercise_title: [
      "전체", "바벨컬", "덤벨컬", "해머컬", "머신컬", "케이블컬", "바벨프리처컬", "덤벨프리처컬"
    ]
  },
  // 7
  {
    exercise_part: "유산소",
    exercise_title: [
      "전체", "걷기", "달리기", "스텝퍼", "자전거", "수영", "플랭크"
    ]
  },
  // 8
  {
    exercise_part: "휴식",
    exercise_title: [
      "전체", "휴식"
    ]
  },
];

// logic ------------------------------------------------------------------------------------------>
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
  const regDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const updateDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));

  const partIndex = randomNumber(exerciseArray.length - 1) + 1;
  const part = exerciseArray[partIndex];
  const titleIndex = randomNumber(part.exercise_title.length);
  const title = part.exercise_title[titleIndex];

  let sections = [];
  const sectionCount = randomNumber(5) + 1;
  for (let j = 0; j < sectionCount; j++) {
    sections.push({
      _id: new ObjectId(),
      exercise_part_idx: partIndex,
      exercise_part_val: part.exercise_part,
      exercise_title_idx: titleIndex,
      exercise_title_val: title,
      exercise_set: randomNumber(10),
      exercise_rep: randomNumber(10),
      exercise_kg: randomNumber(100),
      exercise_rest: randomNumber(100),
      exercise_volume: randomNumber(1000),
      exercise_cardio: randomTime(),
    });
  }

  const record = {
    _id: new ObjectId(),
    customer_id: "123",
    exercise_number: i + 100,
    exercise_startDt: formatDate1(startDate),
    exercise_endDt: formatDate1(startDate),

    exercise_total_volume: randomNumber(10000),
    exercise_total_cardio: randomTime(),
    exercise_body_weight: randomNumber(100),

    exercise_section: sections,

    exercise_regDt: formatDate2(regDate),
    exercise_updateDt: formatDate2(updateDate),
  };

  demoData.push(record);
};

// Create a new document in the collection.
const insertDataAndRemoveDuplicates = async () => {
  try {
    const collection = db.getCollection('exercise')

    // 데이터 삽입
    const insertResult = await collection.insertMany(demoData);
    console.log('Inserted documents:', insertResult.insertedCount);

    // 중복된 날짜 항목 삭제 로직
    const docs = await collection.aggregate([
      {
        $group: {
          _id: "$exercise_startDt",
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