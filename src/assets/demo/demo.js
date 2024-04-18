import { Builder } from "xml2js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, unlinkSync, writeFile } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, "sleepRecords.xml");

const demoData = {
  sleepRecords: {
    record: []
  }
};

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate1(date) {
  return `2024-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

function formatDate2(date) {
  return `2024-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} / ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

function randomTime() {
  const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

function calculateDuration(startTime, endTime) {
  const start = new Date(`1970/01/01 ${startTime}`);
  const end = new Date(`1970/01/01 ${endTime}`);
  const duration = new Date(end - start + 24 * 60 * 60 * 1000);
  return `${duration.getHours().toString().padStart(2, '0')}:${duration.getMinutes().toString().padStart(2, '0')}`;
}

for (let i = 1; i <= 100; i++) {
  const startDate = randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1));
  const endDate = new Date(startDate.getTime() + Math.random() * 36000000);
  const regDate = randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1));
  const updateDate = new Date(regDate.getTime() + Math.random() * 36000000);
  const nightTime = randomTime();
  const morningTime = randomTime();
  const duration = calculateDuration(nightTime, morningTime);

  const record = {
    user_id: "123",
    sleep_number: i+100,
    sleep_startDt: formatDate1(startDate),
    sleep_endDt: formatDate1(endDate),
    sleep_section: [{
      sleep_night: nightTime,
      sleep_morning: morningTime,
      sleep_time: duration,
    }],
    sleep_regdate: formatDate2(regDate),
    sleep_update: formatDate2(updateDate)
  };
  demoData.sleepRecords.record.push(record);
}

const builder = new Builder();
const xml = builder.buildObject(demoData);

// 파일이 존재하는지 확인 후 삭제
if (existsSync(filePath)) {
  console.log("Deleting existing sleepRecords.xml");
  unlinkSync(filePath);
}

// 파일 쓰기
writeFile(filePath, xml, (err) => {
  if (err) {
    console.error("Error writing XML to file:", err);
  } else {
    console.log("Successfully wrote XML to sleepRecords.xml");
  }
});