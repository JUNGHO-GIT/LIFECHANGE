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

	// real
	exercise_dateType: string;
	exercise_dateStart: string;
	exercise_dateEnd: string;
	exercise_total_count: string;
	exercise_total_count_color: string;
	exercise_total_volume: string;
	exercise_total_volume_color: string;
	exercise_total_scale: string;
	exercise_total_scale_color: string;
	exercise_total_cardio: string;
	exercise_total_cardio_color: string;
	exercise_regDt: string;
	exercise_updateDt: string;

	// diff
	exercise_diff_count: string;
	exercise_diff_count_color: string;
	exercise_diff_cardio: string;
	exercise_diff_cardio_color: string;
	exercise_diff_volume: string;
	exercise_diff_volume_color: string;
	exercise_diff_scale: string;
	exercise_diff_scale_color: string;
};

// Schema -----------------------------------------------------------------------------------------
export const ExerciseGoal: ExerciseGoalType = {
	_id: "",

	// goal
	exercise_goal_number: 0,
	exercise_goal_dateType: "",
	exercise_goal_dateStart: "0000/00/00",
	exercise_goal_dateEnd: "0000/00/00",
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

	// real
	exercise_dateType: "",
	exercise_dateStart: "0000/00/00",
	exercise_dateEnd: "0000/00/00",
	exercise_total_count: "0",
	exercise_total_count_color: "",
	exercise_total_volume: "0",
	exercise_total_volume_color: "",
	exercise_total_scale: "0",
	exercise_total_scale_color: "",
	exercise_total_cardio: "00:00",
	exercise_total_cardio_color: "",
	exercise_regDt: "",
	exercise_updateDt: "",

	// diff
	exercise_diff_count: "0",
	exercise_diff_count_color: "",
	exercise_diff_cardio: "00:00",
	exercise_diff_cardio_color: "",
	exercise_diff_volume: "0",
	exercise_diff_volume_color: "",
	exercise_diff_scale: "0",
	exercise_diff_scale_color: "",
};