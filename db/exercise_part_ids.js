use('LIFECHANGE_TEST');

// exercise_part_idx와 exercise_title_idx 삭제
db.getCollection('exercise').updateMany(
  {},
  { $unset: { 'exercise_section.$[].exercise_part_idx': '', 'exercise_section.$[].exercise_title_idx': '' } }
);

// exercise_part_val을 exercise_part로, exercise_title_val을 exercise_title로 변경
db.getCollection('exercise').aggregate([
  {
    $set: {
      exercise_section: {
        $map: {
          input: "$exercise_section",
          as: "section",
          in: {
            $mergeObjects: [
              { $arrayToObject: { $filter: { input: { $objectToArray: "$$section" }, cond: { $not: { $in: [ "$$this.k", ["exercise_part_val", "exercise_title_val"] ] } } } } },
              { exercise_part: "$$section.exercise_part_val", exercise_title: "$$section.exercise_title_val" }
            ]
          }
        }
      }
    }
  },
  {
    $merge: {
      into: "exercise",
      whenMatched: "replace",
      whenNotMatched: "discard"
    }
  }
]);
