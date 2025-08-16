// ImportSchemas.tsx

// admin (types)
import { type AppInfoType } from "@schemas/admin/Admin";
// admin (schemas)
import { AppInfo } from "@schemas/admin/Admin";

// calendar (types)
import { type CalendarType } from "@schemas/calendar/Calendar";
// calendar (schemas)
import { Calendar } from "@schemas/calendar/Calendar";

// exercise (types)
import { type ExercisePieType } from "@schemas/exercise/ExerciseChart";
import { type ExerciseLineType } from "@schemas/exercise/ExerciseChart";
import { type ExerciseAvgType } from "@schemas/exercise/ExerciseChart";
import { type ExerciseGoalType } from "@schemas/exercise/ExerciseGoal";
import { type ExerciseType } from "@schemas/exercise/Exercise";
// exercise (schemas)
import { ExercisePie } from "@schemas/exercise/ExerciseChart";
import { ExerciseLineScale } from "@schemas/exercise/ExerciseChart";
import { ExerciseLineVolume, ExerciseLineCardio } from "@schemas/exercise/ExerciseChart";
import { ExerciseAvgVolume, ExerciseAvgCardio } from "@schemas/exercise/ExerciseChart";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { Exercise } from "@schemas/exercise/Exercise";

// food (types)
import { type FoodPieType } from "@schemas/food/FoodChart";
import { type FoodLineType } from "@schemas/food/FoodChart";
import { type FoodAvgType } from "@schemas/food/FoodChart";
import { type FoodFindType } from "@schemas/food/FoodFind";
import { type FoodGoalType } from "@schemas/food/FoodGoal";
import { type FoodType } from "@schemas/food/Food";
// food (schemas)
import { FoodPie } from "@schemas/food/FoodChart";
import { FoodLineKcal, FoodLineNut } from "@schemas/food/FoodChart";
import { FoodAvgKcal, FoodAvgNut } from "@schemas/food/FoodChart";
import { FoodFind } from "@schemas/food/FoodFind";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { Food } from "@schemas/food/Food";

// money (types)
import { type MoneyPieType } from "@schemas/money/MoneyChart";
import { type MoneyLineType } from "@schemas/money/MoneyChart";
import { type MoneyAvgType } from "@schemas/money/MoneyChart";
import { type MoneyGoalType } from "@schemas/money/MoneyGoal";
import { type MoneyType } from "@schemas/money/Money";
// money (schemas)
import { MoneyPie } from "@schemas/money/MoneyChart";
import { MoneyLine } from "@schemas/money/MoneyChart";
import { MoneyAvg } from "@schemas/money/MoneyChart";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { Money } from "@schemas/money/Money";

// sleep (types)
import { type SleepPieType } from "@schemas/sleep/SleepChart";
import { type SleepLineType } from "@schemas/sleep/SleepChart";
import { type SleepAvgType } from "@schemas/sleep/SleepChart";
import { type SleepGoalType } from "@schemas/sleep/SleepGoal";
import { type SleepType } from "@schemas/sleep/Sleep";
// sleep (schemas)
import { SleepPie } from "@schemas/sleep/SleepChart";
import { SleepLine } from "@schemas/sleep/SleepChart";
import { SleepAvg } from "@schemas/sleep/SleepChart";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { Sleep } from "@schemas/sleep/Sleep";

// user (types)
import { type UserType } from "@schemas/user/User";
import { type CategoryType } from "@schemas/user/User";
// user (schemas)
import { User } from "@schemas/user/User";
import { Category } from "@schemas/user/User";

// -------------------------------------------------------------------------------------------------
export {

	// admin (types)
	AppInfoType,

	// admin (schemas)
	AppInfo,

	// calendar (types)
	CalendarType,

	// calendar (schemas)
	Calendar,

	// exercise (types)
	ExercisePieType,
	ExerciseLineType,
	ExerciseAvgType,
	ExerciseGoalType,
	ExerciseType,

	// exercise (schemas)
	ExercisePie,
	ExerciseLineScale,
	ExerciseLineVolume,
	ExerciseLineCardio,
	ExerciseAvgVolume,
	ExerciseAvgCardio,
	ExerciseGoal,
	Exercise,

	// food (types)
	FoodPieType,
	FoodLineType,
	FoodAvgType,
	FoodFindType,
	FoodGoalType,
	FoodType,

	// food (schemas)
	FoodPie,
	FoodLineKcal,
	FoodLineNut,
	FoodAvgKcal,
	FoodAvgNut,
	FoodFind,
	FoodGoal,
	Food,

	// money (types)
	MoneyPieType,
	MoneyLineType,
	MoneyAvgType,
	MoneyGoalType,
	MoneyType,

	// money (schemas)
	MoneyPie,
	MoneyLine,
	MoneyAvg,
	MoneyGoal,
	Money,

	// sleep (types)
	SleepPieType,
	SleepLineType,
	SleepAvgType,
	SleepGoalType,
	SleepType,

	// sleep (schemas)
	SleepPie,
	SleepLine,
	SleepAvg,
	SleepGoal,
	Sleep,

	// user (types)
	UserType,
	CategoryType,

	// user (schemas)
	User,
	Category
};