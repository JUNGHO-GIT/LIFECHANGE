use('LIFECHANGE');

// money_part_idx와 money_title_idx 삭제
db.getCollection('money').updateMany(
  {},
  { $unset: { 'money_section.$[].money_part_idx': '', 'money_section.$[].money_title_idx': '' } }
);

// money_part_val을 money_part로, money_title_val을 money_title로 변경
db.getCollection('money').aggregate([
  {
    $set: {
      money_section: {
        $map: {
          input: "$money_section",
          as: "section",
          in: {
            $mergeObjects: [
              { $arrayToObject: { $filter: { input: { $objectToArray: "$$section" }, cond: { $not: { $in: [ "$$this.k", ["money_part_val", "money_title_val"] ] } } } } },
              { money_part: "$$section.money_part_val", money_title: "$$section.money_title_val" }
            ]
          }
        }
      }
    }
  },
  {
    $merge: {
      into: "money",
      whenMatched: "replace",
      whenNotMatched: "discard"
    }
  }
]);
