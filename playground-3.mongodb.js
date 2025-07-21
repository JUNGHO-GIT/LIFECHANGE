[MongoDB][calendar].aggregate [
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
    "$project": {
      "_id": 1,
      "calendar_dateType": 1,
      "calendar_dateStart": 1,
      "calendar_dateEnd": 1,
      "calendar_section": 1
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
] {} undefined