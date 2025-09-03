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

	// real
	sleep_dateType: string;
	sleep_dateStart: string;
	sleep_dateEnd: string;
	sleep_bedTime: string;
	sleep_bedTime_color: string;
	sleep_wakeTime: string;
	sleep_wakeTime_color: string;
	sleep_sleepTime: string;
	sleep_sleepTime_color: string;
	sleep_regDt: string;
	sleep_updateDt: string;

	// diff
	sleep_diff_bedTime: string;
	sleep_diff_bedTime_color: string;
	sleep_diff_wakeTime: string;
	sleep_diff_wakeTime_color: string;
	sleep_diff_sleepTime: string;
	sleep_diff_sleepTime_color: string;
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

	// real
	sleep_dateType: "",
	sleep_dateStart: "0000-00-00",
	sleep_dateEnd: "0000-00-00",
	sleep_bedTime: "00:00",
	sleep_bedTime_color: "",
	sleep_wakeTime: "00:00",
	sleep_wakeTime_color: "",
	sleep_sleepTime: "00:00",
	sleep_sleepTime_color: "",
	sleep_regDt: "",
	sleep_updateDt: "",

	// diff
	sleep_diff_bedTime: "00:00",
	sleep_diff_bedTime_color: "",
	sleep_diff_wakeTime: "00:00",
	sleep_diff_wakeTime_color: "",
	sleep_diff_sleepTime: "00:00",
	sleep_diff_sleepTime_color: ""
};