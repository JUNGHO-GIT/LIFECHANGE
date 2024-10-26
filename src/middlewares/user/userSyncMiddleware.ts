// userSyncMiddleware.ts

// 1. percent (퍼센트 조회) ------------------------------------------------------------------------
export const percent = async (object: any) => {

  // 1. exercise
  const diffExercise = (goalParam: string, realParam: string, extra: string) => {

    let score: number = 0;
    let percent: number = 0;
    let goal: number = parseFloat(goalParam);
    let real: number = parseFloat(realParam);

    if (extra === "count" || extra === "volume") {
      percent = Number(((real - goal) / goal) * 100);

      // 1. - 1%
      if (percent <= 1) {
        score = 1;
      }
      // 2. 1% - 10%
      else if (percent > 1 && percent <= 10) {
        score = 2;
      }
      // 3. 10% - 30%
      else if (percent > 10 && percent <= 30) {
        score = 3;
      }
      // 4. 30% - 50%
      else if (percent > 30 && percent <= 50) {
        score = 4;
      }
      // 5. 50% -
      else {
        score = 5;
      }
    }
    else if (extra === "weight") {
      percent = Number(((real - goal) / goal) * 100);
      // 1. - 1%
      if (percent <= 1) {
        score = 5;
      }
      // 2. 1% - 10%
      else if (percent > 1 && percent <= 10) {
        score = 4;
      }
      // 3. 10% - 30%
      else if (percent > 10 && percent <= 30) {
        score = 3;
      }
      // 4. 30% - 50%
      else if (percent > 30 && percent <= 50) {
        score = 2;
      }
      // 5. 50% -
      else {
        score = 1;
      }
    }
    else if (extra === "cardio") {
      const hoursGoal = parseFloat(goalParam?.split(":")[0]);
      const minutesGoal = parseFloat(goalParam?.split(":")[1]);
      const hoursReal = parseFloat(realParam?.split(":")[0]);
      const minutesReal = parseFloat(realParam?.split(":")[1]);
      const hours = Math.abs(hoursGoal - hoursReal);
      const minutes = Math.abs(minutesGoal - minutesReal);
      const diffVal = (hours * 60) + minutes;
      percent = Number(((diffVal - goal) / goal) * 100);
      // 1. - 10분
      if (0 <= diffVal && diffVal <= 10) {
        score = 1;
      }
      // 2. 10분 - 20분
      else if (10 < diffVal && diffVal <= 20) {
        score = 2;
      }
      // 3. 20분 - 30분
      else if (20 < diffVal && diffVal <= 30) {
        score = 3;
      }
      // 4. 30분 - 50분
      else if (30 < diffVal && diffVal <= 50) {
        score = 4;
      }
      // 5. 50분 -
      else {
        score = 5;
      }
    }
    return {
      score: (
        String(Math.abs(score).toFixed(2)) === "NaN"
        ? "0.00"
        : String(Math.abs(score).toFixed(2))
      ),
      percent: (
        String(Math.abs(percent).toFixed(2)) === "NaN"
        ? "0.00"
        : String(Math.abs(percent).toFixed(2))
      ),
    };
  };

  // 2. food
  const diffFood = (goalParam: string, realParam: string, extra: string) => {

    let score: number = 0;
    let percent: number = 0;
    let goal: number = parseFloat(goalParam);
    let real: number = parseFloat(realParam);

    if (extra === "kcal" || extra === "carb" || extra === "protein" || extra === "fat") {
      percent = Number(((real - goal) / goal) * 100);

      // 1. - 1%
      if (percent <= 1) {
        score = 5;
      }
      // 2. 1% - 10%
      else if (percent > 1 && percent <= 10) {
        score = 4;
      }
      // 3. 10% - 30%
      else if (percent > 10 && percent <= 30) {
        score = 3;
      }
      // 4. 30% - 50%
      else if (percent > 30 && percent <= 50) {
        score = 2;
      }
      // 5. 50% -
      else {
        score = 1;
      }
    }
    return {
      score: (
        String(Math.abs(score).toFixed(2)) === "NaN"
        ? "0.00"
        : String(Math.abs(score).toFixed(2))
      ),
      percent: (
        String(Math.abs(percent).toFixed(2)) === "NaN"
        ? "0.00"
        : String(Math.abs(percent).toFixed(2))
      ),
    };
  };

  // 3. money
  const diffMoney = (goalParam: string, realParam: string, extra: string) => {

    let score: number = 0;
    let percent: number = 0;
    let goal: number = parseFloat(goalParam);
    let real: number = parseFloat(realParam);

    if (extra === "income") {
      percent = Number((Math.abs(goal - real) / goal) * 100);
      if (goal > real) {
        if (percent > 0 && percent <= 1) {
          score = 5;
        }
        // 2. 1% - 10%
        else if (percent > 1 && percent <= 10) {
          score = 4;
        }
        // 3. 10% - 30%
        else if (percent > 10 && percent <= 30) {
          score = 3;
        }
        // 4. 30% - 50%
        else if (percent > 30 && percent <= 50) {
          score = 2;
        }
        // 5. 50% -
        else {
          score = 1;
        }
      }
      else {
        // 1. 0% - 1%
        if (percent > 0 && percent <= 1) {
          score = 1;
        }
        // 2. 1% - 10%
        else if (percent > 1 && percent <= 10) {
          score = 2;
        }
        // 3. 10% - 30%
        else if (percent > 10 && percent <= 30) {
          score = 3;
        }
        // 4. 30% - 50%
        else if (percent > 30 && percent <= 50) {
          score = 4;
        }
        // 5. 50% -
        else {
          score = 5;
        }
      }
    }
    else if (extra === "expense") {
      percent = Number((Math.abs(goal - real) / goal) * 100);
      if (goal > real) {
        // 1. 0% - 1%
        if (percent > 0 && percent <= 1) {
          score = 1;
        }
        // 2. 1% - 10%
        else if (percent > 1 && percent <= 10) {
          score = 2;
        }
        // 3. 10% - 30%
        else if (percent > 10 && percent <= 30) {
          score = 3;
        }
        // 4. 30% - 50%
        else if (percent > 30 && percent <= 50) {
          score = 4;
        }
        // 5. 50% -
        else {
          score = 5;
        }
      }
      else {
        // 1. 0% - 1%
        if (percent > 0 && percent <= 1) {
          score = 5;
        }
        // 2. 1% - 10%
        else if (percent > 1 && percent <= 10) {
          score = 4;
        }
        // 3. 10% - 30%
        else if (percent > 10 && percent <= 30) {
          score = 3;
        }
        // 4. 30% - 50%
        else if (percent > 30 && percent <= 50) {
          score = 2;
        }
        // 5. 50% -
        else {
          score = 1;
        }
      }
    }
    return {
      score: (
        String(Math.abs(score).toFixed(2)) === "NaN"
        ? "0.00"
        : String(Math.abs(score).toFixed(2))
      ),
      percent: (
        String(Math.abs(percent).toFixed(2)) === "NaN"
        ? "0.00"
        : String(Math.abs(percent).toFixed(2))
      ),
    };
  };

  // 4. sleep
  const diffSleep = (goalParam: string, realParam: string, extra: string) => {

    let score: number = 0;
    let percent: number = 0;
    let goal: string = goalParam;
    let real: string = realParam;

    if (extra === "bedTime" || extra === "wakeTime") {
      const goalDate = new Date(`1970-01-01T${goal}Z`);
      const realDate = new Date(`1970-01-01T${real}Z`);
      let diffVal = 0;
      if (realDate < goalDate) {
        diffVal = goalDate.getTime() - realDate.getTime();
      }
      else {
        diffVal = realDate.getTime() - goalDate.getTime();
      }
      percent = Number((diffVal / goalDate.getTime()) * 100);

      // 1. 10분이내
      if (0 <= diffVal && diffVal <= 600000) {
        score = 5;
      }
      // 2. 10분 - 20분
      else if (600000 < diffVal && diffVal <= 1200000) {
        score = 4;
      }
      // 3. 20분 - 30분
      else if (1200000 < diffVal && diffVal <= 1800000) {
        score = 3;
      }
      // 4. 30분 - 50분
      else if (1800000 < diffVal && diffVal <= 3000000) {
        score = 2;
      }
      // 5. 50분 -
      else {
        score = 1;
      }
    }
    else if (extra === "sleepTime") {
      const hoursGoal = parseFloat(goal?.split(":")[0]);
      const minutesGoal = parseFloat(goal?.split(":")[1]);
      const hoursReal = parseFloat(real?.split(":")[0]);
      const minutesReal = parseFloat(real?.split(":")[1]);
      const hours = Math.abs(hoursGoal - hoursReal);
      const minutes = Math.abs(minutesGoal - minutesReal);

      const diffVal = (hours * 60) + minutes;
      const totalGoalMinutes = (hoursGoal * 60) + minutesGoal;
      percent = Number((diffVal / totalGoalMinutes) * 100);

      // 1. - 10분
      if (0 <= diffVal && diffVal <= 10) {
        score = 5;
      }
      // 2. 10분 - 20분
      else if (10 < diffVal && diffVal <= 20) {
        score = 4;
      }
      // 3. 20분 - 30분
      else if (20 < diffVal && diffVal <= 30) {
        score = 3;
      }
      // 4. 30분 - 50분
      else if (30 < diffVal && diffVal <= 50) {
        score = 2;
      }
      // 5. 50분 -
      else {
        score = 1;
      }
    }

    return {
      score: (
        String(Math.abs(score).toFixed(2)) === "NaN"
        ? "0.00"
        : String(Math.abs(score).toFixed(2))
      ),
      percent: (
        String(Math.abs(percent).toFixed(2)) === "NaN"
        ? "0.00"
        : String(Math.abs(percent).toFixed(2))
      ),
    };
  };

  // 1. exercise
  let exercise = {};
  if (!object?.result?.exerciseGoal || !object?.result?.exercise) {
    exercise = {
      diff_count: {
        score: "1.00",
        percent: "0.00",
      },
      diff_volume: {
        score: "1.00",
        percent: "0.00",
      },
      diff_cardio: {
        score: "1.00",
        percent: "0.00",
      },
      diff_weight: {
        score: "1.00",
        percent: "0.00",
      },
    };
  }
  else {
    exercise = {
      diff_count: diffExercise(
        object?.result?.exerciseGoal?.exercise_goal_count,
        object?.result?.exercise?.exercise_total_count,
        "count"
      ),
      diff_volume: diffExercise(
        object?.result?.exerciseGoal?.exercise_goal_volume,
        object?.result?.exercise?.exercise_total_volume,
        "volume"
      ),
      diff_cardio: diffExercise(
        object?.result?.exerciseGoal?.exercise_goal_cardio,
        object?.result?.exercise?.exercise_total_cardio,
        "cardio"
      ),
      diff_weight:diffExercise(
        object?.result?.exerciseGoal?.exercise_goal_weight,
        object?.result?.exercise?.exercise_total_weight,
        "weight"
      ),
    };
  }

  // 2. food
  let food = {};
  if (!object?.result?.foodGoal || !object?.result?.food) {
    food = {
      diff_kcal: {
        score: "1.00",
        percent: "0.00",
      },
      diff_carb: {
        score: "1.00",
        percent: "0.00",
      },
      diff_protein: {
        score: "1.00",
        percent: "0.00",
      },
      diff_fat: {
        score: "1.00",
        percent: "0.00",
      },
    };
  }
  else {
    food = {
      diff_kcal: diffFood(
        object?.result?.foodGoal?.food_goal_kcal,
        object?.result?.food?.food_total_kcal,
        "kcal"
      ),
      diff_carb: diffFood(
        object?.result?.foodGoal?.food_goal_carb,
        object?.result?.food?.food_total_carb,
        "carb"
      ),
      diff_protein: diffFood(
        object?.result?.foodGoal?.food_goal_protein,
        object?.result?.food?.food_total_protein,
        "protein"
      ),
      diff_fat: diffFood(
        object?.result?.foodGoal?.food_goal_fat,
        object?.result?.food?.food_total_fat,
        "fat"
      ),
    };
  }

  // 3. money
  let money = {};
  if (!object?.result?.moneyGoal || !object?.result?.money) {
    money = {
      diff_income: {
        score: "1.00",
        percent: "0.00",
      },
      diff_expense: {
        score: "1.00",
        percent: "0.00",
      },
    };
  }
  else {
    money = {
      diff_income: diffMoney(
        object?.result?.moneyGoal?.money_goal_income,
        object?.result?.money?.money_total_income,
        "income"
      ),
      diff_expense: diffMoney(
        object?.result?.moneyGoal?.money_goal_expense,
        object?.result?.money?.money_total_expense,
        "expense"
      ),
    };
  }

  // 4. sleep
  let sleep = {};
  if (!object?.result?.sleepGoal || !object?.result?.sleep) {
    sleep = {
      diff_bedTime: {
        score: "1.00",
        percent: "0.00",
      },
      diff_wakeTime: {
        score: "1.00",
        percent: "0.00",
      },
      diff_sleepTime: {
        score: "1.00",
        percent: "0.00",
      },
    };
  }
  else {
    sleep = {
      diff_bedTime: diffSleep(
        object?.result?.sleepGoal?.sleep_goal_bedTime,
        object?.result?.sleep?.sleep_bedTime,
        "bedTime"
      ),
      diff_wakeTime: diffSleep(
        object?.result?.sleepGoal?.sleep_goal_wakeTime,
        object?.result?.sleep?.sleep_wakeTime,
        "wakeTime"
      ),
      diff_sleepTime: diffSleep(
        object?.result?.sleepGoal?.sleep_goal_sleepTime,
        object?.result?.sleep?.sleep_sleepTime,
        "sleepTime"
      ),
    };
  }

  const calcAverage = (object: any) => {
    let sumScore = 0;
    let sumPercent = 0;
    let count = 0;
    for (const key in object) {
      sumScore += parseFloat(object[key]?.score);
      sumPercent += parseFloat(object[key]?.percent);
      count++;
    }
    if (count === 0) {
      return {
        score: "1.00",
        percent: "0.00",
      };
    }
    return {
      score: (sumScore / count).toFixed(2) || "1.00",
      percent: (sumPercent / count).toFixed(2) || "1.00",
    };
  };

  const newObject: any = {
    status: object?.result?.status,
    result: {
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
    }
  };

  // 5. total
  const total = {
    score: 0,
    percent: 0,
    count: 0,
  };

  ["exercise", "food", "money", "sleep"]?.forEach(category => {
    total.score += parseFloat(newObject?.result?.[category]?.average.score);
    total.percent += parseFloat(newObject?.result?.[category]?.average.percent);
    total.count++;
  });

  if (total.count > 0) {
    newObject.result.total = {
      average: {
        score: (total.score / total.count).toFixed(2),
        percent: (total.percent / total.count).toFixed(2),
      }
    };
  }

  return newObject;
};