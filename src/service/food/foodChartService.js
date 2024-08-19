// foodChartService.js

import * as repository from "../../repository/food/foodChartRepository.js";
import moment from "moment-timezone";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultGoal = [];
  let findResultReal = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // dateStart, dateEnd 정의
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // promise 사용하여 병렬 처리
  [findResultGoal, findResultReal] = await Promise.all([
    repository.barToday.listGoal(
      user_id_param, dateStart, dateEnd
    ),
    repository.barToday.listReal(
      user_id_param, dateStart, dateEnd
    )
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResultKcal = findResultGoal?.map((item) => ({
    name: String("kcal"),
    date: String(dateStart),
    goal: String(item.food_goal_kcal || "0"),
    real: String(findResultReal[0]?.food_total_kcal || "0")
  }));
  finalResultNut = findResultGoal?.map((item) => [
    {
      name: String("carb"),
      date: String(dateStart),
      goal: String(item.food_goal_carb || "0"),
      real: String(findResultReal[0]?.food_total_carb || "0")
    },
    {
      name: String("protein"),
      date: String(dateStart),
      goal: String(item.food_goal_protein || "0"),
      real: String(findResultReal[0]?.food_total_protein || "0")
    },
    {
      name: String("fat"),
      date: String(dateStart),
      goal: String(item.food_goal_fat || "0"),
      real: String(findResultReal[0]?.food_total_fat || "0")
    },
  ]).flat();

  return  {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 2-1. chart (pie - today) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieToday = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // dateStart, dateEnd 정의
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // promise 사용하여 병렬 처리
  [findResultKcal, findResultNut] = await Promise.all([
    repository.pieToday.listKcal(
      user_id_param, dateStart, dateEnd
    ),
    repository.pieToday.listNut(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResultKcal = findResultKcal?.map((item) => (
    {
      name: String(item._id),
      value: Number(item.value) || 0
    }
  ));
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
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  [findResultKcal, findResultNut] = await Promise.all([
    repository.pieWeek.listKcal(
      user_id_param, dateStart, dateEnd
    ),
    repository.pieWeek.listNut(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResultKcal = findResultKcal?.map((item) => (
    {
      name: String(item._id),
      value: Number(item.value) || 0
    }
  ));
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
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  [findResultKcal, findResultNut] = await Promise.all([
    repository.pieMonth.listKcal(
      user_id_param, dateStart, dateEnd
    ),
    repository.pieMonth.listNut(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResultKcal = findResultKcal?.map((item) => (
    {
      name: String(item._id),
      value: Number(item.value) || 0
    }
  ));
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
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // ex. mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  [findResultKcal, findResultNut] = await Promise.all([
    repository.lineWeek.listKcal(
      user_id_param, dateStart, dateEnd
    ),
    repository.lineWeek.listNut(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // name 배열 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curWeekStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndexKcal = findResultKcal.findIndex((item) => (
      item.food_dateStart === targetDate
    ));
    const findIndexNut = findResultNut.findIndex((item) => (
      item.food_dateStart === targetDate
    ));

    finalResultKcal.push({
      name: String(data),
      date: String(date[index]),
      kcal:
        findIndexKcal !== -1
        ? String(findResultKcal[findIndexKcal]?.food_total_kcal)
        : "0"
    });
    finalResultNut.push({
      name: String(data),
      date: String(date[index]),
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
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => `${i + 1}`);

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  [findResultKcal, findResultNut] = await Promise.all([
    repository.lineMonth.listKcal(
      user_id_param, dateStart, dateEnd
    ),
    repository.lineMonth.listNut(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curMonthStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndexKcal = findResultKcal.findIndex((item) => (
      item.food_dateStart === targetDate
    ));
    const findIndexNut = findResultNut.findIndex((item) => (
      item.food_dateStart === targetDate
    ));

    finalResultKcal.push({
      name: String(data),
      date: String(date[index]),
      kcal:
        findIndexKcal !== -1
        ? String(findResultKcal[findIndexKcal]?.food_total_kcal)
        : "0"
    });
    finalResultNut.push({
      name: String(data),
      date: String(date[index]),
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
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // sum, count 변수 선언
  let sumKcal = Array(5).fill(0);
  let sumCarb = Array(5).fill(0);
  let sumProtein = Array(5).fill(0);
  let sumFat = Array(5).fill(0);
  let countRecordsKcal = Array(5).fill(0);
  let countRecordsNut = Array(5).fill(0);

  // weekStartDate 정의
  const weekStartDate = Array.from({ length: 5 }, (_, i) =>
    moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").add(i, 'weeks')
  );

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => `week${i + 1}`);

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = weekStartDate[i].format("MM-DD");
    const endOfWeek = weekStartDate[i].clone().endOf('isoWeek').format("MM-DD");
    return `${startOfWeek} ~ ${endOfWeek}`;
  });

  // promise 사용하여 병렬 처리
  const parallelResult = await Promise.all(
    weekStartDate.map(async (startDate, i) => {
      const dateStart = startDate.format("YYYY-MM-DD");
      const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY-MM-DD");

      [findResultKcal, findResultNut] = await Promise.all([
        repository.avgWeek.listKcal(
          user_id_param, dateStart, dateEnd
        ),
        repository.avgWeek.listNut(
          user_id_param, dateStart, dateEnd
        ),
      ]);

      return {
        findResultKcal,
        findResultNut,
        index: i
      };
    })
  );

  // sum, count 설정
  parallelResult.forEach(({findResultKcal, findResultNut, index}) => {
    findResultKcal.forEach((item) => {
      sumKcal[index] += Number(item.food_total_kcal || "0");
      countRecordsKcal[index]++;
    });
    findResultNut.forEach((item) => {
      sumCarb[index] += Number(item.food_total_carb || "0");
      sumProtein[index] += Number(item.food_total_protein || "0");
      sumFat[index] += Number(item.food_total_fat || "0");
      countRecordsNut[index]++;
    });
  });

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    finalResultKcal.push({
      name: String(data),
      date: String(date[index]),
      kcal:
        countRecordsKcal[index] > 0
        ? String((sumKcal[index] / countRecordsKcal[index]).toFixed(0))
        : "0"
    });
    finalResultNut.push({
      name: String(data),
      date: String(date[index]),
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
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // sum, count 변수 선언
  let sumKcal = Array(12).fill(0);
  let sumCarb = Array(12).fill(0);
  let sumProtein = Array(12).fill(0);
  let sumFat = Array(12).fill(0);
  let countRecordsKcal = Array(12).fill(0);
  let countRecordsNut = Array(12).fill(0);

  // monthStartDate 정의
  const monthStartDate = Array.from({ length: 12 }, (_, i) =>
    moment(curYearStart).tz("Asia/Seoul").startOf("year").add(i, 'months')
  );

  // ex. 00 월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `month${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = curYearStart.clone().add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = curYearStart.clone().add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} ~ ${endOfMonth}`;
  });

  // promise 사용하여 병렬 처리
  const parallelResult = await Promise.all(
    monthStartDate.map(async (startDate, i) => {
      const dateStart = startDate.format("YYYY-MM-DD");
      const dateEnd = startDate.clone().endOf('month').format("YYYY-MM-DD");

      [findResultKcal, findResultNut] = await Promise.all([
        repository.avgMonth.listKcal(
          user_id_param, dateStart, dateEnd
        ),
        repository.avgMonth.listNut(
          user_id_param, dateStart, dateEnd
        ),
      ]);

      return {
        findResultKcal,
        findResultNut,
        index: i
      };
    })
  );

  // sum, count 설정
  parallelResult.forEach(({findResultKcal, findResultNut, index}) => {
    findResultKcal.forEach((item) => {
      sumKcal[index] += Number(item.food_total_kcal || "0");
      countRecordsKcal[index]++;
    });
    findResultNut.forEach((item) => {
      sumCarb[index] += Number(item.food_total_carb || "0");
      sumProtein[index] += Number(item.food_total_protein || "0");
      sumFat[index] += Number(item.food_total_fat || "0");
      countRecordsNut[index]++;
    });
  });

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    finalResultKcal.push({
      name: String(data),
      date: String(date[index]),
      kcal:
        countRecordsKcal[index] > 0
        ? String((sumKcal[index] / countRecordsKcal[index]).toFixed(0))
        : "0"
    });
    finalResultNut.push({
      name: String(data),
      date: String(date[index]),
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