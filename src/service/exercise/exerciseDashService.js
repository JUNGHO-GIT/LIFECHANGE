// exerciseDashService.js

import * as repository from "../../repository/exercise/exerciseDashRepository.js";
import {intFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../../assets/js/date.js";

// 1-1. dash (scatter - Today) -------------------------------------------------------------------->
export const scatterToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.scatterToday.listPlan(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.scatterToday.list(
    user_id_param, dateStart, dateEnd
  );

  finalResult = [
    {
      name: "체중",
      목표: intFormat(findPlan?.[0]?.exercise_plan_weight),
      실제: intFormat(findReal?.[0]?.exercise_body_weight)
    }
  ];

  return finalResult;
};

// 1-2. dash (scatter - week) --------------------------------------------------------------------->
export const scatterWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.scatterWeek.listPlan(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.scatterWeek.list(
    user_id_param, dateStart, dateEnd
  );

  finalResult = [
    {
      name: "체중",
      목표: intFormat(findPlan?.[0]?.exercise_plan_weight),
      실제: intFormat(findReal?.[0]?.exercise_body_weight)
    }
  ];

  return finalResult;
};

// 1-3. dash (scatter - month) -------------------------------------------------------------------->
export const scatterMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.scatterMonth.listPlan(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.scatterMonth.list(
    user_id_param, dateStart, dateEnd
  );

  finalResult = [
    {
      name: "체중",
      목표: intFormat(findPlan?.[0]?.exercise_plan_weight),
      실제: intFormat(findReal?.[0]?.exercise_body_weight)
    }
  ];

  return finalResult;
};

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
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
    name: item._id,
    value: intFormat(item.count)
  }));
  // title
  finalResultTitle = findResultTitle?.map((item) => ({
    name: item._id,
    value: intFormat(item.count)
  }));

  return {
    part: finalResultPart,
    title: finalResultTitle,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-2. dash (pie - month) ------------------------------------------------------------------------>
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
    name: item._id,
    value: intFormat(item.count)
  }));
  // title
  finalResultTitle = findResultTitle?.map((item) => ({
    name: item._id,
    value: intFormat(item.count)
  }));

  return {
    part: finalResultPart,
    title: finalResultTitle,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // ex 월
  const name = [
    "월", "화", "수", "목", "금", "토", "일"
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

  name.forEach((data, index) => {
    const findIndexVolume = findResultVolume?.findIndex((item) => (
      new Date(item.exercise_dateStart).getDate() === index
    ));
    const findIndexCardio = findResultCardio?.findIndex((item) => (
      new Date(item.exercise_dateStart).getDate() === index
    ));
    finalResultVolume.push({
      name: data,
      date: date[index],
      볼륨: findIndexVolume !== -1 ? intFormat(findResultVolume[findIndexVolume]?.exercise_total_volume) : 0
    });
    finalResultCardio.push({
      name: data,
      date: date[index],
      시간: findIndexCardio !== -1 ? intFormat(findResultCardio[findIndexCardio]?.exercise_total_cardio) : 0
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}일`;
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

  name.forEach((data, index) => {
    const findIndexVolume = findResultVolume.findIndex((item) => (
      new Date(item.exercise_dateStart).getDate() === index + 1
    ));
    const findIndexCardio = findResultCardio.findIndex((item) => (
      new Date(item.exercise_dateStart).getDate() === index + 1
    ));

    finalResultVolume.push({
      name: data,
      date: date[index],
      볼륨: findIndexVolume !== -1 ? intFormat(findResultVolume[findIndexVolume]?.exercise_total_volume) : 0
    });
    finalResultCardio.push({
      name: data,
      date: date[index],
      시간: findIndexCardio !== -1 ? intFormat(findResultCardio[findIndexCardio]?.exercise_total_cardio) : 0
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-1. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `${i + 1}주차`;
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
    const diffTime = Math.abs(exerciseDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumVolume[weekNum] += intFormat(item.exercise_total_volume);
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
      sumCardio[weekNum] += intFormat(item.exercise_total_cardio);
      countRecords[weekNum]++;
    }
  });

  name.forEach((data, index) => {
    finalResultVolume.push({
      name: data,
      date: date[index],
      볼륨: intFormat(sumVolume[index] / countRecords[index])
    });
    finalResultCardio.push({
      name: data,
      date: date[index],
      시간: intFormat(sumCardio[index] / countRecords[index])
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = async (
  user_id_param
) => {

  const dateStart = curYearStart.format("YYYY-MM-DD");
  const dateEnd = curYearEnd.format("YYYY-MM-DD");

  // ex. 00월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `${i + 1}월`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    return `${curMonthStart.clone().add(i, 'months').format("MM-DD")} ~ ${curMonthEnd.clone().add(i, 'months').format("MM-DD")}`;
  });

  let sumVolume = Array(12).fill(0);
  let sumCardio = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.avgYear.listVolume(
    user_id_param, dateStart, dateEnd
  );
  // cardio
  findResultCardio = await repository.avgYear.listCardio(
    user_id_param, dateStart, dateEnd
  );

  // volume
  findResultVolume.forEach((item) => {
    const exerciseDate = new Date(item.exercise_dateStart);
    const monthNum = exerciseDate.getMonth();
    sumVolume[monthNum] += intFormat(item.exercise_total_volume);
    countRecords[monthNum]++;
  });
  // cardio
  findResultCardio.forEach((item) => {
    const exerciseDate = new Date(item.exercise_dateStart);
    const monthNum = exerciseDate.getMonth();
    sumCardio[monthNum] += intFormat(item.exercise_total_cardio);
    countRecords[monthNum]++;
  });

  name.forEach((data, index) => {
    finalResultVolume.push({
      name: data,
      date: date[index],
      볼륨: intFormat(sumVolume[index] / countRecords[index])
    });
    finalResultCardio.push({
      name: data,
      date: date[index],
      시간: intFormat(sumCardio[index] / countRecords[index])
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};