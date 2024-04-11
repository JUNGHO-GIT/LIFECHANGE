// 1. linkArray ---------------------------------------------------------------------------------->
export const linkArray = [
  {
    label: "Main",
    items: [
      {to: "/", label: "Home"},
    ]
  },
  {
    label: "User",
    items: [
      {to: "/user/list", label: "UserList"},
    ]
  },
  {
    label: "Food",
    items: [
      {to: "/food/dash", label: "FoodDash"},
      {to: "/food/compare", label: "FoodCompare"},
      {to: "/food/search", label: "FoodSearch"},
      {to: "/food/list", label: "FoodList"},
      {to: "/food/save", label: "FoodSave"},
    ]
  },
  {
    label: "Plan",
    items: [
      {to: "/plan/food/list", label: "PlanFoodList"},
      {to: "/plan/food/detail", label: "PlanFoodDetail"},
      {to: "/plan/food/save", label: "PlanFoodSave"},

      {to: "/plan/money/list", label: "PlanMoneyList"},
      {to: "/plan/money/detail", label: "PlanMoneyDetail"},
      {to: "/plan/money/save", label: "PlanMoneySave"},

      {to: "/plan/sleep/list", label: "PlanSleepList"},
      {to: "/plan/sleep/detail", label: "PlanSleepDetail"},
      {to: "/plan/sleep/save", label: "PlanSleepSave"},

      {to: "/plan/work/list", label: "PlanWorkList"},
      {to: "/plan/work/detail", label: "PlanWorkDetail"},
      {to: "/plan/work/save", label: "PlanWorkSave"},
    ]
  },
  {
    label: "Money",
    items: [
      {to: "/money/dash", label: "MoneyDash"},
      {to: "/money/compare", label: "MoneyCompare"},
      {to: "/money/list", label: "MoneyList"},
      {to: "/money/save", label: "MoneySave"},
    ]
  },
  {
    label: "Sleep",
    items: [
      {to: "/sleep/dash", label: "SleepDash"},
      {to: "/sleep/compare", label: "SleepCompare"},
      {to: "/sleep/list", label: "SleepList"},
      {to: "/sleep/save", label: "SleepSave"},
    ]
  },
  {
    label: "Work",
    items: [
      {to: "/work/dash", label: "WorkDash"},
      {to: "/work/compare", label: "WorkCompare"},
      {to: "/work/list", label: "WorkList"},
      {to: "/work/save", label: "WorkSave"},
    ]
  }
];