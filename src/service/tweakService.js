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
  customer_id_param
) => {

  const findResult = await repository.dataset.list(
    customer_id_param
  );

  return findResult;
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, PAGING_param, TYPE_param
) => {

  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const limit = parseInt(PAGING_param.limit) === 0 ? 10 : parseInt(PAGING_param.limit);

  let findResult;
  let findCnt;

  if (TYPE_param === "exercise") {
    findResult = await repository.list.listExercise(
      customer_id_param, page, limit
    );
    findCnt = await repository.list.countExercise(
      customer_id_param
    );
  }
  else if (TYPE_param === "exercisePlan") {
    findResult = await repository.list.listExercisePlan(
      customer_id_param, page, limit
    );
    findCnt = await repository.list.countExercisePlan(
      customer_id_param
    );
  }
  else if (TYPE_param === "food") {
    findResult = await repository.list.listFood(
      customer_id_param, page, limit
    );
    findCnt = await repository.list.countFood(
      customer_id_param
    );
  }
  else if (TYPE_param === "foodPlan") {
    findResult = await repository.list.listFoodPlan(
      customer_id_param, page, limit
    );
    findCnt = await repository.list.countFoodPlan(
      customer_id_param
    );
  }
  else if (TYPE_param === "money") {
    findResult = await repository.list.listMoney(
      customer_id_param, page, limit
    );
    findCnt = await repository.list.countMoney(
      customer_id_param
    );
  }
  else if (TYPE_param === "moneyPlan") {
    findResult = await repository.list.listMoneyPlan(
      customer_id_param, page, limit
    );
    findCnt = await repository.list.countMoneyPlan(
      customer_id_param
    );
  }
  else if (TYPE_param === "sleep") {
    findResult = await repository.list.listSleep(
      customer_id_param, page, limit
    );
    findCnt = await repository.list.countSleep(
      customer_id_param
    );
  }
  else if (TYPE_param === "sleepPlan") {
    findResult = await repository.list.listSleepPlan(
      customer_id_param, page, limit
    );
    findCnt = await repository.list.countSleepPlan(
      customer_id_param
    );
  }

  const finalResult = {
    [`${TYPE_param}`]: findResult,
    [`${TYPE_param}Cnt`]: findCnt
  };

  return {
    result: finalResult
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  customer_id_param, OBJECT_param
) => {

  const findResult = await repository.save.detail(
    customer_id_param, ""
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.save.create(
      customer_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.save.update(
      customer_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4-1. add --------------------------------------------------------------------------------------->
export const add = async (
  customer_id_param, TYPE_param
) => {

  let OBJECT = [];
  let sections = [];
  let finalResult = "";

  const typeStr = TYPE_param.toString();
  const sectionCount = randomNumber(5) + 1;

  for (let k = 0; k < sectionCount; k++) {
    if (typeStr === "exercise") {
      const partIndex = randomNumber(exerciseArray.length - 1) + 1;
      const part = exerciseArray[partIndex];
      const titleIndex = randomNumber(part.exercise_title.length);
      const title = part.exercise_title[titleIndex];
      sections.push({
        _id: new mongodb.ObjectId(),
        exercise_part_idx: partIndex,
        exercise_part_val: part.exercise_part,
        exercise_title_idx: titleIndex,
        exercise_title_val: title,
        exercise_set: randomNumber(10),
        exercise_rep: randomNumber(10),
        exercise_kg: randomNumber(100),
        exercise_rest: randomNumber(100),
        exercise_volume: randomNumber(1000),
        exercise_cardio: randomTime(),
      });
    }
    else if (typeStr === "food") {
      const partIndex = randomNumber(foodArray.length - 1) + 1;
      const part = foodArray[partIndex];
      const titleArray = ["김치찌개", "된장찌개", "부대찌개", "순두부찌개", "갈비탕", "설렁탕", "뼈해장국", "칼국수", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이"]
      const title = titleArray[randomNumber(titleArray.length)];
      sections.push({
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
      });
    }
    else if (typeStr === "money") {
      const partIndex = randomNumber(moneyArray.length - 1) + 1;
      const part = moneyArray[partIndex];
      const titleIndex = randomNumber(3);
      const title = part.money_title[titleIndex];
      sections.push({
        _id: new mongodb.ObjectId(),
        money_part_idx: partIndex,
        money_part_val: part.money_part,
        money_title_idx: titleIndex,
        money_title_val: title,
        money_amount: randomNumber(100000),
        money_content: "content",
      });
    }
    else if (typeStr === "sleep") {
      sections.push({
        _id: new mongodb.ObjectId(),
        sleep_night: randomTime(),
        sleep_morning: randomTime(),
        sleep_time: calcDate(randomTime(), randomTime()),
      });
    }
  }

  for (let i = 1; i <= 100; i++) {
    const id = new mongodb.ObjectId();
    const customer_id = customer_id_param;
    const number = i + 100;
    const demo = true;
    const startDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
    const endDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
    const regDate = startDate;
    const updateDate = endDate;

    if (typeStr === "exercise") {
      OBJECT.push({
        _id: id,
        customer_id: customer_id,
        exercise_number: number,
        exercise_demo: demo,
        exercise_startDt: startDate,
        exercise_endDt: endDate,
        exercise_total_volume: randomNumber(10000),
        exercise_total_cardio: randomTime(),
        exercise_body_weight: randomNumber(100),
        exercise_section: sections,
        exercise_regDt: regDate,
        exercise_updateDt: updateDate,
      });
    }
    else if (typeStr === "exercisePlan") {
      OBJECT.push({
        _id: id,
        customer_id: customer_id,
        exercise_plan_number: number,
        exercise_plan_demo: demo,
        exercise_plan_startDt: startDate,
        exercise_plan_endDt: endDate,
        exercise_plan_count: randomNumber(100),
        exercise_plan_volume: randomNumber(1000),
        exercise_plan_cardio: randomTime(),
        exercise_plan_weight: randomNumber(1000),
        exercise_plan_regDt: regDate,
        exercise_plan_updateDt: updateDate,
      });
    }
    else if (typeStr === "food") {
      OBJECT.push({
        _id: id,
        customer_id: customer_id,
        food_number: number,
        food_demo: demo,
        food_startDt: startDate,
        food_endDt: endDate,
        food_total_kcal: randomNumber(10000),
        food_total_carb: randomNumber(1000),
        food_total_protein: randomNumber(1000),
        food_total_fat: randomNumber(1000),
        food_section: sections,
        food_regDt: regDate,
        food_updateDt: updateDate,
      });
    }
    else if (typeStr === "foodPlan") {
      OBJECT.push({
        _id: id,
        customer_id: customer_id,
        food_plan_number: number,
        food_plan_demo: demo,
        food_plan_startDt: startDate,
        food_plan_endDt: endDate,
        food_plan_kcal: randomNumber(10000),
        food_plan_carb: randomNumber(1000),
        food_plan_protein: randomNumber(1000),
        food_plan_fat: randomNumber(1000),
        food_plan_regDt: regDate,
        food_plan_updateDt: updateDate,
      });
    }
    else if (typeStr === "money") {
      OBJECT.push({
        _id: id,
        customer_id: customer_id,
        money_number: number,
        money_demo: demo,
        money_startDt: startDate,
        money_endDt: endDate,
        money_total_in: randomNumber(10000),
        money_total_out: randomNumber(10000),
        money_section: sections,
        money_regDt: regDate,
        money_updateDt: updateDate,
      });
    }
    else if (typeStr === "moneyPlan") {
      OBJECT.push({
        _id: id,
        customer_id: customer_id,
        money_plan_number: number,
        money_plan_demo: demo,
        money_plan_startDt: startDate,
        money_plan_endDt: endDate,
        money_plan_in: randomNumber(10000),
        money_plan_out: randomNumber(10000),
        money_plan_regDt: regDate,
        money_plan_updateDt: updateDate,
      });
    }
    else if (typeStr === "sleep") {
      OBJECT.push({
        _id: id,
        customer_id: customer_id,
        sleep_number: number,
        sleep_demo: demo,
        sleep_startDt: startDate,
        sleep_endDt: endDate,
        sleep_section: sections,
        sleep_regDt: regDate,
        sleep_updateDt: updateDate,
      });
    }
    else if (typeStr === "sleepPlan") {
      OBJECT.push({
        _id: id,
        customer_id: customer_id,
        sleep_plan_number: number,
        sleep_plan_demo: demo,
        sleep_plan_startDt: startDate,
        sleep_plan_endDt: endDate,
        sleep_plan_night: randomTime(),
        sleep_plan_morning: randomTime(),
        sleep_plan_time: calcDate(randomTime(), randomTime()),
        sleep_plan_regDt: regDate,
        sleep_plan_updateDt: updateDate,
      });
    }
  }
  try {
    if (typeStr === "exercise") {
      await repository.add.addExercise(
        customer_id_param, OBJECT
      );
      finalResult = "success";
    }
    else if (typeStr === "exercisePlan") {
      await repository.add.addExercisePlan(
        customer_id_param, OBJECT
      );
      finalResult = "success";
    }
    else if (typeStr === "food") {
      await repository.add.addFood(
        customer_id_param, OBJECT
      );
      finalResult = "success";
    }
    else if (typeStr === "foodPlan") {
      await repository.add.addFoodPlan(
        customer_id_param, OBJECT
      );
      finalResult = "success";
    }
    else if (typeStr === "money") {
      await repository.add.addMoney(
        customer_id_param, OBJECT
      );
      finalResult = "success";
    }
    else if (typeStr === "moneyPlan") {
      await repository.add.addMoneyPlan(
        customer_id_param, OBJECT
      );
      finalResult = "success";
    }
    else if (typeStr === "sleep") {
      await repository.add.addSleep(
        customer_id_param, OBJECT
      );
      finalResult = "success";
    }
    else if (typeStr === "sleepPlan") {
      await repository.add.addSleepPlan(
        customer_id_param, OBJECT
      );
      finalResult = "success";
    }
  }
  catch (e) {
    console.error(e);
    finalResult = "fail";
  }

  return finalResult;
};

// 4-2. delete ------------------------------------------------------------------------------------>
export const deletes = async (
  customer_id_param, TYPE_param
) => {

  const typeStr = TYPE_param.toString();
  const typeUpper = typeStr.charAt(0).toUpperCase() + typeStr.slice(1);

  const finalResult = await repository.deletes.deletes(
    customer_id_param, typeStr, typeUpper
  );

  return finalResult;
};