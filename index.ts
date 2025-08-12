// index.ts

import qs from "qs";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express, {Request, Response} from "express";

import {router as adminRouter} from "@routers/admin/adminRouter";
import {router as calendarRouter} from "@routers/calendar/calendarRouter";
import {router as exerciseChartRouter} from "@routers/exercise/exerciseChartRouter";
import {router as exerciseRouter} from "@routers/exercise/exerciseRouter";
import {router as exerciseGoalRouter} from "@routers/exercise/exerciseGoalRouter";
import {router as foodChartRouter} from "@routers/food/foodChartRouter";
import {router as foodFindRouter} from "@routers/food/foodFindRouter";
import {router as foodRouter} from "@routers/food/foodRouter";
import {router as foodGoalRouter} from "@routers/food/foodGoalRouter";
import {router as moneyChartRouter} from "@routers/money/moneyChartRouter";
import {router as moneyRouter} from "@routers/money/moneyRouter";
import {router as moneyGoalRouter} from "@routers/money/moneyGoalRouter";
import {router as sleepChartRouter} from "@routers/sleep/sleepChartRouter";
import {router as sleepRouter} from "@routers/sleep/sleepRouter";
import {router as sleepGoalRouter} from "@routers/sleep/sleepGoalRouter";
import {router as userSyncRouter} from "@routers/user/userSyncRouter";
import {router as userRouter} from "@routers/user/userRouter";
import {router as googleRouter} from "@routers/auth/googleRouter";

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
if (process.env.NODE_ENV !== 'production') {
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
app.use(express.urlencoded({extended: true}));
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
app.use(`${preFix}/admin`, adminRouter);
app.use(`${preFix}/calendar`, calendarRouter);
app.use(`${preFix}/exercise/chart`, exerciseChartRouter);
app.use(`${preFix}/exercise/goal`, exerciseGoalRouter);
app.use(`${preFix}/exercise`, exerciseRouter);
app.use(`${preFix}/food/chart`, foodChartRouter);
app.use(`${preFix}/food/goal`, foodGoalRouter);
app.use(`${preFix}/food/find`, foodFindRouter);
app.use(`${preFix}/food`, foodRouter);
app.use(`${preFix}/money/chart`, moneyChartRouter);
app.use(`${preFix}/money/goal`, moneyGoalRouter);
app.use(`${preFix}/money`, moneyRouter);
app.use(`${preFix}/sleep/chart`, sleepChartRouter);
app.use(`${preFix}/sleep/goal`, sleepGoalRouter);
app.use(`${preFix}/sleep`, sleepRouter);
app.use(`${preFix}/user/sync`, userSyncRouter);
app.use(`${preFix}/user`, userRouter);
app.use(`${preFix}/auth/google`, googleRouter);

// 에러 처리 미들웨어 ------------------------------------------------------------------------------
app.use((err: Error, req: Request, res: Response, next: Function) => {
	console.error(err.stack);
	res.status(500).send({
		status: 500,
		message: err.message,
	});
});