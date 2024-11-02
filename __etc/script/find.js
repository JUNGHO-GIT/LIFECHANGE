// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('LIFECHANGE');

// 모든 컬렉션에서 user 컬렉션을 제외하고 user_id가 'junghomun00@gmail.com'이 아닌 모든 문서를 찾습니다.
db.getCollectionNames().forEach(collection => {
  if (collection !== 'user' && collection !== 'counter') {
    print(`Collection: ${collection}`);
    db.getCollection(collection)
      .find({ user_id: { $ne: 'junghomun00@gmail.com' } })
      .forEach(doc => printjson(doc));
  }
});
