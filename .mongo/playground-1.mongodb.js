// ----------------------------------------------------------------------------------------------------------------
// - 컬렉션 이름 변경
// ----------------------------------------------------------------------------------------------------------------
use("LIFECHANGE_TEST");
const mappings = {
  "schedule": "today",
  /* "exercise": "exerciseRecord",
  "food": "foodRecord",
  "money": "moneyRecord",
  "sleep": "sleepRecord" */
};
Object.entries(mappings).forEach(([oldName, newName]) => {
  const dbName = db.getName();
  const oldNs = `${dbName}.${oldName}`;
  const newNs = `${dbName}.${newName}`;
  if (!db.getCollectionNames().includes(oldName)) {
  print(`not found: ${oldName}`);

  return ;
  }
  if (db.getCollectionNames().includes(newName)) {
  print(`target exists, skip: ${newName}`);

  return ;
  }
  try {
  db[oldName].renameCollection(newName);
  print(`renamed: ${oldName} -> ${newName}`);
  } catch (e) {
  print(`error renaming ${oldName}: ${e}`);
  }
});

// ----------------------------------------------------------------------------------------------------------------
// - 기존 컬렉션 삭제
// ----------------------------------------------------------------------------------------------------------------
use("LIFECHANGE");
//const regex = /^(calendar|exercise|food|money|sleep)$/;
const regex = /^(calendar)$/;
db.getCollectionNames()
  .filter(n => regex.test(n))
  .forEach(n => {
  db[n].drop();
  print(`dropped: ${n}`);
  });

// ----------------------------------------------------------------------------------------------------------------
// - 필드명 변경: <prefix>_ -> <prefix>_record_  (food, money, sleep, exercise 다건 처리 + 오염 패턴/이중 '_' 교정, 재진입 안전)
// ----------------------------------------------------------------------------------------------------------------
use("LIFECHANGE");

// 대상 컬렉션/접두사 매핑
const tasks = [
  { col: "exerciseRecord", prefix: "exercise" },
  { col: "foodRecord", prefix: "food" },
  { col: "moneyRecord", prefix: "money" },
  { col: "sleepRecord", prefix: "sleep" }
];

// 공통: 접두사 기반 키 변환기(앵커 정규식, 단일 패스, 중복/오타 교정 포함)
// ------------------------------------------------------------------------------------------------
function makeRenameFunction (pfx) {
  return {
  body: function (doc, p) {
    // --------------------------------------------------------------------------------------------
    function fixKey (k) {
    if (k === "_id") { return "_id"; }
    var s = k;

    // 1) 특수 오염 패턴 우선 정정
    var reA = new RegExp("^" + p + "_record_record_ise_");
    if (reA.test(s)) { s = s.replace(reA, p + "_record_"); }

    // 2) 오타: <p>_record_ise_ -> <p>_record_
    var reB = new RegExp("^" + p + "_record_ise_");
    if (reB.test(s)) { s = s.replace(reB, p + "_record_"); }

    // 3) 중복 record_ 압축: <p>_(record_)+ -> <p>_record_
    var reC = new RegExp("^" + p + "_(?:record_)+");
    if (reC.test(s)) { s = s.replace(reC, p + "_record_"); }

    // 4) 기본 규칙: <p>_ -> <p>_record_  (이미 record_면 유지)
    var reD = new RegExp("^" + p + "_(?!record_)");
    if (reD.test(s)) { s = s.replace(new RegExp("^" + p + "_"), p + "_record_"); }

    // 5) 이중 밑줄 수축: <p>_record__+ -> <p>_record_
    var reE = new RegExp("^" + p + "_record__+");
    if (reE.test(s)) { s = s.replace(reE, p + "_record_"); }

    return s;
    }

    // --------------------------------------------------------------------------------------------
    function walk (o) {
    if (o === null) { return null; }
    if (Array.isArray(o)) { return o.map(walk); }
    if (o && o._bsontype) { return o; }
    if (o instanceof Date) { return o; }
    if (typeof o === "object") {
      var out = {};
      for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) { continue; }
      if (k === "_id") { continue; }
      var nk = fixKey(k);
      out[nk] = walk(o[k]);
      }

      return out;
    }

    return o;
    }

    return walk(doc);
  },
  args: ["$$ROOT", pfx],
  lang: "js"
  };
}

