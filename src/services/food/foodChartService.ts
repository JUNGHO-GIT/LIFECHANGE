// foodChartService.ts

import * as repository from "@repositories/food/foodChartRepository";
import moment from "moment-timezone";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultReal: any[] = [];
  let finalResultKcal: any[] = [];
  let finalResultNut: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultReal] = await Promise.all([
      repository.barGoal(
        user_id_param, dateStart, dateEnd
      ),
      repository.barReal(
        user_id_param, dateStart, dateEnd
      )
    ]);

    // findResult 배열을 순회하며 결과 저장
    finalResultKcal = findResultGoal?.map((item: any) => ({
      name: String("kcal"),
      date: String(dateStart),
      goal: String(item.food_goal_kcal || "0"),
      real: String(findResultReal[0]?.food_total_kcal || "0")
    }));

    finalResultNut = findResultGoal?.map((item: any) => [
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

    finalResult = {
      kcal: finalResultKcal,
      nut: finalResultNut
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult,
    date: `${dateStart} - ${dateEnd}`
  };
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultKcal: any[] = [];
  let findResultNut: any[] = [];
  let finalResultKcal: any[] = [];
  let finalResultNut: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.weekStartFmt;
  const dateEnd = DATE_param.weekEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultKcal, findResultNut] = await Promise.all([
      repository.pieKcal(
        user_id_param, dateStart, dateEnd
      ),
      repository.pieNut(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // findResultKcal 배열을 순회하며 결과 저장
    finalResultKcal = findResultKcal?.map((item: any) => (
      {
        name: String(item._id),
        value: Number(item.value) || 0
      }
    ));

    // findResultNut 배열을 순회하며 결과 저장
    finalResultNut = findResultNut.map((item: any) => [
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

    finalResult = {
      kcal: finalResultKcal,
      nut: finalResultNut
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult,
    date: `${dateStart} - ${dateEnd}`
  };
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultKcal: any[] = [];
  let findResultNut: any[] = [];
  let finalResultKcal: any[] = [];
  let finalResultNut: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.monthStartFmt;
  const dateEnd = DATE_param.monthEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultKcal, findResultNut] = await Promise.all([
      repository.pieKcal(
        user_id_param, dateStart, dateEnd
      ),
      repository.pieNut(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // findResultKcal 배열을 순회하며 결과 저장
    finalResultKcal = findResultKcal?.map((item: any) => (
      {
        name: String(item._id),
        value: Number(item.value) || 0
      }
    ));

    // findResultNut 배열을 순회하며 결과 저장
    finalResultNut = findResultNut.map((item: any) => [
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

    finalResult = {
      kcal: finalResultKcal,
      nut: finalResultNut
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult,
    date: `${dateStart} - ${dateEnd}`
  };
};

// 2-4. chart (pie - year) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieYear = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultKcal: any[] = [];
  let findResultNut: any[] = [];
  let finalResultKcal: any[] = [];
  let finalResultNut: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.yearStartFmt;
  const dateEnd = DATE_param.yearEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultKcal, findResultNut] = await Promise.all([
      repository.pieKcal(
        user_id_param, dateStart, dateEnd
      ),
      repository.pieNut(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // findResultKcal 배열을 순회하며 결과 저장
    finalResultKcal = findResultKcal?.map((item: any) => (
      {
        name: String(item._id),
        value: Number(item.value) || 0
      }
    ));

    // findResultNut 배열을 순회하며 결과 저장
    finalResultNut = findResultNut.map((item: any) => [
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

    finalResult = {
      kcal: finalResultKcal,
      nut: finalResultNut
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult,
    date: `${dateStart} - ${dateEnd}`
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultKcal: any[] = [];
  let findResultNut: any[] = [];
  let finalResultKcal: any[] = [];
  let finalResultNut: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.weekStartFmt;
  const dateEnd = DATE_param.weekEndFmt;
  const weekStartFmt = DATE_param.weekStartFmt;

  // ex. mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return moment(weekStartFmt).clone().add(i, 'days').format("MM-DD");
  });

  try {
    // promise 사용하여 병렬 처리
    [findResultKcal, findResultNut] = await Promise.all([
      repository.lineKcal(
        user_id_param, dateStart, dateEnd
      ),
      repository.lineNut(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // name 배열 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      const targetDay = moment(weekStartFmt).clone().add(index, 'days').format("YYYY/MM/DD");

      const findIndexKcal = findResultKcal.findIndex((item: any) => (
        item.food_dateStart === targetDay
      ));
      const findIndexNut = findResultNut.findIndex((item: any) => (
        item.food_dateStart === targetDay
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

    finalResult = {
      kcal: finalResultKcal,
      nut: finalResultNut
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult,
    date: `${dateStart} - ${dateEnd}`
  };
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultKcal: any[] = [];
  let findResultNut: any[] = [];
  let finalResultKcal: any[] = [];
  let finalResultNut: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.monthStartFmt;
  const dateEnd = DATE_param.monthEndFmt;
  const monthStartFmt = DATE_param.monthStartFmt;
  const monthEndFmt = DATE_param.monthEndFmt;

  // ex. 00일
  const name = Array.from({ length: moment(monthEndFmt).date() }, (_, i) => (
    `${i + 1}`
  ));

  // ex. 00-00
  const date = Array.from({ length: moment(monthEndFmt).date() }, (_, i) => (
    moment(monthStartFmt).clone().add(i, 'days').format("MM-DD")
  ));

  try {
    // promise 사용하여 병렬 처리
    [findResultKcal, findResultNut] = await Promise.all([
      repository.lineKcal(
        user_id_param, dateStart, dateEnd
      ),
      repository.lineNut(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      const targetDay = moment(monthStartFmt).clone().add(index, 'days').format("YYYY/MM/DD");

      const findIndexKcal = findResultKcal.findIndex((item: any) => (
        item.food_dateStart === targetDay
      ));
      const findIndexNut = findResultNut.findIndex((item: any) => (
        item.food_dateStart === targetDay
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

    finalResult = {
      kcal: finalResultKcal,
      nut: finalResultNut,
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult,
    date: `${dateStart} - ${dateEnd}`
  };
};

// 4-1. chart (avg - week) -------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultKcal: any[] = [];
  let findResultNut: any[] = [];
  let finalResultKcal: any[] = [];
  let finalResultNut: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumKcal = Array(5).fill(0);
  let sumCarb = Array(5).fill(0);
  let sumProtein = Array(5).fill(0);
  let sumFat = Array(5).fill(0);
  let countRecordsKcal = Array(5).fill(0);
  let countRecordsNut = Array(5).fill(0);

  // date 변수 정의
  const monthStartFmt = DATE_param.monthStartFmt;

  // weekStartDates 정의
  const weekStartDate = Array.from({ length: 5 }, (_, i) => (
    moment(monthStartFmt).startOf("month").add(i, 'weeks')
  ));

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => (
    `week${i + 1}`
  ));

  // ex. 00-00 - 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = moment(monthStartFmt).add(i, 'weeks').startOf('isoWeek').format("MM-DD");
    const endOfWeek = moment(monthStartFmt).add(i, 'weeks').endOf('isoWeek').format("MM-DD");
    return `${startOfWeek} - ${endOfWeek}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      weekStartDate.map(async (startDate, i) => {
        const dateStart = startDate.clone().startOf('isoWeek').format("YYYY/MM/DD");
        const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY/MM/DD");

        [findResultKcal, findResultNut] = await Promise.all([
          repository.avgKcal(
            user_id_param, dateStart, dateEnd
          ),
          repository.avgNut(
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
    parallelResult.forEach(({ findResultKcal, findResultNut, index }) => {
      findResultKcal.forEach((item: any) => {
        sumKcal[index] += Number(item.food_total_kcal || "0");
        countRecordsKcal[index]++;
      });
      findResultNut.forEach((item: any) => {
        sumCarb[index] += Number(item.food_total_carb || "0");
        sumProtein[index] += Number(item.food_total_protein || "0");
        sumFat[index] += Number(item.food_total_fat || "0");
        countRecordsNut[index]++;
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
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

    finalResult = {
      kcal: finalResultKcal,
      nut: finalResultNut,
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
export const avgMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultKcal: any[] = [];
  let findResultNut: any[] = [];
  let finalResultKcal: any[] = [];
  let finalResultNut: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumKcal = Array(12).fill(0);
  let sumCarb = Array(12).fill(0);
  let sumProtein = Array(12).fill(0);
  let sumFat = Array(12).fill(0);
  let countRecordsKcal = Array(12).fill(0);
  let countRecordsNut = Array(12).fill(0);

  // date 변수 정의
  const yearStartFmt = DATE_param.yearStartFmt;

  // monthStartDate 정의
  const monthStartDate = Array.from({ length: 12 }, (_, i) => (
    moment(yearStartFmt).startOf("year").add(i, 'months')
  ));

  // ex. 00 월
  const name = Array.from({ length: 12 }, (_, i) => (
    `month${i + 1}`
  ));

  // ex. 00-00 - 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = moment(yearStartFmt).add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = moment(yearStartFmt).add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} - ${endOfMonth}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      monthStartDate.map(async (startDate, i) => {
        const dateStart = startDate.clone().startOf('month').format("YYYY/MM/DD");
        const dateEnd = startDate.clone().endOf('month').format("YYYY/MM/DD");

        [findResultKcal, findResultNut] = await Promise.all([
          repository.avgKcal(
            user_id_param, dateStart, dateEnd
          ),
          repository.avgNut(
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
      findResultKcal.forEach((item: any) => {
        sumKcal[index] += Number(item.food_total_kcal || "0");
        countRecordsKcal[index]++;
      });
      findResultNut.forEach((item: any) => {
        sumCarb[index] += Number(item.food_total_carb || "0");
        sumProtein[index] += Number(item.food_total_protein || "0");
        sumFat[index] += Number(item.food_total_fat || "0");
        countRecordsNut[index]++;
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      finalResultKcal.push({
        name: String(data),
        date: String(date[index]),
        kcal:
          countRecordsKcal[index] > 0
          ? String((sumKcal[index] / countRecordsKcal[index]).toFixed(0))
          : "0",
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

    finalResult = {
      kcal: finalResultKcal,
      nut: finalResultNut,
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};