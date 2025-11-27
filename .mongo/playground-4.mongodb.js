use(`LIFECHANGE_TEST`)
db.getCollection('ExerciseRecord').aggregate( [
  {
    "$match": {
      "user_id": "junghomun00@gmail.com",
      "exercise_record_dateStart": {
        "$lte": "2025-12-30"
      },
      "exercise_record_dateEnd": {
        "$gte": "2024-10-01"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "exercise_dateType": "$exercise_record_dateType",
      "exercise_dateStart": "$exercise_record_dateStart",
      "exercise_dateEnd": "$exercise_record_dateEnd",
      "exercise_section": 1
    }
	},
	{
		"$sort": {
			"exercise_dateStart": 1
		}
	}
] )