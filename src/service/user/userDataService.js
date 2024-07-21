// userDataService.js

import mongodb from 'mongodb';
import moment from 'moment-timezone';
import * as repository from "../../repository/user/userDataRepository.js";
import {randomNumber, randomTime, calcDate} from '../../assets/js/utils.js';
import {calendarArray} from '../../assets/array/calendarArray.js';
import {exerciseArray} from '../../assets/array/exerciseArray.js';
import {foodArray} from '../../assets/array/foodArray.js';
import {moneyArray} from '../../assets/array/moneyArray.js';
import {sleepArray} from '../../assets/array/sleepArray.js';

// 1-1. category -----------------------------------------------------------------------------------
export const category = async (
  user_id_param
) => {

  const findResult = await repository.category.list(
    user_id_param
  );

  return findResult;
};

// 1-2. list ---------------------------------------------------------------------------------------
export const list = async (
  user_id_param, PAGING_param, PART_param
) => {

  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  let finalResult = [];
  let totalCnt = 0;

  // 1. exerciseGoal
  if (PART_param === "exerciseGoal") {
    totalCnt = await repository.list.countExerciseGoal(
      user_id_param
    );
    finalResult = await repository.list.listExerciseGoal(
      user_id_param, page
    );
  }

  // 2. exercise
  else if (PART_param === "exercise") {
    totalCnt = await repository.list.countExercise(
      user_id_param
    );
    finalResult = await repository.list.listExercise(
      user_id_param, page,
    );
  }

  // 3. foodGoal
  else if (PART_param === "foodGoal") {
    totalCnt = await repository.list.countFoodGoal(
      user_id_param
    );
    finalResult = await repository.list.listFoodGoal(
      user_id_param, page,
    );
  }

  // 4. food
  else if (PART_param === "food") {
    totalCnt = await repository.list.countFood(
      user_id_param
    );
    finalResult = await repository.list.listFood(
      user_id_param, page,
    );
  }

  // 5. moneyGoal
  else if (PART_param === "moneyGoal") {
    totalCnt = await repository.list.countMoneyGoal(
      user_id_param
    );
    finalResult = await repository.list.listMoneyGoal(
      user_id_param, page,
    );
  }

  // 6. money
  else if (PART_param === "money") {
    totalCnt = await repository.list.countMoney(
      user_id_param
    );
    finalResult = await repository.list.listMoney(
      user_id_param, page,
    );
  }

  // 7. sleepGoal
  else if (PART_param === "sleepGoal") {
    totalCnt = await repository.list.countSleepGoal(
      user_id_param
    );
    finalResult = await repository.list.listSleepGoal(
      user_id_param, page,
    );
  }

  // 8. sleep
  else if (PART_param === "sleep") {
    totalCnt = await repository.list.countSleep(
      user_id_param
    );
    finalResult = await repository.list.listSleep(
      user_id_param, page,
    );
  }

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = async (
  user_id_param
) => {

  const finalResult = await repository.detail(
    user_id_param
  );

  return finalResult
};

// 3-1. save ---------------------------------------------------------------------------------------
export const save = async (
  user_id_param, PART_param, count_param
) => {

  let insertCount = Number(count_param);
  let finalResult = String("");
  let secondStr = String(PART_param);

  // 1. exerciseGoal
  if (secondStr === "exerciseGoal") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        exercise_goal_number: (i+1) + insertCount,
        exercise_goal_dummy: "Y",
        exercise_goal_dateType: "day",
        exercise_goal_dateStart: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_goal_dateEnd: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_goal_count: randomNumber(100),
        exercise_goal_volume: randomNumber(1000),
        exercise_goal_cardio: randomTime(),
        exercise_goal_weight: randomNumber(1000),
        exercise_goal_regDt: Date.now(),
        exercise_goal_updateDt: Date.now(),
      };
    });
    await repository.save.deletesExerciseGoal(
      user_id_param, OBJECT
    );
    await repository.save.saveExerciseGoal(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 2. exercise
  else if (secondStr === "exercise") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      const sections = Array.from({length: Math.floor(Math.random() * 5) + 1}, () => {
        const partIndex = Math.floor(Math.random() * (exerciseArray.length - 1)) + 1;
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
          exercise_volume: randomNumber(1000),
          exercise_cardio: randomTime(),
        };
      });

      const totalVolume = sections
        .filter((section) => (section.exercise_part_val !== "cardio"))
        .reduce((sum, section) => (sum + section.exercise_volume), 0);

      const totalCardio = sections
        .filter((section) => (section.exercise_part_val === "cardio"))
        .reduce((sum, section) => (sum + moment.duration(section.exercise_cardio).asMinutes()), 0);

      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        exercise_number: (i+1) + insertCount,
        exercise_dummy: "Y",
        exercise_dateType: "day",
        exercise_dateStart: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_dateEnd: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        exercise_total_volume: totalVolume,
        exercise_total_cardio: moment.utc(totalCardio * 60000).format("HH:mm"),
        exercise_body_weight: randomNumber(100),
        exercise_section: sections,
        exercise_regDt: Date.now(),
        exercise_updateDt: Date.now(),
      };
    });
    await repository.save.deletesExercise(
      user_id_param, OBJECT
    );
    await repository.save.saveExercise(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 3. foodGoal
  else if (secondStr === "foodGoal") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        food_goal_number: (i+1) + insertCount,
        food_goal_dummy: "Y",
        food_goal_dateType: "day",
        food_goal_dateStart: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_goal_dateEnd: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_goal_kcal: randomNumber(10000),
        food_goal_carb: randomNumber(1000),
        food_goal_protein: randomNumber(1000),
        food_goal_fat: randomNumber(1000),
        food_goal_regDt: Date.now(),
        food_goal_updateDt: Date.now(),
      };
    });
    await repository.save.deletesFoodGoal(
      user_id_param, OBJECT
    );
    await repository.save.saveFoodGoal(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 4. food
  else if (secondStr === "food") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      const sections = Array.from({length: Math.floor(Math.random() * 5) + 1}, () => {
        const partIndex = Math.floor(Math.random() * foodArray.length - 1) + 1;
        const part = foodArray[partIndex];
        const nameArray = ["김치찌개", "된장찌개", "부대찌개", "순두부찌개", "갈비탕", "설렁탕", "뼈해장국", "칼국수", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이", "순대", "튀김", "만두", "라면", "우동", "짜장면", "짬뽕", "볶음밥", "김밥", "초밥", "회", "떡국", "떡만두국", "떡볶이"]
        const brandArray = ["삼성", "LG", "현대", "기아", "SK", "롯데", "CJ", "네이버", "카카오", "신세계"];
        const name = nameArray[Math.floor(Math.random() * nameArray.length)];
        const brand = brandArray[Math.floor(Math.random() * brandArray.length)];
        return {
          _id: new mongodb.ObjectId(),
          food_part_idx: partIndex,
          food_part_val: part.food_part,
          food_name : name,
          food_brand: brand,
          food_count: randomNumber(10),
          food_serv: "회",
          food_gram: randomNumber(100),
          food_kcal: randomNumber(10000),
          food_fat: randomNumber(100),
          food_carb: randomNumber(100),
          food_protein: randomNumber(100),
        };
      });

      const totalKcal = sections
        .reduce((sum, section) => (sum + section.food_kcal), 0);

      const totalCarb = sections
        .reduce((sum, section) => (sum + section.food_carb), 0);

      const totalProtein = sections
        .reduce((sum, section) => (sum + section.food_protein), 0);

      const totalFat = sections
        .reduce((sum, section) => (sum + section.food_fat), 0);

      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        food_number: (i+1) + insertCount,
        food_dummy: "Y",
        food_dateType: "day",
        food_dateStart: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_dateEnd: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        food_total_kcal: totalKcal,
        food_total_carb: totalCarb,
        food_total_protein: totalProtein,
        food_total_fat: totalFat,
        food_section: sections,
        food_regDt: Date.now(),
        food_updateDt: Date.now(),
      };
    }
    );
    await repository.save.deletesFood(
      user_id_param, OBJECT
    );
    await repository.save.saveFood(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 5. moneyGoal
  else if (secondStr === "moneyGoal") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        money_goal_number: (i+1) + insertCount,
        money_goal_dummy: "Y",
        money_goal_dateType: "day",
        money_goal_dateStart: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_goal_dateEnd: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_goal_income: randomNumber(10000),
        money_goal_expense: randomNumber(10000),
        money_goal_regDt: Date.now(),
        money_goal_updateDt: Date.now(),
      };
    });
    await repository.save.deletesMoneyGoal(
      user_id_param, OBJECT
    );
    await repository.save.saveMoneyGoal(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 6. money
  else if (secondStr === "money") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      const sections = Array.from({length: Math.floor(Math.random() * 5) + 1}, () => {
        const partIndex = Math.floor(Math.random() * moneyArray.length - 1) + 1;
        const part = moneyArray[partIndex];
        const titleIndex = Math.floor(Math.random() * part.money_title.length);
        return {
          _id: new mongodb.ObjectId(),
          money_part_idx: partIndex,
          money_part_val: part.money_part,
          money_title_idx: titleIndex,
          money_title_val: part.money_title[titleIndex],
          money_amount: randomNumber(100000),
          money_content: "bbbbbbbb"
        };
      });

      const totalIncome = sections
        .filter((section) => (section.money_part_val === "income"))
        .reduce((sum, section) => (sum + section.money_amount), 0);

      const totalExpense = sections
        .filter((section) => (section.money_part_val === "expense"))
        .reduce((sum, section) => (sum + section.money_amount), 0);

      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        money_number: (i+1) + insertCount,
        money_dummy: "Y",
        money_dateType: "day",
        money_dateStart: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_dateEnd: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        money_total_income: totalIncome,
        money_total_expense: totalExpense,
        money_section: sections,
        money_regDt: Date.now(),
        money_updateDt: Date.now(),
      };
    });
    await repository.save.deletesMoney(
      user_id_param, OBJECT
    );
    await repository.save.saveMoney(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 7. sleepGoal
  else if (secondStr === "sleepGoal") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        sleep_goal_number: (i+1) + insertCount,
        sleep_goal_dummy: "Y",
        sleep_goal_dateType: "day",
        sleep_goal_dateStart: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_goal_dateEnd: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_goal_bedTime: randomTime(),
        sleep_goal_wakeTime: randomTime(),
        sleep_goal_sleepTime: calcDate(randomTime(), randomTime()),
        sleep_goal_regDt: Date.now(),
        sleep_goal_updateDt: Date.now(),
      };
    });
    await repository.save.deletesSleepGoal(
      user_id_param, OBJECT
    );
    await repository.save.saveSleepGoal(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  // 8. sleep
  else if (secondStr === "sleep") {
    const OBJECT = Array.from({length: insertCount}, (_, i) => {
      const sections = Array.from({length: 1}, () => {
        return {
          _id: new mongodb.ObjectId(),
          sleep_bedTime: randomTime(),
          sleep_wakeTime: randomTime(),
          sleep_sleepTime: calcDate(randomTime(), randomTime()),
        };
      });
      return {
        _id: new mongodb.ObjectId(),
        user_id: user_id_param,
        sleep_number: (i+1) + insertCount,
        sleep_dummy: "Y",
        sleep_dateType: "day",
        sleep_dateStart: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_dateEnd: moment().subtract(i, 'days').format('YYYY-MM-DD'),
        sleep_section: sections,
        sleep_regDt: Date.now(),
        sleep_updateDt: Date.now(),
      };
    });
    await repository.save.deletesSleep(
      user_id_param, OBJECT
    );
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

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param, PART_param
) => {

  let finalResult = String("");
  let secondStr = String(PART_param);

  // 0. all
  if (secondStr === "all") {
    await repository.deletes.all(
      user_id_param
    );
    finalResult = "success";
  }

  // 1. exerciseGoal
  else if (secondStr === "exerciseGoal") {
    await repository.deletes.exerciseGoal(
      user_id_param
    );
    finalResult = "success";
  }

  // 2. exercise
  else if (secondStr === "exercise") {
    await repository.deletes.exercise(
      user_id_param
    );
    finalResult = "success";
  }

  // 3. foodGoal
  else if (secondStr === "foodGoal") {
    await repository.deletes.foodGoal(
      user_id_param
    );
    finalResult = "success";
  }

  // 4. food
  else if (secondStr === "food") {
    await repository.deletes.food(
      user_id_param
    );
    finalResult = "success";
  }

  // 5. moneyGoal
  else if (secondStr === "moneyGoal") {
    await repository.deletes.moneyGoal(
      user_id_param
    );
    finalResult = "success";
  }

  // 6. money
  else if (secondStr === "money") {
    await repository.deletes.money(
      user_id_param
    );
    finalResult = "success";
  }

  // 7. sleepGoal
  else if (secondStr === "sleepGoal") {
    await repository.deletes.sleepGoal(
      user_id_param
    );
    finalResult = "success";
  }

  // 8. sleep
  else if (secondStr === "sleep") {
    await repository.deletes.sleep(
      user_id_param
    );
    finalResult = "success";
  }

  else {
    finalResult = "fail";
  }

  return finalResult;
}