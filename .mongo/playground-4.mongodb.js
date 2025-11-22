use(`LIFECHANGE_TEST`)
db.getCollection('user').findOne(
	{ "user_id": "junghomun00@gmail.com" }
)