// tweakService.js

import mongodb from 'mongodb';
import moment from 'moment-timezone';
import * as repository from "../repository/tweakRepository.js";
import {randomNumber, randomTime, calcDate} from '../assets/js/utils.js';
import {exerciseArray} from '../assets/array/exerciseArray.js';
import {foodArray} from '../assets/array/foodArray.js';
import {moneyArray} from '../assets/array/moneyArray.js';

// 1-1. dataset ----------------------------------------------------------------------------------->
export const dataset = async (
  user_id_param
) => {

  const findResult = await repository.dataset.list(
    user_id_param
  );

  return findResult;
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, PAGING_param, PART_param
) => {

  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;
  const limit = parseInt(PAGING_param.limit) === 0 ? 10 : PAGING_param.limit;

  let finalResult = [];
  let totalCnt = 0;

  if (PART_param === "exercise") {
    finalResult = await repository.list.listExercise(
      user_id_param, page, limit
    );
    totalCnt = await repository.list.countExercise(
      user_id_param
    );
  }
  else if (PART_param === "exercisePlan") {
    finalResult = await repository.list.listExercisePlan(
      user_id_param, page, limit
    );
    totalCnt = await repository.list.countExercisePlan(
      user_id_param
    );
  }
  else if (PART_param === "food") {
    finalResult = await repository.list.listFood(
      user_id_param, page, limit
    );
    totalCnt = await repository.list.countFood(
      user_id_param
    );
  }
  else if (PART_param === "foodPlan") {
    finalResult = await repository.list.listFoodPlan(
      user_id_param, page, limit
    );
    totalCnt = await repository.list.countFoodPlan(
      user_id_param
    );
  }
  else if (PART_param === "money") {
    finalResult = await repository.list.listMoney(
      user_id_param, page, limit
    );
    totalCnt = await repository.list.countMoney(
      user_id_param
    );
  }
  else if (PART_param === "moneyPlan") {
    finalResult = await repository.list.listMoneyPlan(
      user_id_param, page, limit
    );
    totalCnt = await repository.list.countMoneyPlan(
      user_id_param
    );
  }
  else if (PART_param === "sleep") {
    finalResult = await repository.list.listSleep(
      user_id_param, page, limit
    );
    totalCnt = await repository.list.countSleep(
      user_id_param
    );
  }
  else if (PART_param === "sleepPlan") {
    finalResult = await repository.list.listSleepPlan(
      user_id_param, page, limit
    );
    totalCnt = await repository.list.countSleepPlan(
      user_id_param
    );
  }

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param, PART_param, count_param
) => {

  let insertCount = Number(count_param);
  let finalResult = String("");
  let typeStr = String(PART_param);

  // 1. exercisePlan
  if (typeStr === "exercisePlan") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        exercise_plan_number: i + insertCount,
        exercise_plan_demo: true,
        exercise_plan_startDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_plan_endDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_plan_count: randomNumber(100),
        exercise_plan_volume: randomNumber(1000),
        exercise_plan_cardio: randomTime(),
        exercise_plan_weight: randomNumber(1000),
        exercise_plan_regDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_plan_updateDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      };
    });
    await repository.save.saveExercisePlan(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 2. exercise
  else if (typeStr === "exercise") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      const sections = Array.from({length: Math.floor(Math.random() * 5) + 1}, () => {
        const partIndex = Math.floor(Math.random() * exerciseArray.length);
        const part = exerciseArray[partIndex];
        const titleIndex = Math.floor(Math.random() * part.exercise_title.length);
        return {
          _id: new mongodb.ObjectId(),
          exercise_part_idx: partIndex,
          exercise_part_val: part.exercise_part,
          exercise_title_idx: titleIndex,
          exercise_title_val: part.exercise_title[titleIndex],
          exercise_set: randomNumber(10),
          exercise_rep: randomNumber(10),
          exercise_kg: randomNumber(100),
          exercise_rest: randomNumber(100),
          exercise_volume: randomNumber(1000),
          exercise_cardio: randomTime(),
        };
      });
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        exercise_number: i + insertCount,
        exercise_demo: true,
        exercise_startDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_endDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_total_volume: randomNumber(10000),
        exercise_total_cardio: randomTime(),
        exercise_body_weight: randomNumber(100),
        exercise_section: sections,
        exercise_regDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_updateDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      };
    });
    await repository.save.saveExercise(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 3. foodPlan
  else if (typeStr === "foodPlan") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        food_plan_number: i + insertCount,
        food_plan_demo: true,
        food_plan_startDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_plan_endDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_plan_kcal: randomNumber(10000),
        food_plan_carb: randomNumber(1000),
        food_plan_protein: randomNumber(1000),
        food_plan_fat: randomNumber(1000),
        food_plan_regDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_plan_updateDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      };
    });
    await repository.save.saveFoodPlan(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 4. food
  else if (typeStr === "food") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      const sections = Array.from({length: Math.floor(Math.random() * 5) + 1}, () => {
        const partIndex = Math.floor(Math.random() * foodArray.length);
        const part = foodArray[partIndex];
        const titleArray = ["김치찌개", "된장찌개", "부대찌개", "순두부찌개", "갈비탕", "설렁탕", "뼈해장국", "칼국수", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이"]
        const title = Math.floor(Math.random() * titleArray.length);
        return {
          _id: new mongodb.ObjectId(),
          food_part_idx: partIndex,
          food_part_val: part.food_part,
          food_title : title,
          food_count: randomNumber(10),
          food_serv: "회",
          food_gram: randomNumber(100),
          food_kcal: randomNumber(10000),
          food_fat: randomNumber(100),
          food_carb: randomNumber(100),
          food_protein: randomNumber(100),
        };
      });
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        food_number: i + insertCount,
        food_demo: true,
        food_startDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_endDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_total_kcal: randomNumber(10000),
        food_total_carb: randomNumber(1000),
        food_total_protein: randomNumber(1000),
        food_total_fat: randomNumber(1000),
        food_section: sections,
        food_regDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_updateDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      };
    }
    );
    await repository.save.saveFood(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 5. moneyPlan
  else if (typeStr === "moneyPlan") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        money_plan_number: i + insertCount,
        money_plan_demo: true,
        money_plan_startDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_plan_endDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_plan_in: randomNumber(10000),
        money_plan_out: randomNumber(10000),
        money_plan_regDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_plan_updateDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      };
    });
    await repository.save.saveMoneyPlan(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 6. money
  else if (typeStr === "money") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      const sections = Array.from({length: Math.floor(Math.random() * 5) + 1}, () => {
        const partIndex = Math.floor(Math.random() * moneyArray.length);
        const part = moneyArray[partIndex];
        const titleIndex = Math.floor(Math.random() * part.money_title.length);
        return {
          _id: new mongodb.ObjectId(),
          money_part_idx: partIndex,
          money_part_val: part.money_part,
          money_title_idx: titleIndex,
          money_title_val: part.money_title[titleIndex],
          money_amount: randomNumber(100000),
          money_content: "content",
        };
      });
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        money_number: i + insertCount,
        money_demo: true,
        money_startDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_endDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_total_in: randomNumber(10000),
        money_total_out: randomNumber(10000),
        money_section: sections,
        money_regDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_updateDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      };
    });
    await repository.save.saveMoney(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 7. sleepPlan
  else if (typeStr === "sleepPlan") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        sleep_plan_number: i + insertCount,
        sleep_plan_demo: true,
        sleep_plan_startDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_plan_endDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_plan_night: randomTime(),
        sleep_plan_morning: randomTime(),
        sleep_plan_time: calcDate(randomTime(), randomTime()),
        sleep_plan_regDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_plan_updateDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      };
    });
    await repository.save.saveSleepPlan(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 8. sleep
  else if (typeStr === "sleep") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      const sections = Array.from({length: 1}, () => {
        return {
          _id: new mongodb.ObjectId(),
          sleep_night: randomTime(),
          sleep_morning: randomTime(),
          sleep_time: calcDate(randomTime(), randomTime()),
        };
      });
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        sleep_number: i + insertCount,
        sleep_demo: true,
        sleep_startDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_endDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_section: sections,
        sleep_regDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_updateDt: moment().subtract(i, 'days').format('YYYY-MM-DD'),
      };
    });
    await repository.save.saveSleep(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  else {
    finalResult = "fail";
  }

  return finalResult;
};

// 4-2. delete ------------------------------------------------------------------------------------>
export const deletes = async (
  user_id_param, PART_param
) => {

  const typeStr = PART_param.toString();
  const typeUpper = typeStr.charAt(0).toUpperCase() + typeStr.slice(1);

  const finalResult = await repository.deletes.deletes(
    user_id_param, typeStr, typeUpper
  );

  return finalResult;
};