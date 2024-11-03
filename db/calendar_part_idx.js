use('LIFECHANGE_TEST');

// calendar_part_idx 삭제.
db.getCollection('calendar').updateMany({}, { $unset: { 'calendar_section.$[].calendar_part_idx': ''} });

// calendar_part_val 이름을 calendar_part 변경.
db.getCollection('calendar').aggregate([
  {
    $set: {
      calendar_section: {
        $map: {
          input: "$calendar_section",
          as: "section",
          in: {
            $mergeObjects: [
              { $arrayToObject: { $filter: { input: { $objectToArray: "$$section" }, cond: { $ne: [ "$$this.k", "calendar_part_val" ] } } } },
              { calendar_part: "$$section.calendar_part_val" }
            ]
          }
        }
      }
    }
  },
  {
    $merge: {
      into: "calendar",
      whenMatched: "replace",
      whenNotMatched: "discard"
    }
  }
]);
