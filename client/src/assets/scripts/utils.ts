// utils.js

// 1-1. number -------------------------------------------------------------------------------------
export const randomNumber = (data: number) => {
  return Math.floor(Math.random() * data);
};

// 1-2. time ---------------------------------------------------------------------------------------
export const randomTime = () => {
  const hour = Math.floor(Math.random() * 23).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

// 1-3. date ---------------------------------------------------------------------------------------
export const calcDate = (startTime: string, endTime: string) => {
  const start = new Date(`1970/01/01 ${startTime}`);
  const end = new Date(`1970/01/01 ${endTime}`);
  const duration = new Date(Number(end) - Number(start) + 24 * 60 * 60 * 1000);
  return `${duration.getHours().toString().padStart(2, '0')}:${duration.getMinutes().toString().padStart(2, '0')}`;
};

// 1-4. decimal ------------------------------------------------------------------------------------
export const strToDecimal = (time: string) => {
  if (!time) {
    return 0;
  }
  const [hours, minutes] = time.split(":").map(Number);
  const adjustedHours = hours + Math.floor(minutes / 60);
  const adjustedMinutes = minutes % 60;

  return adjustedHours + adjustedMinutes / 60;
};

// 1-5. decimal ------------------------------------------------------------------------------------
export const decimalToStr = (time: number) => {
  if (time === null || time === undefined) {
    return "00:00";
  }
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  const adjustedHours = hours + Math.floor(minutes / 60);
  const adjustedMinutes = minutes % 60;

  return `${String(adjustedHours).padStart(2, "0")}:${String(adjustedMinutes).padStart(2, "0")}`;
};

// -------------------------------------------------------------------------------------------------
export const insertComma = (str: string | number) => {
  try {
    // 만약 number 형식이면 string 으로 변환
    if (typeof str === "number") {
      str = str.toString();
    }
    // 변환이 실패하면 그대로 반환
    if (isNaN(Number(str))) {
      return str;
    }

    // 맨 앞에 + 또는 - 기호가 있는 경우 제거하고 부호를 기억
    const isNegative = str.charAt(0) === "-";
    if (isNegative) {
      str = str.slice(1);
    }

    // 소수점 이하 포함하여 문자열로 변환 후 3자리마다 콤마 추가
    const [integerPart, decimalPart] = str.split(".");
    const formattedNum = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 최종 반환 문자열 구성 (소수점 이하가 있는 경우 포함)
    return (
      (isNegative ? "-" : "") + formattedNum + (decimalPart ? `.${decimalPart}`: "")
    );
  }
  catch (error) {
    console.error("insertComma error", error);
  }
};
