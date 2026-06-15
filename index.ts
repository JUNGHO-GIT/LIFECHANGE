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
import rateLimit from "express-rate-limit";
import helmet from "helmet";
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
// helmet 보안 헤더 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// CSP/COEP 를 켜면 vite/MUI/이미지 cross-origin 로딩이 깨지므로 보수적으로 비활성화한다.
// cors 앞에 배치해 모든 응답(프리플라이트 포함)에 보안 헤더를 우선 적용한다.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
// CORS origin 정책 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// credentials:true 와 origin:`*` 는 스펙 모순(자격 동반 와일드카드)이라 origin 을 화이트리스트로 좁힌다.
// dev: localhost:3000 + vite host:true 가 노출하는 LAN origin(사설 IP:3000) 허용 — e2e 통과 보장.
// prod: CLIENT_URL env 에서 scheme+host(+port)만 추출. 미설정 시 빈 목록이라도 안전하게 동작.
const corsOrigin = (
  reqOrigin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => {
  // origin 없는 요청(서버 간 호출, curl, same-origin 등)은 그대로 허용
  if (!reqOrigin) {
    callback(null, true);
    return;
  }

  // CLIENT_URL 에서 origin(프로토콜+호스트+포트)만 추출
  const allowList: string[] = [];
  const clientUrl: string = String(process.env.CLIENT_URL ?? ``).trim();
  if (clientUrl !== ``) {
    try {
      allowList.push(new URL(clientUrl).origin);
    }
    catch {
      // CLIENT_URL 형식 오류 시 무시(안전 기본값)
    }
  }

  // dev 에서는 localhost:3000 및 vite host:true 의 LAN origin(사설 IP:3000) 허용
  if (isDev) {
    allowList.push(`http://localhost:3000`, `http://127.0.0.1:3000`);
    const lanDevOrigin: RegExp =
      /^http:\/\/(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):3000$/;
    if (lanDevOrigin.test(reqOrigin)) {
      callback(null, true);
      return;
    }
  }

  callback(null, allowList.includes(reqOrigin));
};
app.use(
  cors({
    origin: corsOrigin,
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

// NoSQL 주입 방어(sanitize) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// qs.parse 가 DATE[$gt] 같은 중첩 키를 객체로 풀어 Mongo 연산자 주입 여지가 생긴다.
// req.query/body/params 를 재귀 순회하며 `$` 시작 키와 `.` 포함 키만 삭제한다.
// DATE[dateStart] 등 정상 중첩 키와 일반 문자열/숫자 값은 그대로 보존한다.
const sanitizeMongoKeys = (value: unknown, depth: number): void => {
  // 순환/과대 중첩 방어용 깊이 상한
  if (depth > 20 || value === null || typeof value !== `object`) {
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      sanitizeMongoKeys(item, depth + 1);
    }
    return;
  }
  const target = value as Record<string, unknown>;
  for (const key of Object.keys(target)) {
    if (key.startsWith(`$`) || key.includes(`.`)) {
      delete target[key];
      continue;
    }
    sanitizeMongoKeys(target[key], depth + 1);
  }
};
app.use((req: Request, _res: Response, next: Function) => {
  // req.query 는 express 5 에서 getter-only 라 in-place 로만 정리한다.
  sanitizeMongoKeys(req.query, 0);
  sanitizeMongoKeys(req.body, 0);
  sanitizeMongoKeys(req.params, 0);
  next();
});

// rate-limit 설정 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// 로그인/이메일발송 등 민감 엔드포인트(/user, /auth/google)에만 적용.
// 개발/e2e 연속요청을 막지 않도록 windowMs/max 를 넉넉히 두고, DEVELOPMENT 에서는 매우 관대하게.
const limitWindowMs: number = Number(
  process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000,
);
const limitMax: number = isDev
  ? Number(process.env.RATE_LIMIT_MAX_DEV ?? 100_000)
  : Number(process.env.RATE_LIMIT_MAX ?? 1000);
const sensitiveLimiter = rateLimit({
  windowMs: limitWindowMs,
  max: limitMax,
  standardHeaders: true,
  legacyHeaders: false,
});

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

// user (민감 엔드포인트 — rate-limit 적용)
app.use(`${preFix}/user/sync`, sensitiveLimiter, UserSyncRouter);
app.use(`${preFix}/user`, sensitiveLimiter, UserRouter);

// admin
app.use(`${preFix}/admin`, AdminRouter);
app.use(`${preFix}/auth/google`, sensitiveLimiter, GoogleRouter);

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
