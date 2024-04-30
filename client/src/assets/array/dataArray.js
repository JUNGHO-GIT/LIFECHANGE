// 1. dataArray ---------------------------------------------------------------------------------->
export const dataArray = [
  // diary
  {
    icon: "bx bx-calendar",
    title: "Diary",
    items: [
      {to: "/diary/list", label: "DiaryList"},
      {to: "/diary/detail", label: "DiaryDetail"},
    ]
  },
  // exercise
  {
    icon: "bx bx-run",
    title: "Exercise",
    items: [
      {to: "/exercise/dash", label: "ExerciseDash"},
      {to: "/exercise/list", label: "ExerciseList"},
      {to: "/exercise/save", label: "ExerciseSave"},
      {to: "/exercise/plan/list", label: "ExercisePlanList"},
      {to: "/exercise/plan/save", label: "ExercisePlanSave"},
    ]
  },
  // food
  {
    icon: "bx bx-bowl-hot",
    title: "Food",
    items: [
      {to: "/food/dash", label: "FoodDash"},
      {to: "/food/search", label: "FoodSearch"},
      {to: "/food/list", label: "FoodList"},
      {to: "/food/save", label: "FoodSave"},
      {to: "/food/plan/list", label: "FoodPlanList"},
      {to: "/food/plan/save", label: "FoodPlanSave"},
    ]
  },
  // money
  {
    icon: "bx bx-wallet",
    title: "Money",
    items: [
      {to: "/money/dash", label: "MoneyDash"},
      {to: "/money/list", label: "MoneyList"},
      {to: "/money/save", label: "MoneySave"},
      {to: "/money/plan/list", label: "MoneyPlanList"},
      {to: "/money/plan/save", label: "MoneyPlanSave"},
    ]
  },
  // sleep
  {
    icon: "bx bx-bed",
    title: "Sleep",
    items: [
      {to: "/sleep/dash", label: "SleepDash"},
      {to: "/sleep/list", label: "SleepList"},
      {to: "/sleep/save", label: "SleepSave"},
      {to: "/sleep/plan/list", label: "SleepPlanList"},
      {to: "/sleep/plan/save", label: "SleepPlanSave"},
    ]
  },
  // tweak
  {
    icon: "bx bx-cog",
    title: "Tweak",
    items: [
      {to: "/tweak/dataset", label: "TweakDataset"},
    ]
  },
];