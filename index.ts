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
import { router as CalendarRouter } from "@routers/calendar/CalendarRouter";
// exercise
import { router as ExerciseChartRouter } from "@routers/exercise/ExerciseChartRouter";
import { router as ExerciseGoalRouter } from "@routers/exercise/ExerciseGoalRouter";
import { router as ExerciseRecordRouter } from "@routers/exercise/ExerciseRecordRouter";
// food
import { router as FoodChartRouter } from "@routers/food/FoodChartRouter";
import { router as FoodFavoriteRouter } from "@routers/food/FoodFavoriteRouter";
import { router as FoodFindRouter } from "@routers/food/FoodFindRouter";
import { router as FoodGoalRouter } from "@routers/food/FoodGoalRouter";
import { router as FoodRecordRouter } from "@routers/food/FoodRecordRouter";
// money
import { router as MoneyChartRouter } from "@routers/money/MoneyChartRouter";
import { router as MoneyGoalRouter } from "@routers/money/MoneyGoalRouter";
import { router as MoneyRecordRouter } from "@routers/money/MoneyRecordRouter";
// sleep
import { router as SleepChartRouter } from "@routers/sleep/SleepChartRouter";
import { router as SleepGoalRouter } from "@routers/sleep/SleepGoalRouter";
import { router as SleepRecordRouter } from "@routers/sleep/SleepRecordRouter";
import { router as UserRouter } from "@routers/user/UserRouter";
// user
import { router as UserSyncRouter } from "@routers/user/UserSyncRouter";
import compression from "compression";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import mongoose from "mongoose";
import qs from "qs";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
loadEnv();
const app: Express = express();
const preFix: string = process.env.HTTP_PREFIX ?? ``;

// 필수 환경변수 검증 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// loadEnv() 직후 index.ts 가 실제 소비하는 키 존재/형식을 한 번에 검사하고, 누락 시 fail-fast.
(function validateEnv() {
  const requiredKeys: string[] = [
    `HTTP_PORT`,
    `ENV_MODE`,
    `DB_USER`,
    `DB_PASS`,
    `DB_HOST`,
    `DB_PORT`,
  ];
  const missingKeys: string[] = requiredKeys.filter((key) => {
    const value: string = String(process.env[key] ?? ``).trim();
    return value === ``;
  });

  // ENV_MODE 에 따라 사용하는 DB 이름 키(PRODUCTION=DB_NAME, 그 외=DB_TEST)도 검증
  const dbNameKey: string =
    process.env.ENV_MODE === `PRODUCTION` ? `DB_NAME` : `DB_TEST`;
  if (String(process.env[dbNameKey] ?? ``).trim() === ``) {
    missingKeys.push(dbNameKey);
  }

  if (missingKeys.length > 0) {
    console.error(`[ENV] 필수 환경변수 누락: ${missingKeys.join(`, `)}`);
    process.exit(1);
  }

  if (!Number.isFinite(Number(process.env.HTTP_PORT))) {
    console.error(`[ENV] HTTP_PORT 형식 오류: ${process.env.HTTP_PORT}`);
    process.exit(1);
  }
})();

// 서버 포트 설정 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
const httpPort: number = Number(process.env.HTTP_PORT);
const httpsPort: number = Number(process.env.HTTPS_PORT);
const MAX_PORT_RETRY: number = 10;
let httpServer: ReturnType<typeof app.listen>;
(function start(
  httpPortParam: number,
  httpsPortParam: number,
  retryParam: number,
) {
  httpServer = app.listen(httpPortParam, () => {
    console.log(`HTTP 서버가 포트 ${httpPortParam}에서 실행 중입니다.`);
  });
  httpServer.on(`error`, (err: NodeJS.ErrnoException) => {
    if (err.code === `EADDRINUSE`) {
      if (retryParam >= MAX_PORT_RETRY) {
        console.error(
          `포트 재시도 상한(${MAX_PORT_RETRY}회) 초과: ${httpPortParam}까지 모두 사용 중입니다. 종료합니다.`,
        );
        process.exit(1);
      }
      console.log(
        `${httpPortParam} 포트가 이미 사용 중입니다. 다른 포트로 변경합니다.`,
      );
      start(httpPortParam + 1, httpsPortParam, retryParam + 1);
    } else {
      console.error(`서버 실행 중 오류 발생: ${err}`);
      process.exit(1);
    }
  });
})(httpPort, httpsPort, 0);

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
const isDev: boolean = mode === `DEVELOPMENT`;