// 실행
tasks.forEach(t => {
  if (!db.getCollectionNames().includes(t.col)) { print(`skip (not found): ${t.col}`); return; }

  // 0) 인덱스 안전조치
  db[t.col].getIndexes().forEach(i => {
  (i.key && i.key[`${t.prefix}_number`] === 1) && db[t.col].dropIndex(i.name);
  (i.key && i.key[`${t.prefix}_record_number`] === 1) && db[t.col].dropIndex(i.name);
  });

  // 1) 전체 문서 변환(_id 보존)
  db[t.col].updateMany(
  {},
  [
    { $set: { transformed: { $function: makeRenameFunction(t.prefix) } } },
    { $replaceWith: { $mergeObjects: ["$transformed", { _id: "$$ROOT._id" }] } }
  ]
  );
  print(`updated: ${t.col}`);

  // 2) 중복 검사(<prefix>_record_number 기준)
  db[t.col].aggregate([
  { $match: { [`${t.prefix}_record_number`]: { $exists: true } } },
  { $group: { _id: `$${t.prefix}_record_number`, cnt: { $sum: 1 }, ids: { $push: "$_id" } } },
  { $match: { cnt: { $gt: 1 } } }
  ]).forEach(d => printjson(Object.assign({ col: t.col }, d)));

  // 3) null 정리 후 부분 유니크 인덱스 재생성
  db[t.col].updateMany({ [`${t.prefix}_record_number`]: null }, { $unset: { [`${t.prefix}_record_number`]: "" } });
  db[t.col].createIndex(
  { [`${t.prefix}_record_number`]: 1 },
  { name: `${t.prefix}_record_number_1`, unique: true, partialFilterExpression: { [`${t.prefix}_record_number`]: { $exists: true } } }
  );
  print(`reindexed: ${t.col}`);
});

// ----------------------------------------------------------------------------------------------------------------
// - 추가: 필드명 일괄 변경 '*_record_section' -> '*_section'  (중첩 포함, 재진입 안전)
// ----------------------------------------------------------------------------------------------------------------
use("LIFECHANGE");

// ------------------------------------------------------------------------------------------------
function makeRecordSectionStripper () {
  return {
  body: function (doc) {
    // --------------------------------------------------------------------------------------------
    function fixKey (k) {
    return k === "_id" ? "_id" : k.replace(/_record_section/g, "_section");
    }

    // --------------------------------------------------------------------------------------------
    function walk (o) {
    if (o === null) { return null; }
    if (Array.isArray(o)) { return o.map(walk); }
    if (o && o._bsontype) { return o; }
    if (o instanceof Date) { return o; }
    if (typeof o === "object") {
      var out = {};
      for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) { continue; }
      if (k === "_id") { continue; }
      var nk = fixKey(k);
      out[nk] = walk(o[k]);
      }

      return out;
    }

    return o;
    }

    return walk(doc);
  },
  args: ["$$ROOT"],
  lang: "js"
  };
}

//const colsForSectionRename = ["exerciseRecord", "foodRecord", "moneyRecord", "sleepRecord", "schedule"];
const colsForSectionRename = ["schedule"];

colsForSectionRename
  .filter(c => db.getCollectionNames().includes(c))
  .forEach(c => {
  db[c].updateMany(
    {},
    [
    { $set: { transformed2: { $function: makeRecordSectionStripper() } } },
    { $replaceWith: { $mergeObjects: ["$transformed2", { _id: "$$ROOT._id" }] } }
    ]
  );
  print(`renamed '*_record_section' -> '*_section' in: ${c}`);
  });

