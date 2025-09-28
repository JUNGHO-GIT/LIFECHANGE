// MoneyRecord.tsx

// Types ------------------------------------------------------------------------------------------
export type MoneyRecordType = {
	_id: string;
	money_record_number: number;
	money_record_dateType: string;
	money_record_dateStart: string;
	money_record_dateEnd: string;
	money_record_total_income: string;
	money_record_total_income_color: string;
	money_record_total_expense: string;
	money_record_total_expense_color: string;
	money_section: {
		money_record_part: string;
		money_record_title: string;
		money_record_amount: string;
		money_record_content: string;
		money_record_include: string;
	}[];
	money_record_regDt: string;
	money_record_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const MoneyRecord: MoneyRecordType = {
	_id: "",
	money_record_number: 0,
	money_record_dateType: "",
	money_record_dateStart: "0000-00-00",
	money_record_dateEnd: "0000-00-00",
	money_record_total_income: "0",
	money_record_total_income_color: "",
	money_record_total_expense: "0",
	money_record_total_expense_color: "",
	money_section: [{
		money_record_part: "",
		money_record_title: "",
		money_record_amount: "0",
		money_record_content: "",
		money_record_include: "Y",
	}],
	money_record_regDt: "",
	money_record_updateDt: "",
};