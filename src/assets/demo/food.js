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
const foodArray = [
  // 0
  {
    food_part: "전체",
    food_title: ["전체"]
  },
  // 1
  {
    food_part: "아침",
    food_title: ["전체"]
  },
  // 2
  {
    food_part: "점심",
    food_title: ["전체"]
  },
  // 3
  {
    food_part: "저녁",
    food_title: ["전체"]
  },
  // 4
  {
    food_part: "간식",
    food_title: ["전체"]
  },
];

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const endDate = new Date(startDate.getTime() + Math.random() * 36000000);
  const regDate = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 31));
  const updateDate = new Date(regDate.getTime() + Math.random() * 36000000);

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
      _id: new ObjectId(),
      food_part_idx: partIndex,
      food_part_val: part.food_part,
      food_title_idx: titleIndex,
      food_title_val: title,
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
    _id: new ObjectId(),
    user_id: "123",
    food_number: i + 300,
    food_startDt: formatDate1(startDate),
    food_endDt: formatDate1(endDate),

    food_total_kcal: randomNumber(10000),
    food_total_fat: randomNumber(100),
    food_total_carb: randomNumber(100),
    food_total_protein: randomNumber(100),

    food_section: sections,

    food_regDt: formatDate2(regDate),
    food_updateDt: formatDate2(updateDate),
  };

  demoData.push(record);
};

// Create a new document in the collection.
db.getCollection('food').insertMany(demoData);