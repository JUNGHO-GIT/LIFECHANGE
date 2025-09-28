// SleepRecord.tsx

// Types ------------------------------------------------------------------------------------------
export type SleepRecordType = {
	_id: string;
	sleep_record_number: number;
	sleep_record_dateType: string;
	sleep_record_dateStart: string;
	sleep_record_dateEnd: string;
	sleep_section: {
		sleep_record_bedTime: string;
		sleep_record_bedTime_color: string;
		sleep_record_wakeTime: string;
		sleep_record_wakeTime_color: string;
		sleep_record_sleepTime: string;
		sleep_record_sleepTime_color: string;
	}[];
	sleep_record_regDt: string;
	sleep_record_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const SleepRecord: SleepRecordType = {
	_id: "",
	sleep_record_number: 0,
	sleep_record_dateType: "",
	sleep_record_dateStart: "0000-00-00",
	sleep_record_dateEnd: "0000-00-00",
	sleep_section: [{
		sleep_record_bedTime: "00:00",
		sleep_record_bedTime_color: "",
		sleep_record_wakeTime: "00:00",
		sleep_record_wakeTime_color: "",
		sleep_record_sleepTime: "00:00",
		sleep_record_sleepTime_color: "",
	}],
	sleep_record_regDt: "",
	sleep_record_updateDt: "",
};