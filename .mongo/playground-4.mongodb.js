use("LIFECHANGE_TEST");
db.getCollection('user').findOneAndUpdate( {
  "user_id": "junghomun00@gmail.com"
}, {
  "$setOnInsert": {
    "__v": 0,
    "user_number": 0,
    "user_google": "N",
    "user_token": "",
    "user_pw": "",
    "user_image": "",
    "user_initScale": "",
    "user_minScale": "",
    "user_maxScale": "",
    "user_curScale": "",
    "user_initAvgKcalIntake": "",
    "user_totalKcalIntake": "",
    "user_totalCarbIntake": "",
    "user_totalProteinIntake": "",
    "user_totalFatIntake": "",
    "user_curAvgKcalIntake": "",
    "user_curAvgCarbIntake": "",
    "user_curAvgProteinIntake": "",
    "user_curAvgFatIntake": "",
    "user_initProperty": "",
    "user_totalIncomeAll": "",
    "user_totalIncomeExclusion": "",
    "user_totalExpenseAll": "",
    "user_totalExpenseExclusion": "",
    "user_curPropertyAll": "",
    "user_curPropertyExclusion": "",
    "user_favorite": [],
    "user_regDt": "2025-10-28T16:13:59.080Z"
  },
  "$set": {
		"user_dataCategory": {
			"exercise": [
				{
					"exercise_record_part": "all",
					"exercise_record_title": [
						"all"
					]
				},
				{
					"exercise_record_part": "back",
					"exercise_record_title": [
						"all",
						"deadLift",
						"바벨로우",
						"dumbbellRow",
						"seatedRow",
						"latPulldown",
						"pullUp"
					]
				},
				{
					"exercise_record_part": "leg",
					"exercise_record_title": [
						"all",
						"backSquat",
						"frontSquat",
						"hackSquat",
						"barbellLunge",
						"dumbbellLunge",
						"legPress",
						"legExtension",
						"legCurl"
					]
				},
				{
					"exercise_record_part": "가슴2",
					"exercise_record_title": [
						"all",
						"barbellBenchPress",
						"dumbbellBenchPress",
						"machineBenchPress",
						"inclineBenchPress",
						"declineBenchPress",
						"dumbbellFly",
						"cableFly",
						"cableCrossover",
						"dips",
						"pushUp"
					]
				},
				{
					"exercise_record_part": "shoulder",
					"exercise_record_title": [
						"all",
						"militaryPress",
						"barbellPress",
						"dumbbellPress",
						"machinePress",
						"behindNeckPress",
						"frontLateralRaise",
						"sideLateralRaise",
						"bentOverLateralRaise",
						"facePull"
					]
				},
				{
					"exercise_record_part": "triceps",
					"exercise_record_title": [
						"all",
						"lyingTricepsExtension",
						"dumbbellTricepsExtension",
						"overheadTricepsExtension",
						"closeGripBenchPress",
						"cableTricepsPushDown",
						"cableTricepsRopeDown",
						"kickback"
					]
				},
				{
					"exercise_record_part": "biceps",
					"exercise_record_title": [
						"all",
						"barbellCurl",
						"dumbbellCurl",
						"hammerCurl",
						"machineCurl",
						"cableCurl",
						"barbellPreacherCurl",
						"dumbbellPreacherCurl"
					]
				},
				{
					"exercise_record_part": "cardio",
					"exercise_record_title": [
						"all",
						"walking",
						"running",
						"stepper",
						"cycling",
						"swimming",
						"plank"
					]
				},
				{
					"exercise_record_part": "rest",
					"exercise_record_title": [
						"all",
						"rest"
					]
				}
			],
			"food": [
				{
					"food_record_part": "all"
				},
				{
					"food_record_part": "breakfast"
				},
				{
					"food_record_part": "점심222444"
				},
				{
					"food_record_part": "dinner"
				},
				{
					"food_record_part": "간식2"
				}
			],
			"money": [
				{
					"money_record_part": "all",
					"money_record_title": [
						"all"
					]
				},
				{
					"money_record_part": "income",
					"money_record_title": [
						"all",
						"labor",
						"finance"
					]
				},
				{
					"money_record_part": "expense",
					"money_record_title": [
						"all",
						"식비",
						"담배",
						"주유",
						"차량",
						"빨래",
						"생필품",
						"이자",
						"IT",
						"기타"
					]
				}
			],
			"sleep": [
				{
					"sleep_record_part": "all"
				},
				{
					"sleep_record_part": "bedTime"
				},
				{
					"sleep_record_part": "wakeTime"
				},
				{
					"sleep_record_part": "sleepTime"
				},
				{
					"sleep_record_part": "낮잠"
				}
			]
		},
    "user_updateDt": "2025-10-28T16:13:59.077Z"
  }
}, {
  "upsert": true,
  "returnDocument": "after",
  "returnOriginal": false
} )