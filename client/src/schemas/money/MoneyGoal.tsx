// MoneyGoal.tsx

// Types ------------------------------------------------------------------------------------------
export type MoneyGoalType = {
	_id: string;

	// goal
	money_goal_number: number;
	money_goal_dateType: string;
	money_goal_dateStart: string;
	money_goal_dateEnd: string;
	money_goal_income: string;
	money_goal_income_color: string;
	money_goal_expense: string;
	money_goal_expense_color: string;
	money_goal_regDt: string;
	money_goal_updateDt: string;

	// real
	money_dateType: string;
	money_dateStart: string;
	money_dateEnd: string;
	money_total_income: string;
	money_total_income_color: string;
	money_total_expense: string;
	money_total_expense_color: string;
	money_regDt: string;
	money_updateDt: string;

	// diff
	money_diff_income: string;
	money_diff_income_color: string;
	money_diff_expense: string;
	money_diff_expense_color: string;
};

// Schema -----------------------------------------------------------------------------------------
export const MoneyGoal: MoneyGoalType = {
	_id: "",

	// goal
	money_goal_number: 0,
	money_goal_dateType: "",
	money_goal_dateStart: "0000/00/00",
	money_goal_dateEnd: "0000/00/00",
	money_goal_income: "0",
	money_goal_income_color: "",
	money_goal_expense: "0",
	money_goal_expense_color: "",
	money_goal_regDt: "",
	money_goal_updateDt: "",

	// real
	money_dateType: "",
	money_dateStart: "0000/00/00",
	money_dateEnd: "0000/00/00",
	money_total_income: "0",
	money_total_income_color: "",
	money_total_expense: "0",
	money_total_expense_color: "",
	money_regDt: "",
	money_updateDt: "",

	// diff
	money_diff_income: "0",
	money_diff_income_color: "",
	money_diff_expense: "0",
	money_diff_expense_color: "",
};