use("LIFECHANGE_TEST");
db.getCollection('foodRecord').aggregate( [
  {
    "$match": {
      "user_id": "",
      "food_record_dateStart": {
        "$gte": "2024-01-01",
        "$lte": "2024-12-31"
      },
      "food_record_dateEnd": {
        "$gte": "2024-01-01",
        "$lte": "2024-12-31"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "food_record_dateType": 1,
      "food_record_dateStart": 1,
      "food_record_dateEnd": 1,
      "food_record_total_kcal": 1,
      "food_record_total_carb": 1,
      "food_record_total_protein": 1,
      "food_record_total_fat": 1
    }
  },
  {
    "$sort": {
      "food_record_dateStart": 1
    }
  },
  {
    "$skip": 0
  }
], {} )
