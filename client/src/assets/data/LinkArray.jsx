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
      {to: "/plan/list/food", label: "PlanListFood"},
      {to: "/plan/detail/food", label: "PlanDetailFood"},
      {to: "/plan/save/food", label: "PlanSaveFood"},

      {to: "/plan/list/money", label: "PlanListMoney"},
      {to: "/plan/detail/money", label: "PlanDetailMoney"},
      {to: "/plan/save/money", label: "PlanSaveMoney"},

      {to: "/plan/list/sleep", label: "PlanListSleep"},
      {to: "/plan/detail/sleep", label: "PlanDetailSleep"},
      {to: "/plan/save/sleep", label: "PlanSaveSleep"},

      {to: "/plan/list/work", label: "PlanListWork"},
      {to: "/plan/detail/work", label: "PlanDetailWork"},
      {to: "/plan/save/work", label: "PlanSaveWork"},
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