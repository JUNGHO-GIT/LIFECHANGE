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
  const updateDate = new Date(regDate.getTime() + Math.random() * 36000000);

  const record = {
    _id: new ObjectId(),
    user_id: "123",
    sleep_plan_number: i + 100,
    sleep_plan_startDt: formatDate1(startDate),
    sleep_plan_endDt: formatDate1(endDate),

    sleep_plan_night: randomTime(),
    sleep_plan_morning:  randomTime(),
    sleep_plan_time: calcDate(randomTime(), randomTime()),

    sleep_plan_regDt: formatDate2(regDate),
    sleep_plan_updateDt: formatDate2(updateDate),
  };

  demoData.push(record);
};

// Create a new document in the collection.
db.getCollection('sleepPlan').insertMany(demoData);