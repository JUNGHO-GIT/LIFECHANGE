// utils.ts

// 1-1. number -------------------------------------------------------------------------------------
export const randomNumber = (data: number) => {
  return Math.floor(Math.random() * data);
}
// 1-2. time ---------------------------------------------------------------------------------------
export const randomTime = () => {
  const hour = Math.floor(Math.random() * 23).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');

  return `${hour}:${minute}`;
}
// 1-3. date ---------------------------------------------------------------------------------------
export const calcDate = (startTime: string, endTime: string) => {
  const start = new Date(`1970/01/01 ${startTime}`);
  const end = new Date(`1970/01/01 ${endTime}`);
  const duration = new Date(Number(end) - Number(start) + 24 * 60 * 60 * 1000);

  return `${duration.getHours().toString().padStart(2, '0')}:${duration.getMinutes().toString().padStart(2, '0')}`;
}

// 1-2. format -------------------------------------------------------------------------------------
export const timeToDecimal = (data: string) => {
  if (!data || data === null || data === undefined) {
    return "0";
  }
  const time = data.split(":");
  if (time.length !== 2) {
    return "0";
  }
  else {
    const hours = parseFloat(time[0]);
    // 10분 단위로 반올림
    const minutes = Math.round(parseFloat(time[1]) / 10) * 10 / 60;

    return (hours + minutes).toFixed(1).toString();
  }
};

export const decimalToTime = (data: number) => {
  if (!data || isNaN(data) || data === null || data === undefined) {
    return "00:00";
  }
  const floatHours = parseFloat(data.toString());
  const hours = Math.floor(floatHours);
  // 10분 단위로 반올림
  const minutes = Math.round((floatHours - hours) * 60 / 10) * 10;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// 1-2. convert ------------------------------------------------------------------------------------
export const strToDecimal = (time: string) => {
  if (!time || time === null || time === undefined) {
    return 0;
  }
  const [hours, minutes] = time.split(":").map(Number);
  const adjustedHours = hours + Math.floor(minutes / 60);
  const adjustedMinutes = minutes % 60;

  return adjustedHours + adjustedMinutes / 60;
};

export const decimalToStr = (time: number) => {
  if (!time || isNaN(time) || time === null || time === undefined) {
    return "00:00";
  }
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  const adjustedHours = hours + Math.floor(minutes / 60);
  const adjustedMinutes = minutes % 60;

  return `${String(adjustedHours).padStart(2, "0")}:${String(adjustedMinutes).padStart(2, "0")}`;
};