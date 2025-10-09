// index.ts

import qs from "qs";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

// admin
import { router as AdminRouter } from "@routers/admin/AdminRouter";

// today
import { router as TodayGoalRouter } from "@routers/today/TodayGoalRouter";
import { router as TodayRecordRouter } from "@routers/today/TodayRecordRouter";

// calendar
import { router as CalendarRouter } from "@routers/calendar/CalendarRouter";

// exercise
import { router as ExerciseChartRouter } from "@routers/exercise/ExerciseChartRouter";
import { router as ExerciseGoalRouter } from "@routers/exercise/ExerciseGoalRouter";
import { router as ExerciseRecordRouter } from "@routers/exercise/ExerciseRecordRouter";

// food
import { router as FoodChartRouter } from "@routers/food/FoodChartRouter";
import { router as FoodGoalRouter } from "@routers/food/FoodGoalRouter";
import { router as FoodRecordRouter } from "@routers/food/FoodRecordRouter";
import { router as FoodFavoriteRouter } from "@routers/food/FoodFavoriteRouter";
import { router as FoodFindRouter } from "@routers/food/FoodFindRouter";

// money
import { router as MoneyChartRouter } from "@routers/money/MoneyChartRouter";
import { router as MoneyGoalRouter } from "@routers/money/MoneyGoalRouter";
import { router as MoneyRecordRouter } from "@routers/money/MoneyRecordRouter";

// sleep
import { router as SleepChartRouter } from "@routers/sleep/SleepChartRouter";
import { router as SleepGoalRouter } from "@routers/sleep/SleepGoalRouter";
import { router as SleepRecordRouter } from "@routers/sleep/SleepRecordRouter";

// user
import { router as UserSyncRouter } from "@routers/user/UserSyncRouter";
import { router as UserRouter } from "@routers/user/UserRouter";
import { router as GoogleRouter } from "@routers/auth/GoogleRouter";

// -------------------------------------------------------------------------------------------------
dotenv.config();
const app = express();
const preFix = process.env.HTTP_PREFIX || "";

// 서버 포트 설정 ----------------------------------------------------------------------------------
const httpPort = Number(process.env.HTTP_PORT);
const httpsPort = Number(process.env.HTTPS_PORT);
(function start (httpPort: number, httpsPort: number) {
	try {
		const httpServer = app.listen(httpPort, () => {
			console.log(`HTTP 서버가 포트 ${httpPort}에서 실행 중입니다.`);
		});
		httpServer.on('error', (err: any) => {
			if (err?.code === 'EADDRINUSE') {
				console.log(`${httpPort} 포트가 이미 사용 중입니다. 다른 포트로 변경합니다.`);
				start(httpPort + 1, httpsPort);
			}
			else {
				console.error(`서버 실행 중 오류 발생: ${err}`);
			}
		});
	}
	catch (err: any) {
		console.error(`서버 실행 중 오류 발생: ${err}`);
	}
})(httpPort, httpsPort);

// MongoDB 설정 ------------------------------------------------------------------------------------
const id = process.env.DB_USER;
const pw = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME
// const db = process.env.DB_TEST
const envStr = db === process.env.DB_TEST ? "DEVELOPMENT" : "PRODUCTION";

mongoose.connect(`mongodb://${id}:${pw}@${host}:${port}/${db}`)
	.then(() => {
		console.log(`[${envStr}] MongoDB 연결 성공 [${db}]`);
	})
	.catch((err: any) => {
		console.error(`[${envStr}] MongoDB 연결 실패 [${db}] ${err}`);
	});

