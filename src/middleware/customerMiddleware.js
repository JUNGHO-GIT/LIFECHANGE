// customerMiddleware.js

// 1. percent ------------------------------------------------------------------------------------->
export const percent = async (object) => {

  if (!object) {
    return [];
  }

  // 1. exercise
  const diffExercise = (plan, real, extra) => {
    const percent = ((real - plan) / plan) * 100;
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);
    if (extra === "volume") {
      // 1. ~ 1%
      if (percent <= 1) {
        return 4;
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return 3;
      }
      // 3. 10% ~ 50%
      else if (percent > 10 && percent <= 30) {
        return 2;
      }
      // 4. 50% ~
      else {
        return 1;
      }
    }
    else {
      let diff = 0;
      if (realDate < planDate) {
        diff = planDate.getTime() - realDate.getTime();
      }
      else {
        diff = realDate.getTime() - planDate.getTime();
      }
      // 1. 10분이내
      if (0 <= diff && diff <= 600000) {
        return 4;
      }
      // 2. 10분 ~ 20분
      else if (600000 < diff && diff <= 1200000) {
        return 3;
      }
      // 3. 20분 ~ 30분
      else if (1200000 < diff && diff <= 1800000) {
        return 2;
      }
      // 4. 30분 ~
      else {
        return 1;
      }
    }
  };

  // 2. food
  const diffFood = (plan, real, extra) => {
    const percent = ((real - plan) / plan) * 100;
    // 1. ~ 1%
    if (percent <= 1) {
      return 4;
    }
    // 2. 1% ~ 10%
    else if (percent > 1 && percent <= 10) {
      return 3;
    }
    // 3. 10% ~ 50%
    else if (percent > 10 && percent <= 30) {
      return 2;
    }
    // 4. 50% ~
    else {
      return 1;
    }
  };

  // 3. money
  const diffMoney = (plan, real, extra) => {
    if (plan === undefined || real === undefined) {
      return 1;
    }
    else if (extra === "in") {
      let percent = (Math.abs(real - plan) / plan) * 100;
      if (plan > real) {
        if (percent > 0 && percent <= 1) {
          return 4;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return 3;
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return 2;
        }
        // 4. 50% ~
        else {
          return 1;
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return 1;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return 2;
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return 3;
        }
        // 4. 50% ~
        else {
          return 4;
        }
      }
    }
    else if (extra === "out") {
      let percent = (Math.abs(real - plan) / plan) * 100;
      if (plan > real) {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return 1;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return 2;
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return 3;
        }
        // 4. 50% ~
        else {
          return 4;
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return 4;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return 3;
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return 2;
        }
        // 4. 50% ~
        else {
          return 1;
        }
      }
    }
  };

  // 4. sleep
  const diffSleep = (plan, real, extra) => {
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);
    let diff = 0;
    if (realDate < planDate) {
      diff = planDate.getTime() - realDate.getTime();
    }
    else {
      diff = realDate.getTime() - planDate.getTime();
    }
    // 1. 10분이내
    if (0 <= diff && diff <= 600000) {
      return 4;
    }
    // 2. 10분 ~ 20분
    else if (600000 < diff && diff <= 1200000) {
      return 3;
    }
    // 3. 20분 ~ 30분
    else if (1200000 < diff && diff <= 1800000) {
      return 2;
    }
    else {
      return 1;
    }
  };

  const calcAvg = (object) => {
    let sum = 0;
    for (let key in object) {
      sum += object[key];
    }
    return Number((sum / Object.keys(object).length).toFixed(1));
  }

  let exercise = {};
  let food = {};
  let money = {};
  let sleep = {};

  // exercisePlan 과 exerciseReal 이 빈객체가 아닌경우
  if (object.exercisePlan && object.exerciseReal) {
    exercise = {
      diff_count: diffExercise(object.exercisePlan.exercise_plan_count, object.exerciseReal.exercise_total_count, ""),
      diff_volume: diffExercise(object.exercisePlan.exercise_plan_volume, object.exerciseReal.exercise_total_volume, "volume"),
      diff_cardio: diffExercise(object.exercisePlan.exercise_plan_cardio, object.exerciseReal.exercise_total_cardio, "time"),
      diff_weight:  diffExercise(object.exercisePlan.exercise_plan_weight, object.exerciseReal.exercise_body_weight, ""),
    };
  }
  // exercisePlan 과 exerciseReal 이 빈객체인경우
  else if (!object.exercisePlan || !object.exerciseReal) {
    exercise = {
      diff_count: 1,
      diff_volume: 1,
      diff_cardio: 1,
      diff_weight: 1,
    };
  }

  // foodPlan 과 foodReal 이 빈객체가 아닌경우
  if (object.foodPlan && object.foodReal) {
    food = {
      diff_kcal: diffFood(object.foodPlan.food_plan_kcal, object.foodReal.food_total_kcal),
      diff_carb: diffFood(object.foodPlan.food_plan_carb, object.foodReal.food_total_carb),
      diff_protein: diffFood(object.foodPlan.food_plan_protein, object.foodReal.food_total_protein),
      diff_fat: diffFood(object.foodPlan.food_plan_fat, object.foodReal.food_total_fat),
    };
  }
  // foodPlan 과 foodReal 이 빈객체인경우
  else if (!object.foodPlan || !object.foodReal) {
    food = {
      diff_kcal: 1,
      diff_carb: 1,
      diff_protein: 1,
      diff_fat: 1,
    };
  }

  // moneyPlan 과 moneyReal 이 빈객체가 아닌경우
  if (object.moneyPlan && object.moneyReal) {
    money = {
      diff_in: diffMoney(object.moneyPlan.money_plan_in, object.moneyReal.money_total_in, "in"),
      diff_out: diffMoney(object.moneyPlan.money_plan_out, object.moneyReal.money_total_out, "out"),
    };
  }
  // moneyPlan 과 moneyReal 이 빈객체인경우
  else if (!object.moneyPlan || !object.moneyReal) {
    money = {
      diff_in: 1,
      diff_out: 1,
    };
  }

  // sleepPlan 과 sleepReal 이 빈객체가 아닌경우
  if (object.sleepPlan && object.sleepReal) {
    sleep = {
      diff_night: diffSleep(object.sleepPlan.sleep_plan_night, object.sleepReal.sleep_night),
      diff_morning: diffSleep(object.sleepPlan.sleep_plan_morning, object.sleepReal.sleep_morning),
      diff_time: diffSleep(object.sleepPlan.sleep_plan_time, object.sleepReal.sleep_time),
    };
  }
  // sleepPlan 과 sleepReal 이 빈객체인경우
  else if (!object.sleepPlan || !object.sleepReal) {
    sleep = {
      diff_night: 1,
      diff_morning: 1,
      diff_time: 1,
    };
  }

  const newObject = {
    exercise: calcAvg(exercise),
    food: calcAvg(food),
    money: calcAvg(money),
    sleep: calcAvg(sleep),
    total: calcAvg({...exercise, ...food, ...money, ...sleep}),
  };

  return newObject;
};
