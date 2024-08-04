// userService.js

import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import moment from 'moment';
import bcrypt from 'bcrypt';
import * as repository from "../../repository/user/userRepository.js";
import {randomNumber, randomTime, calcDate} from '../../assets/js/utils.js';
import {exerciseArray} from '../../assets/array/exerciseArray.js';
import {foodArray} from '../../assets/array/foodArray.js';
import {moneyArray} from '../../assets/array/moneyArray.js';
import {fileURLToPath} from "url";
import {emailSending} from "../../assets/js/email.js";
dotenv.config();

// 0-1. appInfo ------------------------------------------------------------------------------------
export const appInfo = async (
  user_id_param
) => {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf-8'));

  const finalResult = {
    version: json.version || "",
    date: json.date || "",
    git: json.git || "",
    license: json.license || "",
  };

  return finalResult;
};

// 1-1. sendEmail ----------------------------------------------------------------------------------
export const sendEmail = async (
  user_id_param
) => {

  // 임의의 코드 생성
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const sendResult = await emailSending(
    user_id_param, code
  );
  await repository.email.sendEmail(
    user_id_param, code
  );

  const finalResult = {
    code: code,
    result: sendResult
  };

  return finalResult;
};

// 1-2. verifyEmail --------------------------------------------------------------------------------
export const verifyEmail = async (
  user_id_param, code_param
) => {

  const findResult = await repository.email.verifyEmail(
    user_id_param
  );

  let finalResult = null;
  if (findResult !== null) {
    if (findResult.verify_code === code_param) {
      finalResult = "success";
    }
    else {
      finalResult = "fail";
    }
  }

  return finalResult;
};

// 2-1. userSignup ---------------------------------------------------------------------------------
export const userSignup = async (
  user_id_param, OBJECT_param
) => {

  const findResult = await repository.user.checkId(
    user_id_param
  );

  let finalResult = null;
  if (!findResult) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(OBJECT_param.user_pw, saltRounds);
    OBJECT_param.user_pw = hashedPassword;
    finalResult = await repository.user.signup(
      user_id_param, OBJECT_param
    );
  }
  else {
    finalResult = "duplicated";
  }

  return finalResult;
};

// 2-2. userLogin ----------------------------------------------------------------------------------
export const userLogin = async (
  user_id_param, user_pw_param
) => {

  const findResult = await repository.user.checkId(
    user_id_param
  );

  let finalResult = null;
  let adminResult = null;

  if (findResult !== null && findResult.user_pw) {
    const isPasswordMatch = await bcrypt.compare(user_pw_param, findResult.user_pw);
    if (isPasswordMatch) {
      finalResult = findResult;
    }
    else {
      finalResult = "fail";
    }
  }
  else {
    finalResult = "fail";
  }

  if (user_id_param === process.env.ADMIN_ID) {
    adminResult = "admin";
  }
  else {
    adminResult = "user";
  }

  return {
    result: finalResult,
    admin: adminResult
  };
};

// 2-3. userDetail ---------------------------------------------------------------------------------
export const userDetail = async (
  user_id_param
) => {

  const finalResult = await repository.user.detail(
    user_id_param
  );

  return finalResult
};

// 2-4. userUpdate ---------------------------------------------------------------------------------
export const userUpdate = async (
  user_id_param, OBJECT_param
) => {

  let finalResult = await repository.user.update(
    user_id_param, OBJECT_param
  );

  return finalResult;
};

// 2-3. userDeletes --------------------------------------------------------------------------------
export const userDeletes = async (
  user_id_param
) => {

  const finalResult = await repository.user.deletes(
    user_id_param
  );

  return finalResult
};

// 3-1. categoryList -------------------------------------------------------------------------------
export const categoryList = async (
  user_id_param
) => {

  const findResult = await repository.category.list(
    user_id_param
  );

  return findResult;
};

