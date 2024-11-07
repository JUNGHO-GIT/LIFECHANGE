// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('LIFECHANGE_TEST');

// Delete specified fields: user_age, user_gender, user_height, user_weight, user_curProperty, user_curPropertyExclude, user_curPropertyInclude, user_initKcal
const result = db.getCollection('user').updateMany(
  {},
  {
    $unset: {
      "user_age": "",
      "user_gender": "",
      "user_height": "",
      "user_weight": "",
      "user_curProperty": "",
      "user_curPropertyExclude": "",
      "user_curPropertyInclude": "",
      "user_initKcal": ""
    }
  }
);

// Print the detailed result to the console.
print(`Matched Count: ${result.matchedCount}`);
print(`Modified Count: ${result.modifiedCount}`);
print(`Acknowledged: ${result.acknowledged}`);
