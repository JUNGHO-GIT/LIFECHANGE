use('LIFECHANGE_TEST');

// food_part_idx 삭제.
db.getCollection('food').updateMany({}, { $unset: { 'food_section.$[].food_part_idx': ''} });

// food_part_val 이름을 food_part 변경.
db.getCollection('food').aggregate([
  {
    $set: {
      food_section: {
        $map: {
          input: "$food_section",
          as: "section",
          in: {
            $mergeObjects: [
              { $arrayToObject: { $filter: { input: { $objectToArray: "$$section" }, cond: { $ne: [ "$$this.k", "food_part_val" ] } } } },
              { food_part: "$$section.food_part_val" }
            ]
          }
        }
      }
    }
  },
  {
    $merge: {
      into: "food",
      whenMatched: "replace",
      whenNotMatched: "discard"
    }
  }
]);