// 3-2. categorySave -------------------------------------------------------------------------------
export const categorySave = async (
  user_id_param, OBJECT_param, DATE_param
) => {

  const findResult = await repository.category.detail(
    user_id_param, ""
  );

  let finalResult = null;
  if (!findResult) {
    finalResult = await repository.category.create(
      user_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.category.update(
      user_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4-1. dummyList ----------------------------------------------------------------------------------
export const dummyList = async (
  user_id_param, PAGING_param, PART_param
) => {

  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  let finalResult = [];
  let totalCnt = 0;

  // 1. exerciseGoal
  if (PART_param === "exerciseGoal") {
    totalCnt = await repository.dummy.countExerciseGoal(
      user_id_param
    );
    finalResult = await repository.dummy.listExerciseGoal(
      user_id_param, page
    );
  }

  // 2. exercise
  else if (PART_param === "exercise") {
    totalCnt = await repository.dummy.countExercise(
      user_id_param
    );
    finalResult = await repository.dummy.listExercise(
      user_id_param, page,
    );
  }

  // 3. foodGoal
  else if (PART_param === "foodGoal") {
    totalCnt = await repository.dummy.countFoodGoal(
      user_id_param
    );
    finalResult = await repository.dummy.listFoodGoal(
      user_id_param, page,
    );
  }

  // 4. food
  else if (PART_param === "food") {
    totalCnt = await repository.dummy.countFood(
      user_id_param
    );
    finalResult = await repository.dummy.listFood(
      user_id_param, page,
    );
  }

  // 5. moneyGoal
  else if (PART_param === "moneyGoal") {
    totalCnt = await repository.dummy.countMoneyGoal(
      user_id_param
    );
    finalResult = await repository.dummy.listMoneyGoal(
      user_id_param, page,
    );
  }

  // 6. money
  else if (PART_param === "money") {
    totalCnt = await repository.dummy.countMoney(
      user_id_param
    );
    finalResult = await repository.dummy.listMoney(
      user_id_param, page,
    );
  }

  // 7. sleepGoal
  else if (PART_param === "sleepGoal") {
    totalCnt = await repository.dummy.countSleepGoal(
      user_id_param
    );
    finalResult = await repository.dummy.listSleepGoal(
      user_id_param, page,
    );
  }

  // 8. sleep
  else if (PART_param === "sleep") {
    totalCnt = await repository.dummy.countSleep(
      user_id_param
    );
    finalResult = await repository.dummy.listSleep(
      user_id_param, page,
    );
  }

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 5-2. dummySave ----------------------------------------------------------------------------------
export const dummySave = async (
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
    await repository.dummy.deletesExerciseGoal(
      user_id_param, OBJECT
    );
    await repository.dummy.saveExerciseGoal(
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
    await repository.dummy.deletesExercise(
      user_id_param, OBJECT
    );
    await repository.dummy.saveExercise(
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
    await repository.dummy.deletesFoodGoal(
      user_id_param, OBJECT
    );
    await repository.dummy.saveFoodGoal(
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
    await repository.dummy.deletesFood(
      user_id_param, OBJECT
    );
    await repository.dummy.saveFood(
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
    await repository.dummy.deletesMoneyGoal(
      user_id_param, OBJECT
    );
    await repository.dummy.saveMoneyGoal(
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
    await repository.dummy.deletesMoney(
      user_id_param, OBJECT
    );
    await repository.dummy.saveMoney(
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
    await repository.dummy.deletesSleepGoal(
      user_id_param, OBJECT
    );
    await repository.dummy.saveSleepGoal(
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
    await repository.dummy.deletesSleep(
      user_id_param, OBJECT
    );
    await repository.dummy.saveSleep(
      user_id_param, OBJECT
    );
    finalResult = "success";
  }

  else {
    finalResult = "fail";
  }

  return finalResult;
};

// 5-3. dummyDeletes -------------------------------------------------------------------------------
export const dummyDeletes = async (
  user_id_param, PART_param
) => {

  let finalResult = String("");
  let secondStr = String(PART_param);

  // 0. all
  if (secondStr === "all") {
    await repository.dummy.all(
      user_id_param
    );
    finalResult = "success";
  }

  // 1. exerciseGoal
  else if (secondStr === "exerciseGoal") {
    await repository.dummy.exerciseGoal(
      user_id_param
    );
    finalResult = "success";
  }

  // 2. exercise
  else if (secondStr === "exercise") {
    await repository.dummy.exercise(
      user_id_param
    );
    finalResult = "success";
  }

  // 3. foodGoal
  else if (secondStr === "foodGoal") {
    await repository.dummy.foodGoal(
      user_id_param
    );
    finalResult = "success";
  }

  // 4. food
  else if (secondStr === "food") {
    await repository.dummy.food(
      user_id_param
    );
    finalResult = "success";
  }

  // 5. moneyGoal
  else if (secondStr === "moneyGoal") {
    await repository.dummy.moneyGoal(
      user_id_param
    );
    finalResult = "success";
  }

  // 6. money
  else if (secondStr === "money") {
    await repository.dummy.money(
      user_id_param
    );
    finalResult = "success";
  }

  // 7. sleepGoal
  else if (secondStr === "sleepGoal") {
    await repository.dummy.sleepGoal(
      user_id_param
    );
    finalResult = "success";
  }

  // 8. sleep
  else if (secondStr === "sleep") {
    await repository.dummy.sleep(
      user_id_param
    );
    finalResult = "success";
  }

  else {
    finalResult = "fail";
  }

  return finalResult;
}