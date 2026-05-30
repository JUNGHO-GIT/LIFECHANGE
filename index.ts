/**
 * @file index.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-14
 */

import "@assets/scripts/fetch";
import { loadEnv } from "@assets/scripts/env";
// admin
import { router as AdminRouter } from "@routers/admin/AdminRouter";
import { router as GoogleRouter } from "@routers/auth/GoogleRouter";
// calendar
import { router as ClndRtr } from "@routers/calendar/CalendarRouter";
// exercise
import { router as ExerChrtRtr } from "@routers/exercise/ExerciseChartRouter";
import { router as ExerGlRtr } from "@routers/exercise/ExerciseGoalRouter";
import { router as ExerRecRtr } from "@routers/exercise/ExerciseRecordRouter";
// food
import { router as FdChrtRtr } from "@routers/food/FoodChartRouter";
import { router as FdFavRtr } from "@routers/food/FoodFavoriteRouter";
import { router as FdFndRtr } from "@routers/food/FoodFindRouter";
import { router as FdGlRtr } from "@routers/food/FoodGoalRouter";
import { router as FdRecRtr } from "@routers/food/FoodRecordRouter";
// money
import { router as MnyChrtRtr } from "@routers/money/MoneyChartRouter";
import { router as MnyGlRtr } from "@routers/money/MoneyGoalRouter";
import { router as MnyRecRtr } from "@routers/money/MoneyRecordRouter";
// sleep
import { router as SlpChrtRtr } from "@routers/sleep/SleepChartRouter";
import { router as SlpGlRtr } from "@routers/sleep/SleepGoalRouter";
import { router as SlpRecRtr } from "@routers/sleep/SleepRecordRouter";
import { router as UserRouter } from "@routers/user/UserRouter";
// user
import { router as UsrSyncRtr } from "@routers/user/UserSyncRouter";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import mongoose from "mongoose";
import qs from "qs";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
loadEnv();
const app: Express = express();
const preFix: string = process.env.HTTP_PREFIX ?? ``;

// 서버 포트 설정 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
const httpPort: number = Number(process.env.HTTP_PORT);
const httpsPort: number = Number(process.env.HTTPS_PORT);
(function start(httpPrtPrm: number, httpPrtPrm2: number) {
	const httpServer = app.listen(httpPrtPrm, () => {
		console.log(`HTTP 서버가 포트 ${httpPrtPrm}에서 실행 중입니다.`);
	});
	httpServer.on(`error`, (err: unknown) => {
		if (err?.code === `EADDRINUSE`) {
			console.log(
				`${httpPrtPrm} 포트가 이미 사용 중입니다. 다른 포트로 변경합니다.`,
			);
			start(httpPrtPrm + 1, httpPrtPrm2);
		} else {
			console.error(`서버 실행 중 오류 발생: ${err}`);
		}
	});
})(httpPort, httpsPort);

// MongoDB 설정 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
const id: string | undefined = process.env.DB_USER;
const pw: string | undefined = process.env.DB_PASS;
const host: string | undefined = process.env.DB_HOST;
const port: string | undefined = process.env.DB_PORT;
const authSource: string | undefined = process.env.DB_AUTH_SOURCE;
const mode: string | undefined = process.env.ENV_MODE;
const db: string =
	mode === `PRODUCTION`
		? (process.env.DB_NAME ?? ``)
		: (process.env.DB_TEST ?? ``);
const athSrcQry: string = authSource
	? `?authSource=${encodeURIComponent(authSource)}`
	: ``;
const dbUser: string = encodeURIComponent(id ?? ``);
const dbPass: string = encodeURIComponent(pw ?? ``);
const isDev: boolean = mode === `DEVELOPMENT`;

mongoose
	.connect(`mongodb://${dbUser}:${dbPass}@${host}:${port}/${db}${athSrcQry}`)
	.then(() => {
		console.log(`[${mode}] MongoDB 연결 성공 [${db}]`);
	})
	.catch((error: unknown) => {
		console.error(`[${mode}] MongoDB 연결 실패 [${db}] ${error}`);
	});

