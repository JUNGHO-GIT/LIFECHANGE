// foodDashService.js

import * as repository from "../repository/foodDashRepository.js";
import {intFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../assets/common/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  customer_id_param
) => {

  const dataKcal = {
    "칼로리": {
      plan: "food_plan_kcal",
      real: "food_total_kcal"
    }
  };
  const dataNut = {
    "탄수화물": {
      plan: "food_plan_carb",
      real: "food_total_carb"
    },
    "단백질": {
      plan: "food_plan_protein",
      real: "food_total_protein"
    },
    "지방": {
      plan: "food_plan_fat",
      real: "food_total_fat"
    },
  };

  // kcal
  let finalResultKcal = [];

  // carb, protein, fat
  let finalResultNut = [];

  const findPlan = await repository.barToday.findPlan(
    "", customer_id_param, koreanDate, koreanDate
  );
  const findReal = await repository.barToday.findReal(
    "", customer_id_param, koreanDate, koreanDate
  );

  for (let key in dataKcal) {
    finalResultKcal.push({
      name: key,
      목표: intFormat(findPlan?.[dataKcal[key].plan]),
      실제: intFormat(findReal?.[dataKcal[key].real])
    });
  };
  for (let key in dataNut) {
    finalResultNut.push({
      name: key,
      목표: intFormat(findPlan?.[dataNut[key].plan]),
      실제: intFormat(findReal?.[dataNut[key].real])
    });
  };

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = async (
  customer_id_param
) => {

  // kcal
  const findResultKcal = await repository.pieToday.findKcal(
    customer_id_param, koreanDate, koreanDate
  );

  // carb, protein, fat
  const findResultNut = await repository.pieToday.findNut(
    customer_id_param, koreanDate, koreanDate
  );

  const finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  const finalResultNut = findResultNut.map((item) => [
    {name: "탄수화물", value: intFormat(item.food_total_carb)},
    {name: "단백질", value: intFormat(item.food_total_protein)},
    {name: "지방", value: intFormat(item.food_total_fat)}
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 2-2. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  customer_id_param
) => {

  // kcal
  const findResultKcal = await repository.pieWeek.findKcal(
    customer_id_param, curWeekStart.format("YYYY-MM-DD"), curWeekEnd.format("YYYY-MM-DD")
  );

  // carb, protein, fat
  const findResultNut = await repository.pieWeek.findNut(
    customer_id_param, curWeekStart.format("YYYY-MM-DD"), curWeekEnd.format("YYYY-MM-DD")
  );

  const finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  const finalResultNut = findResultNut.map((item) => [
    {name: "탄수화물", value: intFormat(item.food_total_carb)},
    {name: "단백질", value: intFormat(item.food_total_protein)},
    {name: "지방", value: intFormat(item.food_total_fat)}
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  customer_id_param
) => {

  // kcal
  const findResultKcal = await repository.pieMonth.findKcal(
    customer_id_param, curMonthStart.format("YYYY-MM-DD"), curMonthEnd.format("YYYY-MM-DD")
  );

  // carb, protein, fat
  const findResultNut = await repository.pieMonth.findNut(
    customer_id_param, curMonthStart.format("YYYY-MM-DD"), curMonthEnd.format("YYYY-MM-DD")
  );

  const finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  const finalResultNut = findResultNut.map((item) => [
    {name: "탄수화물", value: intFormat(item.food_total_carb)},
    {name: "단백질", value: intFormat(item.food_total_protein)},
    {name: "지방", value: intFormat(item.food_total_fat)}
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = async (
  customer_id_param
) => {

  const data = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  // kcal
  let finalResultKcal = [];

  // carb, protein, fat
  let finalResultNut = [];

  for (let i = 0; i < 7; i++) {
    const dayNum = curWeekStart.clone().day(i);
    const findResult = await repository.lineWeek.find(
      "", customer_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResultKcal.push({
      name: `${data[i]} ${dayNum.format("MM-DD")}`,
      칼로리: intFormat(findResult?.food_total_kcal)
    });

    finalResultNut.push({
      name: `${data[i]} ${dayNum.format("MM-DD")}`,
      탄수화물: intFormat(findResult?.food_total_carb),
      단백질: intFormat(findResult?.food_total_protein),
      지방: intFormat(findResult?.food_total_fat),
    });
  };

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  customer_id_param
) => {

  const data = [
    "1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일",
    "11일", "12일", "13일", "14일", "15일", "16일", "17일", "18일", "19일", "20일",
    "21일", "22일", "23일", "24일", "25일", "26일", "27일", "28일", "29일", "30일", "31일"
  ];

  // kcal
  let finalResultKcal = [];

  // carb, protein, fat
  let finalResultNut = [];

  for (
    let day = curMonthStart.clone();
    day.isBefore(curMonthEnd);
    day.add(1, "days")
  ) {
    const findResult = await repository.lineMonth.find(
      "", customer_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    finalResultKcal.push({
      name: data[day.date() - 1],
      칼로리: intFormat(findResult?.food_total_kcal)
    });

    finalResultNut.push({
      name: data[day.date() - 1],
      탄수화물: intFormat(findResult?.food_total_carb),
      단백질: intFormat(findResult?.food_total_protein),
      지방: intFormat(findResult?.food_total_fat),
    });
  }

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 4-1. dash (avg-week) --------------------------------------------------------------------------->
export const avgWeek = async (
  customer_id_param
) => {

  let sumFoodKcal = Array(5).fill(0);
  let sumFoodCarb = Array(5).fill(0);
  let sumFoodProtein = Array(5).fill(0);
  let sumFoodFat = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const data = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  // kcal
  let finalResultKcal = [];

  // carb, protein, fat
  let finalResultNut = [];

  for (
    let week = curMonthStart.clone();
    week.isBefore(curMonthEnd);
    week.add(1, "days")
  ) {
    const weekNum = week.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await repository.avgWeek.find(
        "", customer_id_param, week.format("YYYY-MM-DD"), week.format("YYYY-MM-DD")
      );

      if (findResult) {
        sumFoodKcal[weekNum - 1] += intFormat(findResult?.food_total_kcal);
        sumFoodCarb[weekNum - 1] += intFormat(findResult?.food_total_carb);
        sumFoodProtein[weekNum - 1] += intFormat(findResult?.food_total_protein);
        sumFoodFat[weekNum - 1] += intFormat(findResult?.food_total_fat);
        countRecords[weekNum - 1]++;
      }
    }
  };

  for (let i = 0; i < 5; i++) {
    finalResultKcal.push({
      name: data[i],
      칼로리: intFormat(sumFoodKcal[i] / countRecords[i])
    });
    finalResultNut.push({
      name: data[i],
      탄수화물: intFormat(sumFoodCarb[i] / countRecords[i]),
      단백질: intFormat(sumFoodProtein[i] / countRecords[i]),
      지방: intFormat(sumFoodFat[i] / countRecords[i]),
    });
  };

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 4-2. dash (avg-month) -------------------------------------------------------------------------->
export const avgMonth = async (
  customer_id_param
) => {

  let sumFoodKcal = Array(12).fill(0);
  let sumFoodCarb = Array(12).fill(0);
  let sumFoodProtein = Array(12).fill(0);
  let sumFoodFat = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const data = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // kcal
  let finalResultKcal = [];

  // carb, protein, fat
  let finalResultNut = [];

  for (
    let month = curYearStart.clone();
    month.isBefore(curYearEnd);
    month.add(1, "days")
  ) {
    const monthNum = month.month();

    const findResult = await repository.avgMonth.find(
      "", customer_id_param, month.format("YYYY-MM-DD"), month.format("YYYY-MM-DD")
    );

    if (findResult) {
      sumFoodKcal[monthNum] += intFormat(findResult?.food_total_kcal);
      sumFoodCarb[monthNum] += intFormat(findResult?.food_total_carb);
      sumFoodProtein[monthNum] += intFormat(findResult?.food_total_protein);
      sumFoodFat[monthNum] += intFormat(findResult?.food_total_fat);
      countRecords[monthNum]++;
    }
  };

  for (let i = 0; i < 12; i++) {
    finalResultKcal.push({
      name: data[i],
      칼로리: intFormat(sumFoodKcal[i] / countRecords[i])
    });
    finalResultNut.push({
      name: data[i],
      탄수화물: intFormat(sumFoodCarb[i] / countRecords[i]),
      단백질: intFormat(sumFoodProtein[i] / countRecords[i]),
      지방: intFormat(sumFoodFat[i] / countRecords[i]),
    });
  };

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};