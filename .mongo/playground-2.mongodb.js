// ----------------------------------------------------------------------------------------------------------------
// - 컬렉션 이름 변경
// ----------------------------------------------------------------------------------------------------------------
use("LIFECHANGE");
const mappings = {
	schedule: "today",
};
Object.entries(mappings).forEach(([oldName, newName]) => {
	const dbName = db.getName();
	if (!db.getCollectionNames().includes(oldName)) {
		print(`not found: ${oldName}`);
		return;
	}
	if (db.getCollectionNames().includes(newName)) {
		print(`target exists, skip: ${newName}`);
		return;
	}
	try {
		db[oldName].renameCollection(newName);
		print(`renamed: ${oldName} -> ${newName}`);
	} catch (e) {
		print(`error renaming ${oldName}: ${e}`);
	}
});
