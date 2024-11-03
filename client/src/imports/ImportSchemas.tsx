// ImportSchemas.tsx

// admin
import { AppInfo } from "@schemas/admin/Admin";

// calendar
import { Calendar } from "@schemas/calendar/Calendar";

// exercise
import { ExercisePie } from "@schemas/exercise/ExerciseChart";
import { ExerciseLineScale } from "@schemas/exercise/ExerciseChart";
import { ExerciseLineVolume, ExerciseLineCardio } from "@schemas/exercise/ExerciseChart";
import { ExerciseAvgVolume, ExerciseAvgCardio } from "@schemas/exercise/ExerciseChart";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { Exercise } from "@schemas/exercise/Exercise";

// food
import { FoodPie } from "@schemas/food/FoodChart";
import { FoodLineKcal, FoodLineNut } from "@schemas/food/FoodChart";
import { FoodAvgKcal, FoodAvgNut } from "@schemas/food/FoodChart";
import { FoodFind } from "@schemas/food/FoodFind";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { Food } from "@schemas/food/Food";

// money
import { MoneyPie, MoneyLine, MoneyAvg } from "@schemas/money/MoneyChart";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { Money } from "@schemas/money/Money";

// sleep
import { SleepPie, SleepLine, SleepAvg } from "@schemas/sleep/SleepChart";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { Sleep } from "@schemas/sleep/Sleep";

// user
import { User, Category } from "@schemas/user/User";

// -------------------------------------------------------------------------------------------------
export {

  // admin
  AppInfo,

  // calendar
  Calendar,

  // exercise
  ExercisePie,
  ExerciseLineScale,
  ExerciseLineVolume,
  ExerciseLineCardio,
  ExerciseAvgVolume,
  ExerciseAvgCardio,
  ExerciseGoal,
  Exercise,

  // food
  FoodPie,
  FoodLineKcal,
  FoodLineNut,
  FoodAvgKcal,
  FoodAvgNut,
  FoodFind,
  FoodGoal,
  Food,

  // money
  MoneyPie,
  MoneyLine,
  MoneyAvg,
  MoneyGoal,
  Money,

  // sleep
  SleepPie,
  SleepLine,
  SleepAvg,
  SleepGoal,
  Sleep,

  // user
  User,
  Category,
};