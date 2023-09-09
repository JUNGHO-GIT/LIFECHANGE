// workoutService.ts
import Workout from "../schema/Workout";
import * as mongoose from "mongoose";

// 1. workoutList --------------------------------------------------------------------------------->
export const workoutList = async (
  user_id_param : any,
  workout_regdate_param : any
) => {
  const workoutList = await Workout.find ({
    user_id : user_id_param,
    workout_regdate : workout_regdate_param,
  });
  return workoutList;
};

// 2. workoutDetail ------------------------------------------------------------------------------->
export const workoutDetail = async (
  _id_param : any
) => {
  const workoutDetail = await Workout.findOne ({
    _id : _id_param,
  });
  return workoutDetail;
};

// 3. workoutInsert ------------------------------------------------------------------------------->
export const workoutInsert = async (
  workout_param : any
) => {
  const workoutInsert = await Workout.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : workout_param.user_id,
    workout_part : workout_param.workout_part,
    workout_title : workout_param.workout_title,
    workout_set : workout_param.workout_set,
    workout_count : workout_param.workout_count,
    workout_kg : workout_param.workout_kg,
    workout_rest : workout_param.workout_rest,
    workout_time : workout_param.workout_time,
    workout_image : workout_param.workout_image,
    workout_regdate : workout_param.workout_regdate,
    workout_update : workout_param.workout_update,
  });
  return workoutInsert;
};

// 4. workoutUpdate ------------------------------------------------------------------------------->
export const workoutUpdate = async (
  _id_param : any,
  WORKOUT_param : any
) => {
  const workoutUpdate = await Workout.updateOne (
    {_id : _id_param},
    {$set : WORKOUT_param}
  );
  return workoutUpdate;
};

// 5. workoutDelete ------------------------------------------------------------------------------->
export const workoutDelete = async (
  _id_param : any
) => {
  const workoutDelete = await Workout.deleteOne ({
    _id : _id_param,
  });
  return workoutDelete;
};