// ----------------------------------------------------------------------------------------------------------------
// - 사용자 스키마 재명명: user.user_dataCategory, user.user_favorite
//   calendar -> schedule, *_part -> *_record_part, *_title -> *_record_title, food_* -> food_record_*
//   재진입 안전(이미 변환된 경우 유지)
// ----------------------------------------------------------------------------------------------------------------
use("LIFECHANGE");

db.getCollectionNames().includes("user") && db.user.updateMany(
  {},
  [
  // 1) user_dataCategory 키 재구성
  {
    $set: {
    user_dataCategory: {
      $function: {
      body: function (c) {
        var isObj = function (x) { return x && typeof x === "object" && !Array.isArray(x); };
        var arr = function (x) { return Array.isArray(x) ? x : []; };

        // schedule -> today
        var srcToday = isObj(c) && (Array.isArray(c.today) ? c.today : Array.isArray(c.schedule) ? c.schedule : []);
        /*   var srcExercise = isObj(c) ? arr(c.exercise) : [];
        var srcFood = isObj(c) ? arr(c.food) : [];
        var srcMoney = isObj(c) ? arr(c.money) : [];
        var srcSleep = isObj(c) ? arr(c.sleep) : []; */

        // 공통 매퍼
        var mapPart = function (obj, oldK, newK) {
        if (!obj || typeof obj !== "object") { return null; }
        var v = obj[newK]; // 이미 변환된 값 우선
        v = v !== undefined ? v : obj[oldK];
        if (v === undefined) { return null; }
        var out = {};
        out[newK] = v;

        return out;
        };
        var mapPartWithTitles = function (obj, oldPartK, newPartK, oldTitlesK, newTitlesK) {
        if (!obj || typeof obj !== "object") { return null; }
        var part = obj[newPartK];
        part = part !== undefined ? part : obj[oldPartK];
        var titles = obj[newTitlesK];
        titles = titles !== undefined ? titles : obj[oldTitlesK];

        if (part === undefined && titles === undefined) { return null; }
        var out = {};
        part !== undefined && (out[newPartK] = part);
        Array.isArray(titles) && (out[newTitlesK] = titles);

        return out;
        };

        // today: sc
        var schedule = srcSchedule.map(function (o) { return mapPart(o, "calendar_part", "schedule_record_part"); }).filter(Boolean);

        // exercise: exercise_part -> exercise_record_part, exercise_title -> exercise_record_title
        var exercise = srcExercise.map(function (o) { return mapPartWithTitles(o, "exercise_part", "exercise_record_part", "exercise_title", "exercise_record_title"); }).filter(Boolean);

        // food: food_part -> food_record_part, food_title(optional) -> food_record_title
        var food = srcFood.map(function (o) {
        var r = mapPartWithTitles(o, "food_part", "food_record_part", "food_title", "food_record_title");
        return r || mapPart(o, "food_part", "food_record_part");
        }).filter(Boolean);

        // money: money_part -> money_record_part, money_title -> money_record_title
        var money = srcMoney.map(function (o) { return mapPartWithTitles(o, "money_part", "money_record_part", "money_title", "money_record_title"); }).filter(Boolean);

        // sleep: sleep_part -> sleep_record_part
        var sleep = srcSleep.map(function (o) { return mapPart(o, "sleep_part", "sleep_record_part"); }).filter(Boolean);

        return { schedule: schedule, exercise: exercise, food: food, money: money, sleep: sleep };
      },
      args: ["$user_dataCategory"],
      lang: "js"
      }
    }
    }
  },

  // 2) user_favorite 내 food_* -> food_record_* 키 변환
  {
    $set: {
    user_favorite: {
      $function: {
      body: function (fav) {
        if (!Array.isArray(fav)) { return []; }
        return fav.map(function (o) {
        if (!o || typeof o !== "object") { return null; }
        var out = {};
        Object.keys(o).forEach(function (k) {
          var nk = /^food_(?!record_)/.test(k) ? k.replace(/^food_/, "food_record_") : k;
          out[nk] = o[k];
        });

        return out;
        }).filter(Boolean);
      },
      args: ["$user_favorite"],
      lang: "js"
      }
    }
    }
  }
  ]
);