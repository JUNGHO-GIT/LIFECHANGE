// 1. dataArray -----------------------------------------------------------------------------------
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
      {to: "/exercise/chart", label: "ExerciseChart"},
      {to: "/exercise/diff", label: "ExerciseDiff"},
      {to: "/exercise/list", label: "ExerciseList"},
      {to: "/exercise/goal/list", label: "ExerciseGoalList"},
      {to: "/exercise/save", label: "ExerciseSave"},
      {to: "/exercise/goal/save", label: "ExerciseGoalSave"},
    ]
  },
  // food
  {
    icon: "BiBowlHot",
    title: "Food",
    items: [
      {to: "/food/chart", label: "FoodChart"},
      {to: "/food/diff", label: "FoodDiff"},
      {to: "/food/find", label: "FoodFindList"},
      {to: "/food/list", label: "FoodList"},
      {to: "/food/goal/list", label: "FoodGoalList"},
      {to: "/food/save", label: "FoodSave"},
      {to: "/food/goal/save", label: "FoodGoalSave"},
    ]
  },
  // money
  {
    icon: "TbPigMoney",
    title: "Money",
    items: [
      {to: "/money/chart", label: "MoneyChart"},
      {to: "/money/diff", label: "MoneyDiff"},
      {to: "/money/list", label: "MoneyList"},
      {to: "/money/goal/list", label: "MoneyGoalList"},
      {to: "/money/save", label: "MoneySave"},
      {to: "/money/goal/save", label: "MoneyGoalSave"},
    ]
  },
  // sleep
  {
    icon: "TbMoon",
    title: "Sleep",
    items: [
      {to: "/sleep/chart", label: "SleepChart"},
      {to: "/sleep/diff", label: "SleepDiff"},
      {to: "/sleep/list", label: "SleepList"},
      {to: "/sleep/goal/list", label: "SleepGoalList"},
      {to: "/sleep/save", label: "SleepSave"},
      {to: "/sleep/goal/save", label: "SleepGoalSave"},
    ]
  },
  // user
  {
    icon: "BiUser",
    title: "User",
    items: [
      {to: "/user/category", label: "UserCategory"},
      {to: "/user/list", label: "UserDummy"},
    ]
  }
];