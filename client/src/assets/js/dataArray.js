// 1. dataArray ---------------------------------------------------------------------------------->
export const dataArray = [
  // calendar
  {
    icon: "BiCalendar",
    title: "Calendar",
    items: [
      {to: "/calendar/list", label: "CalendarList"},
      {to: "/calendar/detail", label: "CalendarDetail"},
    ]
  },
  // exercise
  {
    icon: "BiRun",
    title: "Exercise",
    items: [
      {to: "/exercise/dash", label: "ExerciseDash"},
      {to: "/exercise/diff", label: "ExerciseDiff"},
      {to: "/exercise/list", label: "ExerciseList"},
      {to: "/exercise/save", label: "ExerciseSave"},
      {to: "/exercise/list/plan", label: "ExerciseListPlan"},
      {to: "/exercise/save/plan", label: "ExerciseSavePlan"},
    ]
  },
  // food
  {
    icon: "BiFoodMenu",
    title: "Food",
    items: [
      {to: "/food/dash", label: "FoodDash"},
      {to: "/food/diff", label: "FoodDiff"},
      {to: "/food/search", label: "FoodSearch"},
      {to: "/food/list", label: "FoodList"},
      {to: "/food/save", label: "FoodSave"},
      {to: "/food/list/plan", label: "FoodListPlan"},
      {to: "/food/save/plan", label: "FoodSavePlan"},
    ]
  },
  // money
  {
    icon: "BiMoney",
    title: "Money",
    items: [
      {to: "/money/dash", label: "MoneyDash"},
      {to: "/money/diff", label: "MoneyDiff"},
      {to: "/money/list", label: "MoneyList"},
      {to: "/money/save", label: "MoneySave"},
      {to: "/money/list/plan", label: "MoneyListPlan"},
      {to: "/money/save/plan", label: "MoneySavePlan"},
    ]
  },
  // sleep
  {
    icon: "MdNightlight",
    title: "Sleep",
    items: [
      {to: "/sleep/dash", label: "SleepDash"},
      {to: "/sleep/diff", label: "SleepDiff"},
      {to: "/sleep/list", label: "SleepList"},
      {to: "/sleep/save", label: "SleepSave"},
      {to: "/sleep/list/plan", label: "SleepListPlan"},
      {to: "/sleep/save/plan", label: "SleepSavePlan"},
    ]
  },
  // user
  {
    icon: "BiUser",
    title: "User",
    items: [
      {to: "/user/dataset", label: "UserDataset"},
      {to: "/user/list", label: "UserList"},
    ]
  }
];