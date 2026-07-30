/**
 * @file ExerciseRecord.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

// Types ------------------------------------------------------------------------------------------
export interface ExerciseRecordType {
  _id: string;
  exercise_record_number: number;
  exercise_record_dateType: string;
  exercise_record_dateStart: string;
  exercise_record_dateEnd: string;
  exercise_record_score_smile: string;
  exercise_record_total_count: string;
  exercise_record_total_count_color: string;
  exercise_record_total_volume: string;
  exercise_record_total_volume_color: string;
  exercise_record_total_cardio: string;
  exercise_record_total_cardio_color: string;
  exercise_record_total_scale: string;
  exercise_record_total_scale_color: string;
  exercise_record_summary_count_color: string;
  exercise_record_summary_volume_color: string;
  exercise_record_summary_cardio_color: string;
  exercise_record_summary_scale_color: string;
  exercise_goal_count: string;
  exercise_goal_volume: string;
  exercise_goal_cardio: string;
  exercise_goal_scale: string;
  exercise_section: {
    exercise_record_key?: string;
    exercise_record_part: string;
    exercise_record_title: string;
    exercise_record_set: string;
    exercise_record_rep: string;
    exercise_record_weight: string;
    exercise_record_volume: string;
    exercise_record_cardio: string;
  }[];
  exercise_record_regDt: string;
  exercise_record_updateDt: string;
}

// Schema -----------------------------------------------------------------------------------------
export const ExerciseRecord: ExerciseRecordType = {
  _id: ``,
  exercise_record_number: 0,
  exercise_record_dateType: ``,
  exercise_record_dateStart: `0000-00-00`,
  exercise_record_dateEnd: `0000-00-00`,
  exercise_record_score_smile: `smile3`,
  exercise_record_total_count: `0`,
  exercise_record_total_count_color: ``,
  exercise_record_total_volume: `0`,
  exercise_record_total_volume_color: ``,
  exercise_record_total_cardio: `00:00`,
  exercise_record_total_cardio_color: ``,
  exercise_record_total_scale: `0`,
  exercise_record_total_scale_color: ``,
  exercise_record_summary_count_color: ``,
  exercise_record_summary_volume_color: ``,
  exercise_record_summary_cardio_color: ``,
  exercise_record_summary_scale_color: ``,
  exercise_goal_count: `0`,
  exercise_goal_volume: `0`,
  exercise_goal_cardio: `00:00`,
  exercise_goal_scale: `0`,
  exercise_section: [
    {
      exercise_record_part: ``,
      exercise_record_key: ``,
      exercise_record_title: ``,
      exercise_record_set: `0`,
      exercise_record_rep: `0`,
      exercise_record_weight: `0`,
      exercise_record_volume: `0`,
      exercise_record_cardio: `00:00`,
    },
  ],
  exercise_record_regDt: ``,
  exercise_record_updateDt: ``,
};
