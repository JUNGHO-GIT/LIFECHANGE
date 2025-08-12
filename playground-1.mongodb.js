use("LIFECHANGE_TEST");


db.getCollection('calendar').aggregate( [
  {
    "$lookup": {
      "from": "exercise",
      "let": {
        "user_id": "junghomun00@gmail.com",
        "dateEnd_param": "2025-09-30",
        "dateStart_param": "2025-07-01"
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
                    "$$dateEnd_param"
                  ]
                },
                {
                  "$gte": [
                    "$exercise_dateEnd",
                    "$$dateStart_param"
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "_id": 0,
            "exercise_dateType": 1,
            "exercise_dateStart": 1,
            "exercise_dateEnd": 1,
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
        "user_id": "junghomun00@gmail.com",
        "dateEnd_param": "2025-09-30",
        "dateStart_param": "2025-07-01"
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
                    "$$dateEnd_param"
                  ]
                },
                {
                  "$gte": [
                    "$food_dateEnd",
                    "$$dateStart_param"
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "_id": 0,
            "food_dateType": 1,
            "food_dateStart": 1,
            "food_dateEnd": 1,
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
        "user_id": "junghomun00@gmail.com",
        "dateEnd_param": "2025-09-30",
        "dateStart_param": "2025-07-01"
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
                    "$$dateEnd_param"
                  ]
                },
                {
                  "$gte": [
                    "$money_dateEnd",
                    "$$dateStart_param"
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "_id": 0,
            "money_dateType": 1,
            "money_dateStart": 1,
            "money_dateEnd": 1,
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
        "user_id": "junghomun00@gmail.com",
        "dateEnd_param": "2025-09-30",
        "dateStart_param": "2025-07-01"
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
                    "$$dateEnd_param"
                  ]
                },
                {
                  "$gte": [
                    "$sleep_dateEnd",
                    "$$dateStart_param"
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "_id": 0,
            "sleep_dateType": 1,
            "sleep_dateStart": 1,
            "sleep_dateEnd": 1,
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
      "calendar_number": 1,
      "calendar_exercise_dateType": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$exercise.exercise_dateType",
              0
            ]
          },
          ""
        ]
      },
      "calendar_exercise_dateStart": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$exercise.exercise_dateStart",
              0
            ]
          },
          "0000-00-00"
        ]
      },
      "calendar_exercise_dateEnd": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$exercise.exercise_dateEnd",
              0
            ]
          },
          "0000-00-00"
        ]
      },
      "calendar_exercise_section": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$exercise.exercise_section",
              0
            ]
          },
          []
        ]
      },
      "calendar_food_dateType": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$food.food_dateType",
              0
            ]
          },
          ""
        ]
      },
      "calendar_food_dateStart": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$food.food_dateStart",
              0
            ]
          },
          "0000-00-00"
        ]
      },
      "calendar_food_dateEnd": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$food.food_dateEnd",
              0
            ]
          },
          "0000-00-00"
        ]
      },
      "calendar_food_section": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$food.food_section",
              0
            ]
          },
          []
        ]
      },
      "calendar_money_dateType": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$money.money_dateType",
              0
            ]
          },
          ""
        ]
      },
      "calendar_money_dateStart": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$money.money_dateStart",
              0
            ]
          },
          "0000-00-00"
        ]
      },
      "calendar_money_dateEnd": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$money.money_dateEnd",
              0
            ]
          },
          "0000-00-00"
        ]
      },
      "calendar_money_section": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$money.money_section",
              0
            ]
          },
          []
        ]
      },
      "calendar_sleep_dateType": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$sleep.sleep_dateType",
              0
            ]
          },
          ""
        ]
      },
      "calendar_sleep_dateStart": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$sleep.sleep_dateStart",
              0
            ]
          },
          "0000-00-00"
        ]
      },
      "calendar_sleep_dateEnd": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$sleep.sleep_dateEnd",
              0
            ]
          },
          "0000-00-00"
        ]
      },
      "calendar_sleep_section": {
        "$ifNull": [
          {
            "$arrayElemAt": [
              "$sleep.sleep_section",
              0
            ]
          },
          []
        ]
      }
    }
  },
  {
    "$sort": {
      "calendar_number": -1
    }
  },
  {
    "$skip": 0
  }
], {} )