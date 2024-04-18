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
const workArray = [
  // 0
  {
    work_part: "전체",
    work_title: [
      "전체"
    ]
  },
  // 1
  {
    work_part: "등",
    work_title: [
      "전체", "데드리프트", "바벨로우", "덤벨로우", "시티드로우", "랫풀다운", "풀업"
    ]
  },
  // 2
  {
    work_part : "하체",
    work_title : [
      "전체", "백스쿼트", "프론트스쿼트", "핵스쿼트", "바벨런지", "덤벨런지", "레그프레스", "레그익스텐션", "레그컬"
    ]
  },
  // 3
  {
    work_part: "가슴",
    work_title: [
      "전체", "바벨벤치프레스", "덤벨벤치프레스", "머신벤치프레스", "인클라인벤치프레스", "디클라인벤치프레스", "덤벨플라이", "케이블플라이", "케이블크로스오버", "딥스", "푸쉬업"
    ]
  },
  // 4
  {
    work_part: "어깨",
    work_title: [
      "전체", "밀리터리프레스", "바벨프레스", "덤벨프레스", "머신프레스", "비하인드넥프레스", "프론트레터럴레이즈", "사이드레터럴레이즈", "벤트오버레터럴레이즈", "페이스풀"
    ]
  },
  // 5
  {
    work_part: "삼두",
    work_title: [
      "전체", "라잉트라이셉스익스텐션", "덤벨트라이셉스익스텐션", "오버헤드트라이셉스익스텐션", "클로즈그립벤치프레스", "케이블트라이셉스푸쉬다운", "케이블트라이셉스로프다운", "킥백"
    ]
  },
  // 6
  {
    work_part: "이두",
    work_title: [
      "전체", "바벨컬", "덤벨컬", "해머컬", "머신컬", "케이블컬", "바벨프리처컬", "덤벨프리처컬"
    ]
  },
  // 7
  {
    work_part: "유산소",
    work_title: [
      "전체", "걷기", "달리기", "스텝퍼", "자전거", "수영", "플랭크"
    ]
  },
  // 8
  {
    work_part: "휴식",
    work_title: [
      "전체", "휴식"
    ]
  },
];

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
  const endDate = new Date(startDate.getTime() + Math.random() * 36000000);
  const regDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
  const updateDate = new Date(regDate.getTime() + Math.random() * 36000000);

  const partIndex = randomNumber(workArray.length - 1) + 1;
  const part = workArray[partIndex];
  const titleIndex = randomNumber(part.work_title.length);
  const title = part.work_title[titleIndex];

  const record = {
    _id: new ObjectId(),
    user_id: "123",
    work_number: i + 100,
    work_startDt: formatDate1(startDate),
    work_endDt: formatDate1(endDate),

    work_start: randomTime(),
    work_end: randomTime(),
    work_time: calcDate(randomTime(), randomTime()),

    work_total_volume: randomNumber(10000),
    work_total_cardio: randomTime(),
    work_body_weight: randomNumber(100),

    work_section: [{
      _id: new ObjectId(),
      work_part_idx: partIndex,
      work_part_val: part.work_part,
      work_title_idx: titleIndex,
      work_title_val: title,
      work_set: randomNumber(10),
      work_rep: randomNumber(10),
      work_kg: randomNumber(100),
      work_rest: randomNumber(100),
      work_volume: randomNumber(1000),
      work_cardio: randomTime(),
    }],

    work_regDt: formatDate2(regDate),
    work_updateDt: formatDate2(updateDate),
  };

  demoData.push(record);
};

// Create a new document in the collection.
db.getCollection('work').insertMany(demoData);