// ExerciseGoal.tsx

// Types ------------------------------------------------------------------------------------------
export type ExerciseGoalType = {
	_id: string;

	// goal
	exercise_goal_number: number;
	exercise_goal_dateType: string;
	exercise_goal_dateStart: string;
	exercise_goal_dateEnd: string;
	exercise_goal_count: string;
	exercise_goal_count_color: string;
	exercise_goal_volume: string;
	exercise_goal_volume_color: string;
	exercise_goal_scale: string;
	exercise_goal_scale_color: string;
	exercise_goal_cardio: string;
	exercise_goal_cardio_color: string;
	exercise_goal_regDt: string;
	exercise_goal_updateDt: string;

	// record
	exercise_record_dateType: string;
	exercise_record_dateStart: string;
	exercise_record_dateEnd: string;
	exercise_record_total_count: string;
	exercise_record_total_count_color: string;
	exercise_record_total_volume: string;
	exercise_record_total_volume_color: string;
	exercise_record_total_scale: string;
	exercise_record_total_scale_color: string;
	exercise_record_total_cardio: string;
	exercise_record_total_cardio_color: string;
	exercise_record_regDt: string;
	exercise_record_updateDt: string;

	// diff
	exercise_record_diff_count: string;
	exercise_record_diff_count_color: string;
	exercise_record_diff_cardio: string;
	exercise_record_diff_cardio_color: string;
	exercise_record_diff_volume: string;
	exercise_record_diff_volume_color: string;
	exercise_record_diff_scale: string;
	exercise_record_diff_scale_color: string;
};

// Schema -----------------------------------------------------------------------------------------
export const ExerciseGoal: ExerciseGoalType = {
	_id: "",

	// goal
	exercise_goal_number: 0,
	exercise_goal_dateType: "",
	exercise_goal_dateStart: "0000-00-00",
	exercise_goal_dateEnd: "0000-00-00",
	exercise_goal_count: "0",
	exercise_goal_count_color: "",
	exercise_goal_volume: "0",
	exercise_goal_volume_color: "",
	exercise_goal_scale: "0",
	exercise_goal_scale_color: "",
	exercise_goal_cardio: "00:00",
	exercise_goal_cardio_color: "",
	exercise_goal_regDt: "",
	exercise_goal_updateDt: "",

	// record
	exercise_record_dateType: "",
	exercise_record_dateStart: "0000-00-00",
	exercise_record_dateEnd: "0000-00-00",
	exercise_record_total_count: "0",
	exercise_record_total_count_color: "",
	exercise_record_total_volume: "0",
	exercise_record_total_volume_color: "",
	exercise_record_total_scale: "0",
	exercise_record_total_scale_color: "",
	exercise_record_total_cardio: "00:00",
	exercise_record_total_cardio_color: "",
	exercise_record_regDt: "",
	exercise_record_updateDt: "",

	// diff
	exercise_record_diff_count: "0",
	exercise_record_diff_count_color: "",
	exercise_record_diff_cardio: "00:00",
	exercise_record_diff_cardio_color: "",
	exercise_record_diff_volume: "0",
	exercise_record_diff_volume_color: "",
	exercise_record_diff_scale: "0",
	exercise_record_diff_scale_color: "",
};