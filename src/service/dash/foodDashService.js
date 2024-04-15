// foodDashService.js

import moment from "moment";
import * as repo from "../../repository/dash/foodDashRepo.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek");
const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek");
const curMonthStart = moment().tz("Asia/Seoul").startOf("month");
const curMonthEnd = moment().tz("Asia/Seoul").endOf("month");

// 0-2. format ------------------------------------------------------------------------------------>
const intFormat = (data) => {
  if (!data) {
    return 0;
  }
  else if (typeof data === "string") {
    const toInt = parseInt(data, 10);
    return Math.round(toInt);
  }
  else {
    return Math.round(data);
  }
};

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
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

  const findResultPlan = await repo.detailPlan(
    "", user_id_param, koreanDate, koreanDate
  );
  const findResultReal = await repo.detailReal(
    "", user_id_param, koreanDate, koreanDate
  );

  for (let key in dataKcal) {
    finalResultKcal.push({
      name: key,
      목표: intFormat(findResultPlan?.[dataKcal[key].plan]),
      실제: intFormat(findResultReal?.[dataKcal[key].real])
    });
  };
  for (let key in dataNut) {
    finalResultNut.push({
      name: key,
      목표: intFormat(findResultPlan?.[dataNut[key].plan]),
      실제: intFormat(findResultReal?.[dataNut[key].real])
    });
  };

  return {
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 0-2. dash (pie) -------------------------------------------------------------------------------->
export const dashPie = async (
  user_id_param
) => {

  // kcal
  const findResultKcal = await repo.aggregateKcal(
    user_id_param, koreanDate, koreanDate
  );

  // carb, protein, fat
  const findResultNut = await repo.aggregateNut(
    user_id_param, koreanDate, koreanDate
  );

  const finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  const finalResultNut = findResultNut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 0-3. dash (line) ------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
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
    const findResult = await repo.detailReal(
      "", user_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
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
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 0-4. dash (avg-week) --------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
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
      const findResult = await repo.detailReal(
        "", user_id_param, week.format("YYYY-MM-DD"), week.format("YYYY-MM-DD")
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
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 0-4. dash (avg-month) -------------------------------------------------------------------------->
export const dashAvgMonth = async (
  user_id_param
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
    let month = curMonthStart.clone();
    month.isBefore(curMonthEnd);
    month.add(1, "days")
  ) {
    const monthNum = month.month();

    const findResult = await repo.detailReal(
      "", user_id_param, month.format("YYYY-MM-DD"), month.format("YYYY-MM-DD")
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
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};