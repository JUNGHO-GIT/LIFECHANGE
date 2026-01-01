// LIFECHANGE -> LIFECHANGE_TEST (collections + indexes)
const SRC_DB = `LIFECHANGE`;
const DST_DB = `LIFECHANGE_TEST`;

const src = db.getSiblingDB(SRC_DB);
const dst = db.getSiblingDB(DST_DB);

const colls = src.getCollectionNames()
	.filter((name) => !name.startsWith(`system.`));

colls.forEach((collName) => {

	// 1) 데이터 복사: 대상 컬렉션을 교체(replace)
	src.getCollection(collName).aggregate(
		[
			{ $match: {} },
			{ $out: { db: DST_DB, coll: collName } },
		],
		{ allowDiskUse: true },
	);

	// 2) 인덱스 복사
	const idxList = src.getCollection(collName).getIndexes();
	idxList.forEach((idx) => idx.name !== `_id_` ? (() => {

		const opts = {};
		[
			`name`,
			`unique`,
			`sparse`,
			`expireAfterSeconds`,
			`partialFilterExpression`,
			`collation`,
			`hidden`,
			`storageEngine`,
			`weights`,
			`default_language`,
			`language_override`,
			`wildcardProjection`,
			`2dsphereIndexVersion`,
			`bits`,
			`min`,
			`max`,
			`bucketSize`,
		].forEach((k) => Object.prototype.hasOwnProperty.call(idx, k) ? (opts[k] = idx[k]) : null);

		dst.getCollection(collName).createIndex(idx.key, opts);

	})() : null);

});

print(`Copied ${colls.length} collections from ${SRC_DB} to ${DST_DB}`);
