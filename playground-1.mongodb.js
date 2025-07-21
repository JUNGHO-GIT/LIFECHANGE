use("LIFECHANGE_TEST");

db.getCollection('calendar').aggregate( [
  {
    "$match": {
      "user_id": "junghomun00@gmail.com",
      "calendar_dateStart": {
        "$lte": "2025-08-31"
      },
      "calendar_dateEnd": {
        "$gte": "2025-06-01"
      }
    }
  },
  {
    "$lookup": {
      "from": "exercise",
      "let": {
        "user_id": "$user_id"
      },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$and": [
                {
                  "$eq": [
                    "$user_id",
                    "$$user_id"
                  ]
                },
                {
                  "$lte": [
                    "$exercise_dateStart",
                    "2025-08-31"
                  ]
                },
                {
                  "$gte": [
                    "$exercise_dateEnd",
                    "2025-06-01"
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "_id": 0,
            "exercise_section": 1
          }
        }
      ],
      "as": "exercise"
    }
  },
  {
    "$lookup": {
      "from": "food",
      "let": {
        "user_id": "$user_id"
      },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$and": [
                {
                  "$eq": [
                    "$user_id",
                    "$$user_id"
                  ]
                },
                {
                  "$lte": [
                    "$food_dateStart",
                    "2025-08-31"
                  ]
                },
                {
                  "$gte": [
                    "$food_dateEnd",
                    "2025-06-01"
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "_id": 0,
            "food_section": 1
          }
        }
      ],
      "as": "food"
    }
  },
  {
    "$lookup": {
      "from": "money",
      "let": {
        "user_id": "$user_id"
      },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$and": [
                {
                  "$eq": [
                    "$user_id",
                    "$$user_id"
                  ]
                },
                {
                  "$lte": [
                    "$money_dateStart",
                    "2025-08-31"
                  ]
                },
                {
                  "$gte": [
                    "$money_dateEnd",
                    "2025-06-01"
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "_id": 0,
            "money_section": 1
          }
        }
      ],
      "as": "money"
    }
  },
  {
    "$lookup": {
      "from": "sleep",
      "let": {
        "user_id": "$user_id"
      },
      "pipeline": [
        {
          "$match": {
            "$expr": {
              "$and": [
                {
                  "$eq": [
                    "$user_id",
                    "$$user_id"
                  ]
                },
                {
                  "$lte": [
                    "$sleep_dateStart",
                    "2025-08-31"
                  ]
                },
                {
                  "$gte": [
                    "$sleep_dateEnd",
                    "2025-06-01"
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "_id": 0,
            "sleep_section": 1
          }
        }
      ],
      "as": "sleep"
    }
  },
  {
    "$project": {
      "_id": 1,
      "calendar_dateType": 1,
      "calendar_dateStart": 1,
      "calendar_dateEnd": 1,
      "calendar_section": 1,
      "exercise_section": { $arrayElemAt: [ "$exercise.exercise_section", 0 ] },
      "food_section": { $arrayElemAt: [ "$food.food_section", 0 ] },
      "money_section": { $arrayElemAt: [ "$money.money_section", 0 ] },
      "sleep_section": { $arrayElemAt: [ "$sleep.sleep_section", 0 ] }
    }
  },
  {
    "$sort": {
      "calendar_dateStart": 1
    }
  },
  {
    "$skip": 0
  }
] )