// 로그 설정 -------------------------------------------------------------------------------------------
if (envStr === "DEVELOPMENT") {
	const color = {
		reset: "\x1b[0m",
		coll: "\x1b[38;2;78;201;176m",
		method: "\x1b[38;2;220;220;170m",
		field: "\x1b[38;2;183;126;202m",
		string: "\x1b[38;2;244;212;174m",
		number: "\x1b[38;2;85;221;0m",
		boolean: "\x1b[38;2;86;157;214m",
		null: "\\x1b[38;2;86;157;214m",
	};

	const fmtColl = (coll: string) => `${color.coll}${coll}${color.reset}`;
	const fmtMethod = (m: string) => `${color.method}${m}${color.reset}`;
	const fmtJson = (obj: any) => JSON.stringify(obj, null, 2)
	.replace(/"(\$[^"]+)":/g, `"${color.field}$1${color.reset}":`)
	.replace(/"([^"$]+)":/g, `"${color.field}$1${color.reset}":`)
	.replace(/: "([^"]*)"/g, `: "${color.string}$1${color.reset}"`)
	.replace(/: (\d+)/g, `: ${color.number}$1${color.reset}`)
	.replace(/: (true|false|null)/g, `: ${color.boolean}$1${color.reset}`);

	mongoose.set('debug', (coll, method, query, doc, options) => {
		const log = (...parts: string[]) => console.log(...parts, '\n');
		const args = [query, doc, options]?.filter(x => x !== undefined).map(fmtJson);

		// 메서드 그룹별 처리
		if (['aggregate', 'find', 'findOne', 'count', 'countDocuments', 'distinct'].includes(method)) {
			console.log(`\n---------------------------------------------`);
			log(
				`db.getCollection('${fmtColl(coll)}').${fmtMethod(method)}(`,
				args.join(', '),
				')'
			);
		}
		else if (['update', 'updateOne', 'updateMany', 'replaceOne', 'deleteOne', 'deleteMany', 'insertOne', 'insertMany'].includes(method)) {
			console.log(`\n---------------------------------------------`);
			log(
				`db.getCollection('${fmtColl(coll)}').${fmtMethod(method)}(`,
				args.join(', '),
				')'
			);
		}
		else {
			console.log(`\n---------------------------------------------`);
			log(
				`db.getCollection('${fmtColl(coll)}').${fmtMethod(method)}(`,
				args.join(', '),
				')'
			);
		}
	});
}

// qs 파서 적용 ------------------------------------------------------------------------------------
app.set('query parser', (str: string) => qs.parse(str));

// 미들웨어 설정 -----------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
	origin: "*",
	methods: ["GET", "POST", "DELETE", "PUT"],
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
	exposedHeaders: ["Authorization"],
	maxAge: 3600,
	optionsSuccessStatus: 204,
	preflightContinue: false,
}));

// 라우터 설정 -------------------------------------------------------------------------------------
// today
app.use(`${preFix}/today/goal`, TodayGoalRouter);
app.use(`${preFix}/today/record`, TodayRecordRouter);

// calendar
app.use(`${preFix}/calendar`, CalendarRouter);

// exercise
app.use(`${preFix}/exercise/chart`, ExerciseChartRouter);
app.use(`${preFix}/exercise/goal`, ExerciseGoalRouter);
app.use(`${preFix}/exercise/record`, ExerciseRecordRouter);

// food
app.use(`${preFix}/food/chart`, FoodChartRouter);
app.use(`${preFix}/food/goal`, FoodGoalRouter);
app.use(`${preFix}/food/record`, FoodRecordRouter);
app.use(`${preFix}/food/favorite`, FoodFavoriteRouter);
app.use(`${preFix}/food/find`, FoodFindRouter);

// money
app.use(`${preFix}/money/chart`, MoneyChartRouter);
app.use(`${preFix}/money/goal`, MoneyGoalRouter);
app.use(`${preFix}/money/record`, MoneyRecordRouter);

// sleep
app.use(`${preFix}/sleep/chart`, SleepChartRouter);
app.use(`${preFix}/sleep/goal`, SleepGoalRouter);
app.use(`${preFix}/sleep/record`, SleepRecordRouter);

// user
app.use(`${preFix}/user/sync`, UserSyncRouter);
app.use(`${preFix}/user`, UserRouter);
app.use(`${preFix}/admin`, AdminRouter);
app.use(`${preFix}/auth/google`, GoogleRouter);

// 0. 에러처리 미들웨어 -----------------------------------------------------------------------
app.use((err: Error, req: Request, res: Response, next: Function) => {
	console.error(err.stack);
	// @ts-ignore
	res.status(500).send({
		status: 500,
		message: err.message,
	});
});