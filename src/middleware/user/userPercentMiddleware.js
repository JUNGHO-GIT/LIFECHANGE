// userPercentMiddleware.js

// 1. percent ------------------------------------------------------------------------------------->
export const percent = async (object) => {

  if (!object) {
    return [];
  }

  // 1. exercise
  const diffExercise = (plan, real, extra) => {

    let score = 0;
    let percent = 0;

    if (extra === "count" || extra === "volume") {
      percent = ((real - plan) / plan) * 100;
      // 1. ~ 1%
      if (percent <= 1) {
        score = 1;
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        score = 2;
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        score = 3;
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        score = 4;
      }
      // 5. 50% ~
      else {
        score = 5;
      }
    }
    else if (extra === "weight") {
      percent = ((real - plan) / plan) * 100;
      // 1. ~ 1%
      if (percent <= 1) {
        score = 5;
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        score = 4;
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        score = 3;
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        score = 2;
      }
      // 5. 50% ~
      else {
        score = 1;
      }
    }
    else if (extra === "cardio") {
      const hoursPlan = parseInt(plan.split(":")[0], 10);
      const minutesPlan = parseInt(plan.split(":")[1], 10);
      const hoursReal = parseInt(real.split(":")[0], 10);
      const minutesReal = parseInt(real.split(":")[1], 10);
      const hours = Math.abs(hoursPlan - hoursReal);
      const minutes = Math.abs(minutesPlan - minutesReal);
      const diffVal = (hours * 60) + minutes;
      percent = ((diffVal - plan) / plan) * 100;
      // 1. ~ 10분
      if (0 <= diffVal && diffVal <= 10) {
        score = 1;
      }
      // 2. 10분 ~ 20분
      else if (10 < diffVal && diffVal <= 20) {
        score = 2;
      }
      // 3. 20분 ~ 30분
      else if (20 < diffVal && diffVal <= 30) {
        score = 3;
      }
      // 4. 30분 ~ 50분
      else if (30 < diffVal && diffVal <= 50) {
        score = 4;
      }
      // 5. 50분 ~
      else {
        score = 5;
      }
    }
    return {
      score: Math.abs(score).toFixed(2),
      percent: Math.abs(percent).toFixed(2),
    };
  };

  // 2. food
  const diffFood = (plan, real, extra) => {

    let score = 0;
    let percent = 0;

    if (extra === "kcal" || extra === "carb" || extra === "protein" || extra === "fat") {
      percent = ((real - plan) / plan) * 100;

      // 1. ~ 1%
      if (percent <= 1) {
        score = 5;
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        score = 4;
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        score = 3;
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        score = 2;
      }
      // 5. 50% ~
      else {
        score = 1;
      }
    }
    return {
      score: Math.abs(score).toFixed(2),
      percent: Math.abs(percent).toFixed(2),
    };
  };

  // 3. money
  const diffMoney = (plan, real, extra) => {

    let percent = 0;
    let score = 0;

    if (extra === "in") {
      percent = (Math.abs(plan - real) / plan) * 100;
      if (plan > real) {
        if (percent > 0 && percent <= 1) {
          score = 5;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          score = 4;
        }
        // 3. 10% ~ 30%
        else if (percent > 10 && percent <= 30) {
          score = 3;
        }
        // 4. 30% ~ 50%
        else if (percent > 30 && percent <= 50) {
          score = 2;
        }
        // 5. 50% ~
        else {
          score = 1;
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          score = 1;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          score = 2;
        }
        // 3. 10% ~ 30%
        else if (percent > 10 && percent <= 30) {
          score = 3;
        }
        // 4. 30% ~ 50%
        else if (percent > 30 && percent <= 50) {
          score = 4;
        }
        // 5. 50% ~
        else {
          score = 5;
        }
      }
    }
    else if (extra === "out") {
      percent = (Math.abs(plan - real) / plan) * 100;
      if (plan > real) {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          score = 1;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          score = 2;
        }
        // 3. 10% ~ 30%
        else if (percent > 10 && percent <= 30) {
          score = 3;
        }
        // 4. 30% ~ 50%
        else if (percent > 30 && percent <= 50) {
          score = 4;
        }
        // 5. 50% ~
        else {
          score = 5;
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          score = 5;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          score = 4;
        }
        // 3. 10% ~ 30%
        else if (percent > 10 && percent <= 30) {
          score = 3;
        }
        // 4. 30% ~ 50%
        else if (percent > 30 && percent <= 50) {
          score = 2;
        }
        // 5. 50% ~
        else {
          score = 1;
        }
      }
    }
    return {
      score: Math.abs(score).toFixed(2),
      percent: Math.abs(percent).toFixed(2),
    };
  };

  // 4. sleep
  const diffSleep = (plan, real, extra) => {

    let score = 0;
    let percent = 0;

    if (extra === "night" || extra === "morning") {
      const planDate = new Date(`1970-01-01T${plan}Z`);
      const realDate = new Date(`1970-01-01T${real}Z`);
      let diffVal = 0;
      if (realDate < planDate) {
        diffVal = planDate.getTime() - realDate.getTime();
      }
      else {
        diffVal = realDate.getTime() - planDate.getTime();
      }
      percent = (diffVal / planDate.getTime()) * 100;

      // 1. 10분이내
      if (0 <= diffVal && diffVal <= 600000) {
        score = 5;
      }
      // 2. 10분 ~ 20분
      else if (600000 < diffVal && diffVal <= 1200000) {
        score = 4;
      }
      // 3. 20분 ~ 30분
      else if (1200000 < diffVal && diffVal <= 1800000) {
        score = 3;
      }
      // 4. 30분 ~ 50분
      else if (1800000 < diffVal && diffVal <= 3000000) {
        score = 2;
      }
      // 5. 50분 ~
      else {
        score = 1;
      }
    }
    else if (extra === "time") {
      const hoursPlan = parseInt(plan.split(":")[0], 10);
      const minutesPlan = parseInt(plan.split(":")[1], 10);
      const hoursReal = parseInt(real.split(":")[0], 10);
      const minutesReal = parseInt(real.split(":")[1], 10);
      const hours = Math.abs(hoursPlan - hoursReal);
      const minutes = Math.abs(minutesPlan - minutesReal);

      const diffVal = (hours * 60) + minutes;
      const totalPlanMinutes = (hoursPlan * 60) + minutesPlan;
      percent = ((diffVal - totalPlanMinutes) / totalPlanMinutes) * 100;

      // 1. ~ 10분
      if (0 <= diffVal && diffVal <= 10) {
        score = 5;
      }
      // 2. 10분 ~ 20분
      else if (10 < diffVal && diffVal <= 20) {
        score = 4;
      }
      // 3. 20분 ~ 30분
      else if (20 < diffVal && diffVal <= 30) {
        score = 3;
      }
      // 4. 30분 ~ 50분
      else if (30 < diffVal && diffVal <= 50) {
        score = 2;
      }
      // 5. 50분 ~
      else {
        score = 1;
      }
    }

    return {
      score: Math.abs(score).toFixed(2),
      percent: Math.abs(percent).toFixed(2),
    };
  };

  // 1. exercise
  let exercise = {};
  if (!object?.exercisePlan) {
    exercise = {
      diff_count: {
        score: "1.00",
        percent: "1.00",
      },
      diff_volume: {
        score: "1.00",
        percent: "1.00",
      },
      diff_cardio: {
        score: "1.00",
        percent: "1.00",
      },
      diff_weight: {
        score: "1.00",
        percent: "1.00",
      },
    };
  }
  else {
    exercise = {
      diff_count: diffExercise(
        object?.exercisePlan?.exercise_plan_count,
        object?.exercise?.exercise_total_count,
        "count"
      ),
      diff_volume: diffExercise(
        object?.exercisePlan?.exercise_plan_volume,
        object?.exercise?.exercise_total_volume,
        "volume"
      ),
      diff_cardio: diffExercise(
        object?.exercisePlan?.exercise_plan_cardio,
        object?.exercise?.exercise_total_cardio,
        "cardio"
      ),
      diff_weight:diffExercise(
        object?.exercisePlan?.exercise_plan_weight,
        object?.exercise?.exercise_body_weight,
        "weight"
      ),
    };
  }

  // 2. food
  let food = {};
  if (!object?.foodPlan) {
    food = {
      diff_kcal: {
        score: "1.00",
        percent: "1.00",
      },
      diff_carb: {
        score: "1.00",
        percent: "1.00",
      },
      diff_protein: {
        score: "1.00",
        percent: "1.00",
      },
      diff_fat: {
        score: "1.00",
        percent: "1.00",
      },
    };
  }
  else {
    food = {
      diff_kcal: diffFood(
        object?.foodPlan?.food_plan_kcal,
        object?.food?.food_total_kcal,
        "kcal"
      ),
      diff_carb: diffFood(
        object?.foodPlan?.food_plan_carb,
        object?.food?.food_total_carb,
        "carb"
      ),
      diff_protein: diffFood(
        object?.foodPlan?.food_plan_protein,
        object?.food?.food_total_protein,
        "protein"
      ),
      diff_fat: diffFood(
        object?.foodPlan?.food_plan_fat,
        object?.food?.food_total_fat,
        "fat"
      ),
    };
  }

  // 3. money
  let money = {};
  if (!object?.moneyPlan) {
    money = {
      diff_in: {
        score: "1.00",
        percent: "1.00",
      },
      diff_out: {
        score: "1.00",
        percent: "1.00",
      },
    };
  }
  else {
    money = {
      diff_in: diffMoney(
        object?.moneyPlan?.money_plan_in,
        object?.money?.money_total_in,
        "in"
      ),
      diff_out: diffMoney(
        object?.moneyPlan?.money_plan_out,
        object?.money?.money_total_out,
        "out"
      ),
    };
  }

  // 4. sleep
  let sleep = {};
  if (!object?.sleepPlan) {
    sleep = {
      diff_night: {
        score: "1.00",
        percent: "1.00",
      },
      diff_morning: {
        score: "1.00",
        percent: "1.00",
      },
      diff_time: {
        score: "1.00",
        percent: "1.00",
      },
    };
  }
  else {
    sleep = {
      diff_night: diffSleep(
        object?.sleepPlan?.sleep_plan_night,
        object?.sleep?.sleep_night,
        "night"
      ),
      diff_morning: diffSleep(
        object?.sleepPlan?.sleep_plan_morning,
        object?.sleep?.sleep_morning,
        "morning"
      ),
      diff_time: diffSleep(
        object?.sleepPlan?.sleep_plan_time,
        object?.sleep?.sleep_time,
        "time"
      ),
    };
  }

  const calcAverage = (object) => {
    let sumScore = 0;
    let sumPercent = 0;
    let count = 0;
    for (const key in object) {
        sumScore += parseFloat(object[key].score);
        sumPercent += parseFloat(object[key].percent);
        count++;
    }
    if (count === 0) {
      return {
        score: "1.00",
        percent: "1.00",
      };
    }
    return {
      score: (sumScore / count).toFixed(2),
      percent: (sumPercent / count).toFixed(2),
    };
  };

  const newObject = {
    exercise: {
      ...exercise,
      average: calcAverage(exercise),
    },
    food: {
      ...food,
      average: calcAverage(food),
    },
    money: {
      ...money,
      average: calcAverage(money),
    },
    sleep: {
      ...sleep,
      average: calcAverage(sleep),
    }
  };
  
  console.log("===================================");
  console.log("exercise: ", JSON.stringify(exercise, null, 2));
  console.log("===================================");
  console.log("food: ", JSON.stringify(food, null, 2));
  console.log("===================================");
  console.log("money: ", JSON.stringify(money, null, 2));
  console.log("===================================");
  console.log("sleep: ", JSON.stringify(sleep, null, 2));
  console.log("===================================");
  console.log("newObject: ", JSON.stringify(newObject, null, 2));


  return newObject;
};