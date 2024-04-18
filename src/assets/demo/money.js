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
const moneyArray = [
  // 0
  {
    money_part: "전체",
    money_title: [
      "전체"
    ]
  },
  {
    money_part: "수입",
    money_title: [
      "전체", "근로", "금융", "기타",
    ]
  },
  {
    money_part: "지출",
    money_title: [
      "전체", "식비", "문화", "주거", "건강", "교통", "유흥", "품위", "저축", "금융", "기타",
    ]
  }
];

// result ----------------------------------------------------------------------------------------->
let demoData = [];
for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
  const endDate = new Date(startDate.getTime() + Math.random() * 36000000);
  const regDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
  const updateDate = new Date(regDate.getTime() + Math.random() * 36000000);

  const partIndex = randomNumber(moneyArray.length - 1) + 1;
  const part = moneyArray[partIndex];
  const titleIndex = randomNumber(part.money_title.length);
  const title = part.money_title[titleIndex];

  const record = {
    _id: new ObjectId(),
    user_id: "123",
    money_number: i + 100,
    money_startDt: formatDate1(startDate),
    money_endDt: formatDate1(endDate),

    money_total_in: randomNumber(100000),
    money_total_out: randomNumber(100000),

    money_section: [{
      _id: new ObjectId(),
      money_part_idx: partIndex,
      money_part_val: part.money_part,
      money_title_idx: titleIndex,
      money_title_val: title,
      money_amount: randomNumber(100000),
      money_content: "content",
    }],

    money_regDt: formatDate2(regDate),
    money_updateDt: formatDate2(updateDate),
  };

  demoData.push(record);
};

// Create a new document in the collection.
db.getCollection('money').insertMany(demoData);