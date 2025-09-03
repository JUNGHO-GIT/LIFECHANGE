// Sleep.tsx

// Types ------------------------------------------------------------------------------------------
export type SleepType = {
	_id: string;
	sleep_number: number;
	sleep_dateType: string;
	sleep_dateStart: string;
	sleep_dateEnd: string;
	sleep_section: {
		sleep_bedTime: string;
		sleep_bedTime_color: string;
		sleep_wakeTime: string;
		sleep_wakeTime_color: string;
		sleep_sleepTime: string;
		sleep_sleepTime_color: string;
	}[];
	sleep_regDt: string;
	sleep_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const Sleep: SleepType = {
	_id: "",
	sleep_number: 0,
	sleep_dateType: "",
	sleep_dateStart: "0000-00-00",
	sleep_dateEnd: "0000-00-00",
	sleep_section: [{
		sleep_bedTime: "00:00",
		sleep_bedTime_color: "",
		sleep_wakeTime: "00:00",
		sleep_wakeTime_color: "",
		sleep_sleepTime: "00:00",
		sleep_sleepTime_color: "",
	}],
	sleep_regDt: "",
	sleep_updateDt: "",
};