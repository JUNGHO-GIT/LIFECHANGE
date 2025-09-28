// SleepGoal.tsx

// Types ------------------------------------------------------------------------------------------
export type SleepGoalType = {
	_id: string;

	// goal
	sleep_goal_number: number;
	sleep_goal_dateType: string;
	sleep_goal_dateStart: string;
	sleep_goal_dateEnd: string;
	sleep_goal_bedTime: string;
	sleep_goal_bedTime_color: string;
	sleep_goal_wakeTime: string;
	sleep_goal_wakeTime_color: string;
	sleep_goal_sleepTime: string;
	sleep_goal_sleepTime_color: string;
	sleep_goal_regDt: string;
	sleep_goal_updateDt: string;

	// record
	sleep_record_dateType: string;
	sleep_record_dateStart: string;
	sleep_record_dateEnd: string;
	sleep_record_bedTime: string;
	sleep_record_bedTime_color: string;
	sleep_record_wakeTime: string;
	sleep_record_wakeTime_color: string;
	sleep_record_sleepTime: string;
	sleep_record_sleepTime_color: string;
	sleep_record_regDt: string;
	sleep_record_updateDt: string;

	// diff
	sleep_record_diff_bedTime: string;
	sleep_record_diff_bedTime_color: string;
	sleep_record_diff_wakeTime: string;
	sleep_record_diff_wakeTime_color: string;
	sleep_record_diff_sleepTime: string;
	sleep_record_diff_sleepTime_color: string;
};

// Schema -----------------------------------------------------------------------------------------
export const SleepGoal: SleepGoalType = {
	_id: "",

	// goal
	sleep_goal_number: 0,
	sleep_goal_dateType: "",
	sleep_goal_dateStart: "0000-00-00",
	sleep_goal_dateEnd: "0000-00-00",
	sleep_goal_bedTime: "00:00",
	sleep_goal_bedTime_color: "",
	sleep_goal_wakeTime: "00:00",
	sleep_goal_wakeTime_color: "",
	sleep_goal_sleepTime: "00:00",
	sleep_goal_sleepTime_color: "",
	sleep_goal_regDt: "",
	sleep_goal_updateDt: "",

	// record
	sleep_record_dateType: "",
	sleep_record_dateStart: "0000-00-00",
	sleep_record_dateEnd: "0000-00-00",
	sleep_record_bedTime: "00:00",
	sleep_record_bedTime_color: "",
	sleep_record_wakeTime: "00:00",
	sleep_record_wakeTime_color: "",
	sleep_record_sleepTime: "00:00",
	sleep_record_sleepTime_color: "",
	sleep_record_regDt: "",
	sleep_record_updateDt: "",

	// diff
	sleep_record_diff_bedTime: "00:00",
	sleep_record_diff_bedTime_color: "",
	sleep_record_diff_wakeTime: "00:00",
	sleep_record_diff_wakeTime_color: "",
	sleep_record_diff_sleepTime: "00:00",
	sleep_record_diff_sleepTime_color: ""
};