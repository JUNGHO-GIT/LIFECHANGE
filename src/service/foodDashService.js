// foodDashService.js

import * as repository from "../repository/foodDashRepository.js";
import {intFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../assets/js/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  customer_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.barToday.listPlan(
    customer_id_param, startDt, endDt
  );

  findReal = await repository.barToday.listReal(
    customer_id_param, startDt, endDt
  );

  finalResult = [
    {
      name: "칼로리",
      목표: intFormat(findPlan?.[0]?.food_plan_kcal),
      실제: intFormat(findReal?.[0]?.food_total_kcal)
    },
    {
      name: "탄수화물",
      목표: intFormat(findPlan?.[0]?.food_plan_carb),
      실제: intFormat(findReal?.[0]?.food_total_carb)
    },
    {
      name: "단백질",
      목표: intFormat(findPlan?.[0]?.food_plan_protein),
      실제: intFormat(findReal?.[0]?.food_total_protein)
    },
    {
      name: "지방",
      목표: intFormat(findPlan?.[0]?.food_plan_fat),
      실제: intFormat(findReal?.[0]?.food_total_fat)
    }
  ];

  return finalResult;
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = async (
  customer_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieToday.listKcal(
    customer_id_param, startDt, endDt
  );
  // carb, protein, fat
  findResultNut = await repository.pieToday.listNut(
    customer_id_param, startDt, endDt
  );

  console.log("===================================");
  console.log("findResultKcal : " + JSON.stringify(findResultKcal, null, 2));

  console.log("===================================");
  console.log("findResultNut : " + JSON.stringify(findResultNut, null, 2));

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // carb, protein, fat
  finalResultNut = findResultNut.map((item) => [
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

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieWeek.listKcal(
    customer_id_param, startDt, endDt
  );
  // carb, protein, fat
  findResultNut = await repository.pieWeek.listNut(
    customer_id_param, startDt, endDt
  );

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // carb, protein, fat
  finalResultNut = findResultNut.map((item) => [
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

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieMonth.listKcal(
    customer_id_param, startDt, endDt
  );
  // carb, protein, fat
  findResultNut = await repository.pieMonth.listNut(
    customer_id_param, startDt, endDt
  );

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // carb, protein, fat
  finalResultNut = findResultNut.map((item) => [
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

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  // ex 월 (00-00)
  const data = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("dd (MM-DD)");
  });

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.lineWeek.listKcal(
    customer_id_param, startDt, endDt
  );
  // carb, protein, fat
  findResultNut = await repository.lineWeek.listNut(
    customer_id_param, startDt, endDt
  );

  data.forEach((data, index) => {
    const findIndexKcal = findResultKcal.findIndex((item) => item._id === data);
    const findIndexNut = findResultNut.findIndex((item) => item._id === data);

    finalResultKcal.push({
      name: data,
      칼로리: intFormat(findIndexKcal !== -1 ? findResultKcal[findIndexKcal].value : 0)
    });
    finalResultNut.push({
      name: data,
      탄수화물: intFormat(findIndexNut !== -1 ? findResultNut[findIndexNut].food_total_carb : 0),
      단백질: intFormat(findIndexNut !== -1 ? findResultNut[findIndexNut].food_total_protein : 0),
      지방: intFormat(findIndexNut !== -1 ? findResultNut[findIndexNut].food_total_fat : 0)
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  const data = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}일`;
  });

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.lineMonth.listKcal(
    customer_id_param, startDt, endDt
  );
  // carb, protein, fat
  findResultNut = await repository.lineMonth.listNut(
    customer_id_param, startDt, endDt
  );

  data.forEach((data, index) => {
    const findIndexKcal = findResultKcal.findIndex((item) => (
      new Date(item._id).getDate() === index + 1
    ));
    const findIndexNut = findResultNut.findIndex((item) => (
      new Date(item._id).getDate() === index + 1
    ));

    finalResultKcal.push({
      name: data,
      칼로리: intFormat(findIndexKcal !== -1 ? findResultKcal[findIndexKcal].value : 0)
    });
    finalResultNut.push({
      name: data,
      탄수화물: intFormat(findIndexNut !== -1 ? findResultNut[findIndexNut].food_total_carb : 0),
      단백질: intFormat(findIndexNut !== -1 ? findResultNut[findIndexNut].food_total_protein : 0),
      지방: intFormat(findIndexNut !== -1 ? findResultNut[findIndexNut].food_total_fat : 0)
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 4-1. dash (avg-week) --------------------------------------------------------------------------->
export const avgWeek = async (
  customer_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  const data = Array.from({ length: 5 }, (_, i) => {
    const weekStart = curWeekStart.clone().add(i * 7, 'days').format("MM-DD");
    const weekEnd = curWeekStart.clone().add((i + 1) * 7 - 1, 'days').format("MM-DD");
    return `${i + 1}주차 (${weekStart} ~ ${weekEnd})`;
  });

  let sumKcal = Array(5).fill(0);
  let sumCarb = Array(5).fill(0);
  let sumProtein = Array(5).fill(0);
  let sumFat = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.avgWeek.listKcal(
    customer_id_param, startDt, endDt
  );
  // carb, protein, fat
  findResultNut = await repository.avgWeek.listNut(
    customer_id_param, startDt, endDt
  );

  findResultKcal.forEach((item) => {
    const weekNum = Math.floor(new Date(item._id).getDate() / 7);
    sumKcal[weekNum] += intFormat(item.value);
    countRecords[weekNum]++;
  });

  findResultNut.forEach((item) => {
    const weekNum = Math.floor(new Date(item._id).getDate() / 7);
    sumCarb[weekNum] += intFormat(item.food_total_carb);
    sumProtein[weekNum] += intFormat(item.food_total_protein);
    sumFat[weekNum] += intFormat(item.food_total_fat);
  });

  data.forEach((data, index) => {
    finalResultKcal.push({
      name: data,
      칼로리: intFormat(sumKcal[index] / countRecords[index])
    });
    finalResultNut.push({
      name: data,
      탄수화물: intFormat(sumCarb[index] / countRecords[index]),
      단백질: intFormat(sumProtein[index] / countRecords[index]),
      지방: intFormat(sumFat[index] / countRecords[index])
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 4-2. dash (avg-month) -------------------------------------------------------------------------->
export const avgMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  const data = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}일`;
  });

  let sumKcal = Array(curMonthEnd.date()).fill(0);
  let sumCarb = Array(curMonthEnd.date()).fill(0);
  let sumProtein = Array(curMonthEnd.date()).fill(0);
  let sumFat = Array(curMonthEnd.date()).fill(0);
  let countRecords = Array(curMonthEnd.date()).fill(0);

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.avgMonth.listKcal(
    customer_id_param, startDt, endDt
  );
  // carb, protein, fat
  findResultNut = await repository.avgMonth.listNut(
    customer_id_param, startDt, endDt
  );

  findResultKcal.forEach((item) => {
    const dayNum = new Date(item._id).getDate() - 1;
    sumKcal[dayNum] += intFormat(item.value);
    countRecords[dayNum]++;
  });

  findResultNut.forEach((item) => {
    const dayNum = new Date(item._id).getDate() - 1;
    sumCarb[dayNum] += intFormat(item.food_total_carb);
    sumProtein[dayNum] += intFormat(item.food_total_protein);
    sumFat[dayNum] += intFormat(item.food_total_fat);
  });

  data.forEach((data, index) => {
    finalResultKcal.push({
      name: data,
      칼로리: intFormat(sumKcal[index] / countRecords[index])
    });
    finalResultNut.push({
      name: data,
      탄수화물: intFormat(sumCarb[index] / countRecords[index]),
      단백질: intFormat(sumProtein[index] / countRecords[index]),
      지방: intFormat(sumFat[index] / countRecords[index])
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};
