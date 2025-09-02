// Exercise.tsx

// Types ------------------------------------------------------------------------------------------
export type ExerciseType = {
	_id: string;
	exercise_number: number;
	exercise_dateType: string;
	exercise_dateStart: string;
	exercise_dateEnd: string;
	exercise_total_volume: string;
	exercise_total_volume_color: string;
	exercise_total_cardio: string;
	exercise_total_cardio_color: string;
	exercise_total_scale: string;
	exercise_total_scale_color: string;
	exercise_section: Array<{
		exercise_part: string;
		exercise_title: string;
		exercise_set: string;
		exercise_rep: string;
		exercise_weight: string;
		exercise_volume: string;
		exercise_cardio: string;
	}>;
	exercise_regDt: string;
	exercise_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const Exercise: ExerciseType = {
  _id: "",
  exercise_number: 0,
  exercise_dateType: "",
  exercise_dateStart: "0000/00/00",
  exercise_dateEnd: "0000/00/00",
  exercise_total_volume: "0",
  exercise_total_volume_color: "",
  exercise_total_cardio: "00:00",
  exercise_total_cardio_color: "",
  exercise_total_scale: "0",
  exercise_total_scale_color: "",
  exercise_section: [{
    exercise_part: "",
    exercise_title: "",
    exercise_set: "0",
    exercise_rep: "0",
    exercise_weight: "0",
    exercise_volume: "0",
    exercise_cardio: "00:00",
  }],
  exercise_regDt: "",
  exercise_updateDt: "",
};