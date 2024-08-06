// exerciseChartService.js

import * as repository from "../../repository/exercise/exerciseChartRepository.js";
import {timeToDecimal} from "../../assets/js/utils.js";
import {newDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. chart (bar - Today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param
) => {

  const dateStart = newDate.format("YYYY-MM-DD");
  const dateEnd = newDate.format("YYYY-MM-DD");

  let findGoal = [];
  let findReal = [];
  let finalResult = [];

  findGoal = await repository.barToday.listGoal(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barToday.list(
    user_id_param, dateStart, dateEnd
  );

  finalResult = [
    {
      name: "weight",
      date: dateStart,
      goal: String(findGoal?.[0]?.exercise_goal_weight || "0"),
      real: String(findReal?.[0]?.exercise_body_weight || "0")
    }
  ];

  return finalResult;
};

// 1-2. chart (bar - week) -------------------------------------------------------------------------
export const barWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // ex mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  let findGoal = [];
  let findReal = [];
  let finalResult = [];

  findGoal = await repository.barWeek.listGoal(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barWeek.list(
    user_id_param, dateStart, dateEnd
  );

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndexGoal = findGoal?.findIndex((item) => (
      new Date(item.exercise_goal_dateStart).getDay() === index + 1
    ));
    const findIndexReal = findReal?.findIndex((item) => (
      new Date(item.exercise_dateStart).getDay() === index + 1
    ));
    finalResult.push({
      name: data,
      date: date[index],
      goal:
        findIndexGoal !== -1
        ? String(findGoal[findIndexGoal]?.exercise_goal_weight)
        : "0",
      real:
        findIndexReal !== -1
        ? String(findReal[findIndexReal]?.exercise_body_weight)
        : "0"
    });
  });

  return finalResult;
};