// 로그 설정 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
if (isDev) {
	const color = {
		reset: `\u001B[0m`,
		coll: `\u001B[38;2;78;201;176m`,
		method: `\u001B[38;2;220;220;170m`,
		field: `\u001B[38;2;183;126;202m`,
		string: `\u001B[38;2;244;212;174m`,
		number: `\u001B[38;2;85;221;0m`,
		boolean: `\u001B[38;2;86;157;214m`,
		null: `\\x1b[38;2;86;157;214m`,
	};

	const fmtColl = (coll: string) => `${color.coll}${coll}${color.reset}`;
	const fmtMethod = (m: string) => `${color.method}${m}${color.reset}`;
	const fmtJson = (obj: any) =>
		JSON.stringify(obj, null, 2)
			.replaceAll(/"(\$[^"]+)":/g, `"${color.field}$1${color.reset}":`)
			.replaceAll(/"([^"$]+)":/g, `"${color.field}$1${color.reset}":`)
			.replaceAll(/: "([^"]*)"/g, `: "${color.string}$1${color.reset}"`)
			.replaceAll(/: (\d+)/g, `: ${color.number}$1${color.reset}`)
			.replaceAll(/: (true|false|null)/g, `: ${color.boolean}$1${color.reset}`);

	mongoose.set(`debug`, (coll, method, query, doc, options) => {
		const log = (...parts: string[]) => {
			console.log(...parts, `\n`);
		};
		const args: string[] = [query, doc, options]
			.filter((x) => x !== undefined)
			.map((element) => fmtJson(element));

		// 메서드 그룹별 처리
		if (
			[
				`aggregate`,
				`find`,
				`findOne`,
				`count`,
				`countDocuments`,
				`distinct`,
			].includes(method)
		) {
			console.log(`\n―――――――――――――――――――――――――――――――――――――――――――――`);
			log(
				`db.getCollection('${fmtColl(coll)}').${fmtMethod(method)}(`,
				args.join(`, `),
				`)`,
			);
		} else if (
			[
				`update`,
				`updateOne`,
				`updateMany`,
				`replaceOne`,
				`deleteOne`,
				`deleteMany`,
				`insertOne`,
				`insertMany`,
			].includes(method)
		) {
			console.log(`\n―――――――――――――――――――――――――――――――――――――――――――――`);
			log(
				`db.getCollection('${fmtColl(coll)}').${fmtMethod(method)}(`,
				args.join(`, `),
				`)`,
			);
		} else {
			console.log(`\n―――――――――――――――――――――――――――――――――――――――――――――`);
			log(
				`db.getCollection('${fmtColl(coll)}').${fmtMethod(method)}(`,
				args.join(`, `),
				`)`,
			);
		}
	});
}

// qs 파서 적용 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
app.set(`query parser`, (str: string) => qs.parse(str));

// 미들웨어 설정 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: `*`,
		methods: [`GET`, `POST`, `DELETE`, `PUT`],
		credentials: true,
		allowedHeaders: [`Content-Type`, `Authorization`],
		exposedHeaders: [`Authorization`],
		maxAge: 3600,
		optionsSuccessStatus: 204,
		preflightContinue: false,
	}),
);

// 라우터 설정 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// calendar
app.use(`${preFix}/calendar`, ClndRtr);

// exercise
app.use(`${preFix}/exercise/chart`, ExerChrtRtr);
app.use(`${preFix}/exercise/goal`, ExerGlRtr);
app.use(`${preFix}/exercise/record`, ExerRecRtr);

// food
app.use(`${preFix}/food/chart`, FdChrtRtr);
app.use(`${preFix}/food/goal`, FdGlRtr);
app.use(`${preFix}/food/record`, FdRecRtr);
app.use(`${preFix}/food/favorite`, FdFavRtr);
app.use(`${preFix}/food/find`, FdFndRtr);

// money
app.use(`${preFix}/money/chart`, MnyChrtRtr);
app.use(`${preFix}/money/goal`, MnyGlRtr);
app.use(`${preFix}/money/record`, MnyRecRtr);

// sleep
app.use(`${preFix}/sleep/chart`, SlpChrtRtr);
app.use(`${preFix}/sleep/goal`, SlpGlRtr);
app.use(`${preFix}/sleep/record`, SlpRecRtr);

// user
app.use(`${preFix}/user/sync`, UsrSyncRtr);
app.use(`${preFix}/user`, UserRouter);

// admin
app.use(`${preFix}/admin`, AdminRouter);
app.use(`${preFix}/auth/google`, GoogleRouter);

// 0. 에러처리 미들웨어 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
app.use((err: Error, req: Request, res: Response, _next: Function) => {
	console.error(err.stack);
	res.status(500).send({
		status: 500,
		message: err.message,
	});
});
