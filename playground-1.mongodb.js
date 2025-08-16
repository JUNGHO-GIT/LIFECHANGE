use("LIFECHANGE_TEST");


db.sleep.insertMany([
  // 2024년 1월 데이터
  {
    user_id: `junghomun00@gmail.com`,
    sleep_number: 1,
    sleep_dateType: `day`,
    sleep_dateStart: `2024-01-01`,
    sleep_dateEnd: `2024-01-01`,
    sleep_section: [{
      sleep_bedTime: `23:30`,
      sleep_wakeTime: `07:00`,
      sleep_sleepTime: `07:30`
    }],
    sleep_regDt: new Date(`2024-01-01T23:30:00`),
    sleep_updateDt: new Date(`2024-01-01T23:30:00`)
  },
  {
    user_id: `junghomun00@gmail.com`,
    sleep_number: 2,
    sleep_dateType: `day`,
    sleep_dateStart: `2024-01-02`,
    sleep_dateEnd: `2024-01-02`,
    sleep_section: [{
      sleep_bedTime: `23:45`,
      sleep_wakeTime: `07:15`,
      sleep_sleepTime: `07:30`
    }],
    sleep_regDt: new Date(`2024-01-02T23:45:00`),
    sleep_updateDt: new Date(`2024-01-02T23:45:00`)
  },
  {
    user_id: `junghomun00@gmail.com`,
    sleep_number: 3,
    sleep_dateType: `day`,
    sleep_dateStart: `2024-01-03`,
    sleep_dateEnd: `2024-01-03`,
    sleep_section: [{
      sleep_bedTime: `00:15`,
      sleep_wakeTime: `07:45`,
      sleep_sleepTime: `07:30`
    }],
    sleep_regDt: new Date(`2024-01-03T00:15:00`),
    sleep_updateDt: new Date(`2024-01-03T00:15:00`)
  },
  {
    user_id: `junghomun00@gmail.com`,
    sleep_number: 4,
    sleep_dateType: `day`,
    sleep_dateStart: `2024-01-04`,
    sleep_dateEnd: `2024-01-04`,
    sleep_section: [{
      sleep_bedTime: `23:00`,
      sleep_wakeTime: `06:30`,
      sleep_sleepTime: `07:30`
    }],
    sleep_regDt: new Date(`2024-01-04T23:00:00`),
    sleep_updateDt: new Date(`2024-01-04T23:00:00`)
  },
  {
    user_id: `junghomun00@gmail.com`,
    sleep_number: 5,
    sleep_dateType: `day`,
    sleep_dateStart: `2024-01-05`,
    sleep_dateEnd: `2024-01-05`,
    sleep_section: [{
      sleep_bedTime: `00:30`,
      sleep_wakeTime: `08:30`,
      sleep_sleepTime: `08:00`
    }],
    sleep_regDt: new Date(`2024-01-05T00:30:00`),
    sleep_updateDt: new Date(`2024-01-05T00:30:00`)
  },
  {
    user_id: `junghomun00@gmail.com`,
    sleep_number: 6,
    sleep_dateType: `week`,
    sleep_dateStart: `2024-01-08`,
    sleep_dateEnd: `2024-01-14`,
    sleep_section: [
      {
        sleep_bedTime: `23:30`,
        sleep_wakeTime: `07:00`,
        sleep_sleepTime: `07:30`
      },
      {
        sleep_bedTime: `23:45`,
        sleep_wakeTime: `07:15`,
        sleep_sleepTime: `07:30`
      }
    ],
    sleep_regDt: new Date(`2024-01-08T00:00:00`),
    sleep_updateDt: new Date(`2024-01-14T23:59:00`)
  },
  // 나머지 94개 데이터를 다양한 패턴으로 생성
  ...Array.from({ length: 94 }, (_, i) => {
    const date = new Date(2024, 0, 15 + Math.floor(i / 3));
    const dateStr = date.toISOString().split('T')[0];
    const bedHour = 22 + Math.floor(Math.random() * 3);
    const bedMinute = Math.floor(Math.random() * 60);
    const wakeHour = 6 + Math.floor(Math.random() * 3);
    const wakeMinute = Math.floor(Math.random() * 60);

    return {
      user_id: `junghomun00@gmail.com`,
      sleep_number: 7 + i,
      sleep_dateType: i % 10 === 0 ? `week` : `day`,
      sleep_dateStart: dateStr,
      sleep_dateEnd: i % 10 === 0 ? new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : dateStr,
      sleep_section: [{
        sleep_bedTime: `${String(bedHour).padStart(2, '0')}:${String(bedMinute).padStart(2, '0')}`,
        sleep_wakeTime: `${String(wakeHour).padStart(2, '0')}:${String(wakeMinute).padStart(2, '0')}`,
        sleep_sleepTime: `${String(7 + Math.floor(Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      }],
      sleep_regDt: date,
      sleep_updateDt: date
    };
  })
]);