// 1-3. chart (bar - month) ------------------------------------------------------------------------
export const barMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}`;
  });

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  let findGoal = [];
  let findReal = [];
  let finalResult = [];

  findGoal = await repository.barMonth.listGoal(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barMonth.list(
    user_id_param, dateStart, dateEnd
  );

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndexGoal = findGoal?.findIndex((item) => (
      new Date(item.exercise_goal_dateStart).getDate() === index
    ));
    const findIndexReal = findReal?.findIndex((item) => (
      new Date(item.exercise_dateStart).getDate() === index
    ));
    finalResult.push({
      name: data,
      date: date[index],
      goal:
        findIndexGoal !== -1
        ? String(findGoal[findIndexGoal]?.exercise_goal_weight)
        : "0",
      real:
        findIndexReal !== -1
        ? String(findReal[findIndexReal]?.exercise_body_weight)
        : "0"
    });
  });

  return finalResult;
};

// 2-1. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let findResultPart = [];
  let findResultTitle = [];
  let finalResultPart = [];
  let finalResultTitle = [];

  // part
  findResultPart = await repository.pieWeek.listPart(
    user_id_param, dateStart, dateEnd
  );
  // title
  findResultTitle = await repository.pieWeek.listTitle(
    user_id_param, dateStart, dateEnd
  );

  // part
  finalResultPart = findResultPart?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));
  // title
  finalResultTitle = findResultTitle?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));

  return {
    part: finalResultPart,
    title: finalResultTitle,
  };
};

// 2-2. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let findResultPart = [];
  let findResultTitle = [];
  let finalResultPart = [];
  let finalResultTitle = [];

  // part
  findResultPart = await repository.pieMonth.listPart(
    user_id_param, dateStart, dateEnd
  );
  // title
  findResultTitle = await repository.pieMonth.listTitle(
    user_id_param, dateStart, dateEnd
  );

  // part
  finalResultPart = findResultPart?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));
  // title
  finalResultTitle = findResultTitle?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));

  return {
    part: finalResultPart,
    title: finalResultTitle,
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // ex mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.lineWeek.listVolume(
    user_id_param, dateStart, dateEnd
  );
  // cardio
  findResultCardio = await repository.lineWeek.listCardio(
    user_id_param, dateStart, dateEnd
  );

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndexVolume = findResultVolume?.findIndex((item) => (
      new Date(item.exercise_dateStart).getDay() === index + 1
    ));
    const findIndexCardio = findResultCardio?.findIndex((item) => (
      new Date(item.exercise_dateStart).getDay() === index + 1
    ));
    finalResultVolume.push({
      name: data,
      date: date[index],
      volume:
        findIndexVolume !== -1
        ? String(findResultVolume[findIndexVolume]?.exercise_total_volume)
        : "0"
    });
    finalResultCardio.push({
      name: data,
      date: date[index],
      cardio:
        findIndexCardio !== -1
        ? String(timeToDecimal(findResultCardio[findIndexCardio]?.exercise_total_cardio))
        : "0"
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}`;
  });

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.lineMonth.listVolume(
    user_id_param, dateStart, dateEnd
  );
  // cardio
  findResultCardio = await repository.lineMonth.listCardio(
    user_id_param, dateStart, dateEnd
  );

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndexVolume = findResultVolume.findIndex((item) => (
      new Date(item.exercise_dateStart).getDate() === index
    ));
    const findIndexCardio = findResultCardio.findIndex((item) => (
      new Date(item.exercise_dateStart).getDate() === index
    ));

    finalResultVolume.push({
      name: data,
      date: date[index],
      volume:
        findIndexVolume !== -1
        ? String(findResultVolume[findIndexVolume]?.exercise_total_volume)
        : "0"
    });
    finalResultCardio.push({
      name: data,
      date: date[index],
      cardio:
        findIndexCardio !== -1
        ? String(timeToDecimal(findResultCardio[findIndexCardio]?.exercise_total_cardio))
        : "0"
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-1. chart (avg - week) -------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `week${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    return `${curMonthStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curMonthStart.clone().add(i * 7 + 6, 'days').format("MM-DD")}`;
  });

  let sumVolume = Array(5).fill(0);
  let sumCardio = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.avgWeek.listVolume(
    user_id_param, dateStart, dateEnd
  );
  // cardio
  findResultCardio = await repository.avgWeek.listCardio(
    user_id_param, dateStart, dateEnd
  );

  // volume
  findResultVolume.forEach((item) => {
    const exerciseDate = new Date(item.exercise_dateStart);
    const diffTime = Math.abs(exerciseDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumVolume[weekNum] += Number(item.exercise_total_volume || "0");
      countRecords[weekNum]++;
    }
  });

  // cardio
  findResultCardio.forEach((item) => {
    const exerciseDate = new Date(item.exercise_dateStart);
    const diffTime = Math.abs(exerciseDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumCardio[weekNum] += Number(timeToDecimal(item.exercise_total_cardio) || "0");
      countRecords[weekNum]++;
    }
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResultVolume.push({
      name: data,
      date: date[index],
      volume:
        countRecords[index] > 0
        ? String((sumVolume[index] / countRecords[index]).toFixed(2))
        : "0",
    });
    finalResultCardio.push({
      name: data,
      date: date[index],
      cardio:
        countRecords[index] > 0
        ? String(timeToDecimal(sumCardio[index] / countRecords[index]))
        : "0",
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-2. chart (avg - month) ---------------------------------------------------------------------
export const avgMonth = async (
  user_id_param
) => {

  const dateStart = curYearStart.format("YYYY-MM-DD");
  const dateEnd = curYearEnd.format("YYYY-MM-DD");

  // ex. 00월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `month${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = curYearStart.clone().add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = curYearStart.clone().add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} ~ ${endOfMonth}`;
  });

  let sumVolume = Array(12).fill(0);
  let sumCardio = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.avgMonth.listVolume(
    user_id_param, dateStart, dateEnd
  );
  // cardio
  findResultCardio = await repository.avgMonth.listCardio(
    user_id_param, dateStart, dateEnd
  );

  // volume
  findResultVolume.forEach((item) => {
    const exerciseDate = new Date(item.exercise_dateStart);
    const monthNum = exerciseDate.getMonth();
    if (monthNum >= 0 && monthNum < 12) {
      sumVolume[monthNum] += Number(item.exercise_total_volume || "0");
      countRecords[monthNum]++;
    }
  });
  // cardio
  findResultCardio.forEach((item) => {
    const exerciseDate = new Date(item.exercise_dateStart);
    const monthNum = exerciseDate.getMonth();
    if (monthNum >= 0 && monthNum < 12) {
      sumCardio[monthNum] += Number(timeToDecimal(item.exercise_total_cardio) || "0");
      countRecords[monthNum]++;
    }
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResultVolume.push({
      name: data,
      date: date[index],
      volume:
        countRecords[index] > 0
        ? String((sumVolume[index] / countRecords[index]).toFixed(2))
        : "0",
    });
    finalResultCardio.push({
      name: data,
      date: date[index],
      cardio:
        countRecords[index] > 0
        ? String(timeToDecimal(sumCardio[index] / countRecords[index]))
        : "0",
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};