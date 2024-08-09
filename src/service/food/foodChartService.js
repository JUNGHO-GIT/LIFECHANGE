// foodChartService.js

import * as repository from "../../repository/food/foodChartRepository.js";
import moment from "moment-timezone";
import {koreanDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findGoal = [];
  let findReal = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  findGoal = await repository.barToday.listGoal(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barToday.list(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  finalResultKcal = [
    {
      name: "kcal",
      date: dateStart,
      goal: String(findGoal?.[0]?.food_goal_kcal || "0"),
      real: String(findReal?.[0]?.food_total_kcal || "0")
    }
  ];

  // nut
  finalResultNut = [
    {
      name: "carb",
      date: dateStart,
      goal: String(findGoal?.[0]?.food_goal_carb || "0"),
      real: String(findReal?.[0]?.food_total_carb || "0")
    },
    {
      name: "protein",
      date: dateStart,
      goal: String(findGoal?.[0]?.food_goal_protein || "0"),
      real: String(findReal?.[0]?.food_total_protein || "0")
    },
    {
      name: "fat",
      date: dateStart,
      goal: String(findGoal?.[0]?.food_goal_fat || "0"),
      real: String(findReal?.[0]?.food_total_fat || "0")
    }
  ];

  return  {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 2-1. chart (pie - today) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieToday.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.pieToday.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));
  // nut
  finalResultNut = findResultNut.map((item) => [
    {
      name: String("carb"),
      value: Number(item.food_total_carb) || 0
    },
    {
      name: String("protein"),
      value: Number(item.food_total_protein) || 0
    },
    {
      name: String("fat"),
      value: Number(item.food_total_fat) || 0
    },
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut,
  };
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieWeek.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.pieWeek.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));
  // nut
  finalResultNut = findResultNut.map((item) => [
    {
      name: String("carb"),
      value: Number(item.food_total_carb) || 0
    },
    {
      name: String("protein"),
      value: Number(item.food_total_protein) || 0
    },
    {
      name: String("fat"),
      value: Number(item.food_total_fat) || 0
    },
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut,
  };
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieMonth.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.pieMonth.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));
  // nut
  finalResultNut = findResultNut.map((item) => [
    {
      name: String("carb"),
      value: Number(item.food_total_carb) || 0
    },
    {
      name: String("protein"),
      value: Number(item.food_total_protein) || 0
    },
    {
      name: String("fat"),
      value: Number(item.food_total_fat) || 0
    },
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut,
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

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.lineWeek.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.lineWeek.listNut(
    user_id_param, dateStart, dateEnd
  );

  name.forEach((data, index) => {
    const findIndexKcal = findResultKcal.findIndex((item) => (
      new Date(item.food_dateStart).getDay() === index + 1
    ));
    const findIndexNut = findResultNut.findIndex((item) => (
      new Date(item.food_dateStart).getDay() === index + 1
    ));
    finalResultKcal.push({
      name: data,
      date: date[index],
      kcal:
        findIndexKcal !== -1
        ? String(findResultKcal[findIndexKcal]?.food_total_kcal)
        : "0"
    });
    finalResultNut.push({
      name: data,
      date: date[index],
      carb:
        findIndexNut !== -1
        ? String(findResultNut[findIndexNut]?.food_total_carb)
        : "0",
      protein:
        findIndexNut !== -1
        ? String(findResultNut[findIndexNut]?.food_total_protein)
        : "0",
      fat:
        findIndexNut !== -1
        ? String(findResultNut[findIndexNut]?.food_total_fat)
        : "0",
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
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

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.lineMonth.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.lineMonth.listNut(
    user_id_param, dateStart, dateEnd
  );

  name.forEach((data, index) => {
    const findIndexKcal = findResultKcal.findIndex((item) => (
      new Date(item.food_dateStart).getDate() === index + 1
    ));
    const findIndexNut = findResultNut.findIndex((item) => (
      new Date(item.food_dateStart).getDate() === index + 1
    ));
    finalResultKcal.push({
      name: data,
      date: date[index],
      kcal:
        findIndexKcal !== -1
        ? String(findResultKcal[findIndexKcal]?.food_total_kcal)
        : "0"
    });
    finalResultNut.push({
      name: data,
      date: date[index],
      carb:
        findIndexNut !== -1
        ? String(findResultNut[findIndexNut]?.food_total_carb)
        : "0",
      protein:
        findIndexNut !== -1
        ? String(findResultNut[findIndexNut]?.food_total_protein)
        : "0",
      fat:
        findIndexNut !== -1
        ? String(findResultNut[findIndexNut]?.food_total_fat)
        : "0",
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 4-1. chart (avg - week) -------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param
) => {

  const dateStart = moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const dateEnd = moment(curMonthStart).tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");
  const weekStartDate = Array.from({ length: 5 }, (_, i) =>
    moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").add(i, 'weeks')
  );

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `week${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").add(i, 'weeks').format("MM-DD");
    const endOfWeek = moment(curMonthStart).tz("Asia/Seoul").endOf("isoWeek").add(i, 'weeks').format("MM-DD");
    return `${startOfWeek} ~ ${endOfWeek}`;
  });

  let sumKcal = Array(5).fill(0);
  let sumCarb = Array(5).fill(0);
  let sumProtein = Array(5).fill(0);
  let sumFat = Array(5).fill(0);
  let countRecordsKcal = Array(5).fill(0);
  let countRecordsNut = Array(5).fill(0);

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.avgWeek.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.avgWeek.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  findResultKcal.forEach((item) => {
    const startDate = moment(item.food_dateStart).tz("Asia/Seoul");
    weekStartDate.forEach((startOfWeek, index) => {
      const endOfWeek = startOfWeek.clone().endOf('isoWeek');
      if (startDate.isBetween(startOfWeek, endOfWeek, null, '[]')) {
        sumKcal[index] += Number(item.food_total_kcal || "0");
        countRecordsKcal[index]++;
      }
    });
  });

  // nut
  findResultNut.forEach((item) => {
    const startDate = moment(item.food_dateStart).tz("Asia/Seoul");
    weekStartDate.forEach((startOfWeek, index) => {
      const endOfWeek = startOfWeek.clone().endOf('isoWeek');
      if (startDate.isBetween(startOfWeek, endOfWeek, null, '[]')) {
        sumCarb[index] += Number(item.food_total_carb || "0");
        sumProtein[index] += Number(item.food_total_protein || "0");
        sumFat[index] += Number(item.food_total_fat || "0");
        countRecordsNut[index]++;
      }
    });
  });

  name.forEach((data, index) => {
    finalResultKcal.push({
      name: data,
      date: date[index],
      kcal:
        countRecordsKcal[index] > 0
        ? String((sumKcal[index] / countRecordsKcal[index]).toFixed(0))
        : "0"
    });
    finalResultNut.push({
      name: data,
      date: date[index],
      carb:
        countRecordsNut[index] > 0
        ? String((sumCarb[index] / countRecordsNut[index]).toFixed(2))
        : "0",
      protein:
        countRecordsNut[index] > 0
        ? String((sumProtein[index] / countRecordsNut[index]).toFixed(2))
        : "0",
      fat:
        countRecordsNut[index] > 0
        ? String((sumFat[index] / countRecordsNut[index]).toFixed(2))
        : "0"
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
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

  let sumKcal = Array(12).fill(0);
  let sumCarb = Array(12).fill(0);
  let sumProtein = Array(12).fill(0);
  let sumFat = Array(12).fill(0);
  let countRecordsKcal = Array(12).fill(0);
  let countRecordsNut = Array(12).fill(0);

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.avgMonth.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.avgMonth.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  findResultKcal.forEach((item) => {
    const startDate = moment(item.food_dateStart).tz("Asia/Seoul");
    name.forEach((data, index) => {
      const startOfMonth = curYearStart.clone().add(index, 'months').startOf('month');
      const endOfMonth = curYearStart.clone().add(index, 'months').endOf('month');
      if (startDate.isBetween(startOfMonth, endOfMonth, null, '[]')) {
        sumKcal[index] += Number(item.food_total_kcal || "0");
        countRecordsKcal[index]++;
      }
    });
  });

  // nut
  findResultNut.forEach((item) => {
    const startDate = moment(item.food_dateStart).tz("Asia/Seoul");
    name.forEach((data, index) => {
      const startOfMonth = curYearStart.clone().add(index, 'months').startOf('month');
      const endOfMonth = curYearStart.clone().add(index, 'months').endOf('month');
      if (startDate.isBetween(startOfMonth, endOfMonth, null, '[]')) {
        sumCarb[index] += Number(item.food_total_carb || "0");
        sumProtein[index] += Number(item.food_total_protein || "0");
        sumFat[index] += Number(item.food_total_fat || "0");
        countRecordsNut[index]++;
      }
    });
  });

  name.forEach((data, index) => {
    finalResultKcal.push({
      name: data,
      date: date[index],
      kcal:
        countRecordsKcal[index] > 0
        ? String((sumKcal[index] / countRecordsKcal[index]).toFixed(0))
        : "0"
    });
    finalResultNut.push({
      name: data,
      date: date[index],
      carb:
        countRecordsNut[index] > 0
        ? String((sumCarb[index] / countRecordsNut[index]).toFixed(2))
        : "0",
      protein:
        countRecordsNut[index] > 0
        ? String((sumProtein[index] / countRecordsNut[index]).toFixed(2))
        : "0",
      fat:
        countRecordsNut[index] > 0
        ? String((sumFat[index] / countRecordsNut[index]).toFixed(2))
        : "0"
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};