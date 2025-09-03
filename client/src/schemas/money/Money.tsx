// Money.tsx

// Types ------------------------------------------------------------------------------------------
export type MoneyType = {
	_id: string;
	money_number: number;
	money_dateType: string;
	money_dateStart: string;
	money_dateEnd: string;
	money_total_income: string;
	money_total_income_color: string;
	money_total_expense: string;
	money_total_expense_color: string;
	money_section: {
		money_part: string;
		money_title: string;
		money_amount: string;
		money_content: string;
		money_include: string;
	}[];
	money_regDt: string;
	money_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const Money: MoneyType = {
	_id: "",
	money_number: 0,
	money_dateType: "",
	money_dateStart: "0000-00-00",
	money_dateEnd: "0000-00-00",
	money_total_income: "0",
	money_total_income_color: "",
	money_total_expense: "0",
	money_total_expense_color: "",
	money_section: [{
		money_part: "",
		money_title: "",
		money_amount: "0",
		money_content: "",
		money_include: "Y",
	}],
	money_regDt: "",
	money_updateDt: "",
};