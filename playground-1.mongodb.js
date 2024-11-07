// Connect to the database
use('LIFECHANGE_TEST');

const collections = db.getCollectionInfos();

collections.forEach((collection) => {
  const collectionName = collection.name;
  const document = db.getCollection(collectionName).findOne();

  if (document) {
    for (let field in document) {
      if (field.includes('user_age')) {
        print(`Collection: ${collectionName}, Field: ${field}`);
      }
      else {
        print(`Collection: ${collectionName}, Field: 0`);
      }
    }
  }
});