mongoose
  .connect(
    `mongodb://${encodeURIComponent(id ?? ``)}:${encodeURIComponent(pw ?? ``)}@${host}:${port}/${db}${athSrcQry}`,
    {
      maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE ?? 50),
      minPoolSize: Number(process.env.DB_MIN_POOL_SIZE ?? 0),
      serverSelectionTimeoutMS: Number(
        process.env.DB_SERVER_SELECTION_TIMEOUT_MS ?? 10_000,
      ),
      socketTimeoutMS: Number(process.env.DB_SOCKET_TIMEOUT_MS ?? 45_000),
      maxIdleTimeMS: Number(process.env.DB_MAX_IDLE_TIME_MS ?? 60_000),
    },
  )
  .then(() => {
    console.log(`[${mode}] MongoDB 연결 성공 [${db}]`);
  })
  .catch((error: unknown) => {
    console.error(`[${mode}] MongoDB 연결 실패 [${db}] ${error}`);
    process.exit(1);
  });

// 로그 설정 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
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

    // 모든 메서드 그룹이 동일 포맷이므로 단일 분기로 처리
    console.log(`\n――――――――――――――――――――――――――――――――――――――――――――-`);
    log(
      `db.getCollection('${fmtColl(coll)}').${fmtMethod(method)}(`,
      args.join(`, `),
      `)`,
    );
  });
}

// qs 파서 적용 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// express 5 기본 query parser 는 'simple'(node querystring)로 중첩 객체를 못 푼다.
// 클라이언트가 DATE/PAGING 등을 중첩 객체(DATE[dateStart]=...)로 전송하므로 qs.parse 가 필수다.
app.set(`query parser`, (str: string) => qs.parse(str));

// 미들웨어 설정 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
const bodyLimit: string = process.env.HTTP_BODY_LIMIT ?? `1mb`;
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));
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
app.use(compression());

// 헬스체크/레디니스 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// 인증 없는 경량 엔드포인트. health 는 liveness(200 고정), ready 는 readiness(DB 연결 상태).
app.get(`${preFix}/health`, (_req: Request, res: Response) => {
  res.status(200).json({ status: `ok` });
});
app.get(`${preFix}/ready`, (_req: Request, res: Response) => {
  const isReady: boolean = mongoose.connection.readyState === 1;
  res
    .status(isReady ? 200 : 503)
    .json({ status: isReady ? `ready` : `not-ready` });
});

// 라우터 설정 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
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

// admin
app.use(`${preFix}/admin`, AdminRouter);
app.use(`${preFix}/auth/google`, GoogleRouter);

// 0. 에러처리 미들웨어 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
app.use((err: Error, req: Request, res: Response, _next: Function) => {
  console.error(err.stack);
  res.status(500).send({
    status: 500,
    message: err.message,
  });
});

// 1. graceful shutdown ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// SIGTERM/SIGINT 수신 시 in-flight 요청 drain → httpServer.close → mongoose.disconnect 후 종료.
let shuttingDown: boolean = false;
const gracefulShutdown = async (signal: string) => {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[${signal}] 종료 절차 시작`);

  // hang 방지용 강제 종료 타이머
  const forceTimer = setTimeout(() => {
    console.error(`종료 지연으로 강제 종료합니다.`);
    process.exit(1);
  }, 10_000);
  forceTimer.unref();

  try {
    await new Promise<void>((resolve) => {
      httpServer?.close(() => resolve());
    });
    await mongoose.disconnect();
    console.log(`종료 완료`);
    process.exit(0);
  } catch (error: unknown) {
    console.error(`종료 중 오류 발생: ${error}`);
    process.exit(1);
  }
};
process.on(`SIGTERM`, () => {
  void gracefulShutdown(`SIGTERM`);
});
process.on(`SIGINT`, () => {
  void gracefulShutdown(`SIGINT`);
});

// 2. 전역 예외 핸들러 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// unhandledRejection 은 로깅 후 유지, uncaughtException 은 로깅 후 안전 종료(프로세스 매니저 재시작 유도).
process.on(`unhandledRejection`, (reason: unknown) => {
  console.error(`unhandledRejection: ${reason}`);
});
process.on(`uncaughtException`, (error: Error) => {
  console.error(`uncaughtException: ${error.stack ?? error}`);
  void gracefulShutdown(`uncaughtException`);
});
