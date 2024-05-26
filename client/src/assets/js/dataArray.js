// 1. dataArray ---------------------------------------------------------------------------------->
export const dataArray = [
  // calendar
  {
    icon: "LuCalendarCheck",
    title: "Calendar",
    items: [
      {to: "/calendar/list", label: "CalendarList"},
      {to: "/calendar/save", label: "CalendarSave"},
    ]
  },
  // exercise
  {
    icon: "LuDumbbell",
    title: "Exercise",
    items: [
      {to: "/exercise/dash", label: "ExerciseDash"},
      {to: "/exercise/diff", label: "ExerciseDiff"},
      {to: "/exercise/list", label: "ExerciseList"},
      {to: "/exercise/plan/list", label: "ExercisePlanList"},
      {to: "/exercise/save", label: "ExerciseSave"},
      {to: "/exercise/plan/save", label: "ExercisePlanSave"},
    ]
  },
  // food
  {
    icon: "BiBowlHot",
    title: "Food",
    items: [
      {to: "/food/dash", label: "FoodDash"},
      {to: "/food/diff", label: "FoodDiff"},
      {to: "/food/find", label: "FoodFindList"},
      {to: "/food/list", label: "FoodList"},
      {to: "/food/plan/list", label: "FoodPlanList"},
      {to: "/food/save", label: "FoodSave"},
      {to: "/food/plan/save", label: "FoodPlanSave"},
    ]
  },
  // money
  {
    icon: "TbPigMoney",
    title: "Money",
    items: [
      {to: "/money/dash", label: "MoneyDash"},
      {to: "/money/diff", label: "MoneyDiff"},
      {to: "/money/list", label: "MoneyList"},
      {to: "/money/plan/list", label: "MoneyPlanList"},
      {to: "/money/save", label: "MoneySave"},
      {to: "/money/plan/save", label: "MoneyPlanSave"},
    ]
  },
  // sleep
  {
    icon: "TbMoon",
    title: "Sleep",
    items: [
      {to: "/sleep/dash", label: "SleepDash"},
      {to: "/sleep/diff", label: "SleepDiff"},
      {to: "/sleep/list", label: "SleepList"},
      {to: "/sleep/plan/list", label: "SleepPlanList"},
      {to: "/sleep/save", label: "SleepSave"},
      {to: "/sleep/plan/save", label: "SleepPlanSave"},
    ]
  },
  // user
  {
    icon: "BiUser",
    title: "User",
    items: [
      {to: "/user/data/custom", label: "UserDataCustom"},
      {to: "/user/data/list", label: "UserDataList"},
    ]
  }
];