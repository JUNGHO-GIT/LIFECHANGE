// ExerciseRecord.tsx

// Types ------------------------------------------------------------------------------------------
export type ExerciseRecordType = {
	_id: string;
	exercise_record_number: number;
	exercise_record_dateType: string;
	exercise_record_dateStart: string;
	exercise_record_dateEnd: string;
	exercise_record_total_volume: string;
	exercise_record_total_volume_color: string;
	exercise_record_total_cardio: string;
	exercise_record_total_cardio_color: string;
	exercise_record_total_scale: string;
	exercise_record_total_scale_color: string;
	exercise_section: Array<{
		exercise_record_part: string;
		exercise_record_title: string;
		exercise_record_set: string;
		exercise_record_rep: string;
		exercise_record_weight: string;
		exercise_record_volume: string;
		exercise_record_cardio: string;
	}>;
	exercise_record_regDt: string;
	exercise_record_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const ExerciseRecord: ExerciseRecordType = {
  _id: "",
  exercise_record_number: 0,
  exercise_record_dateType: "",
  exercise_record_dateStart: "0000-00-00",
  exercise_record_dateEnd: "0000-00-00",
  exercise_record_total_volume: "0",
  exercise_record_total_volume_color: "",
  exercise_record_total_cardio: "00:00",
  exercise_record_total_cardio_color: "",
  exercise_record_total_scale: "0",
  exercise_record_total_scale_color: "",
  exercise_section: [{
    exercise_record_part: "",
    exercise_record_title: "",
    exercise_record_set: "0",
    exercise_record_rep: "0",
    exercise_record_weight: "0",
    exercise_record_volume: "0",
    exercise_record_cardio: "00:00",
  }],
  exercise_record_regDt: "",
  exercise_record_updateDt: "",
};