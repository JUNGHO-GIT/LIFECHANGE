/**
 * @file index.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-14
 */

import "@assets/scripts/fetch";
import { loadEnv } from "@assets/scripts/env";
import { sanitizeMongoKeys } from "@assets/scripts/sanitize";
// auth
import { requireAdmin, requireAuth } from "@middlewares/auth/AuthMiddleware";
// admin
import { router as AdminRouter } from "@routers/admin/AdminRouter";
import { router as GoogleRouter } from "@routers/auth/GoogleRouter";
// calendar
import { router as CalendarRouter } from "@routers/calendar/CalendarRouter";
// exercise
import { router as ExerciseRecordChartRouter } from "@routers/exercise/ExerciseRecordChartRouter";
import { router as ExerciseGoalChartRouter } from "@routers/exercise/ExerciseGoalChartRouter";
import { router as ExerciseGoalRouter } from "@routers/exercise/ExerciseGoalRouter";
import { router as ExerciseRecordRouter } from "@routers/exercise/ExerciseRecordRouter";
import { router as ExerciseFavoriteRouter } from "@routers/exercise/ExerciseFavoriteRouter";
// food
import { router as FoodRecordChartRouter } from "@routers/food/FoodRecordChartRouter";
import { router as FoodGoalChartRouter } from "@routers/food/FoodGoalChartRouter";
import { router as FoodFavoriteRouter } from "@routers/food/FoodFavoriteRouter";
import { router as FoodFindRouter } from "@routers/food/FoodFindRouter";
import { router as FoodGoalRouter } from "@routers/food/FoodGoalRouter";
import { router as FoodRecordRouter } from "@routers/food/FoodRecordRouter";
// money
import { router as MoneyRecordChartRouter } from "@routers/money/MoneyRecordChartRouter";
import { router as MoneyGoalChartRouter } from "@routers/money/MoneyGoalChartRouter";
import { router as MoneyGoalRouter } from "@routers/money/MoneyGoalRouter";
import { router as MoneyRecordRouter } from "@routers/money/MoneyRecordRouter";
import { router as MoneyFavoriteRouter } from "@routers/money/MoneyFavoriteRouter";
// sleep
import { router as SleepRecordChartRouter } from "@routers/sleep/SleepRecordChartRouter";
import { router as SleepGoalChartRouter } from "@routers/sleep/SleepGoalChartRouter";
import { router as SleepGoalRouter } from "@routers/sleep/SleepGoalRouter";
import { router as SleepRecordRouter } from "@routers/sleep/SleepRecordRouter";
import { router as SleepFavoriteRouter } from "@routers/sleep/SleepFavoriteRouter";
import { router as UserRouter } from "@routers/user/UserRouter";
// user
import { router as UserSyncRouter } from "@routers/user/UserSyncRouter";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import compression from "compression";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import qs from "qs";

// -------------------------------------------------------------------------------------------------
loadEnv();
const app: Express = express();
const preFix: string = process.env.HTTP_PREFIX ?? ``;

// 필수 환경변수 검증 -----------------------------------------------------------------------------
(function validateEnv() {
  const requiredKeys: string[] = [
    `HTTP_PORT`,
    `ENV_MODE`,
    `DB_USER`,
    `DB_PASS`,
    `DB_HOST`,
    `DB_PORT`,
    `JWT_SECRET`,
  ];
  const missingKeys: string[] = requiredKeys.filter((key) => {
    const value: string = String(process.env[key] ?? ``).trim();
    return value === ``;
  });

  const dbNameKey: string = process.env.ENV_MODE === `PRODUCTION` ? `DB_NAME` : `DB_TEST`;
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

  // 짧은 서명키는 토큰 위조 리스크로 이어지므로 최소 길이를 요구함
  if (String(process.env.JWT_SECRET ?? ``).trim().length < 32) {
    console.error(`[ENV] JWT_SECRET 은 32자 이상이어야 합니다.`);
    process.exit(1);
  }
})();

// 서버 포트 설정 ----------------------------------------------------------------------------------
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

// MongoDB 설정 ------------------------------------------------------------------------------------
const id: string | undefined = process.env.DB_USER;
const pw: string | undefined = process.env.DB_PASS;
const host: string | undefined = process.env.DB_HOST;
const port: string | undefined = process.env.DB_PORT;
const authSource: string | undefined = process.env.DB_AUTH_SOURCE;
const mode: string | undefined = process.env.ENV_MODE;
const db: string = mode === `PRODUCTION` ? (process.env.DB_NAME ?? ``) : (process.env.DB_TEST ?? ``);
const athSrcQry: string = authSource ? `?authSource=${encodeURIComponent(authSource)}` : ``;
const isDev: boolean = mode === `DEVELOPMENT`;

mongoose.connect(
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

// 로그 설정 -------------------------------------------------------------------------------------------
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
  const fmtJson = (obj: any) => JSON.stringify(obj, null, 2)
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

    console.log(`\n---------------------------------------------`);
    log(
      `db.getCollection('${fmtColl(coll)}').${fmtMethod(method)}(`,
      args.join(`, `),
      `)`,
    );
  });
}

// 프록시 신뢰 범위 --------------------------------------------------------------------------------
// - 리버스 프록시 뒤에 배포되므로 X-Forwarded-For 를 신뢰하지 않으면 모든 요잭이 프록시 IP
//   하나로 집계되어 rate limit 이 전 사용자 공용 버킷이 됨
// - 과다 신뢰는 IP 위조를 허용하므로 기본은 직전 통과 토큼 1단계만 신뢰함
app.set(`trust proxy`, Number(process.env.TRUST_PROXY_HOPS ?? 1));

// qs 파서 적용 ------------------------------------------------------------------------------------
app.set(`query parser`, (str: string) => qs.parse(str));

// 미들웨어 설정 -----------------------------------------------------------------------------------
const bodyLimit: string = process.env.HTTP_BODY_LIMIT ?? `1mb`;
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));
// helmet 보안 헤더 -----------------------------------------------------------------------------
// - 이 서버는 JSON API 만 반환하므로 하위 리소스 로드를 전면 차단하는 CSP 가 기본값이 됨
// - 클라이언트 정적 자원은 별도 호스팅이므로 여기서의 CSP 가 화면 렌더를 제약하지 않음
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: [`'none'`],
        baseUri: [`'none'`],
        formAction: [`'none'`],
        frameAncestors: [`'none'`],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
// CORS origin 정책 ----------------------------------------------------------------------------
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
    // 인증은 Authorization 헤더만 사용하므로 쿠키 동반 요청을 허용하지 않음
    credentials: false,
    allowedHeaders: [`Content-Type`, `Authorization`],
    exposedHeaders: [`Authorization`],
    maxAge: 3600,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  }),
);
app.use(compression());

// NoSQL 주입 방어(sanitize) -------------------------------------------------------------------
// - 정리 구현은 서버 경로와 서버 내부 파싱 경로가 같은 기지를 공용해야 하므로 유틸로 분리함
// req.query 는 express 5 에서 접근할 때마다 재파싱하는 getter 라 in-place 정리가 사라짐
// 정리한 결과를 고정 값으로 재정의해 이후 모든 읽기가 동일한 sanitized 객체를 보게 함
app.use((req: Request, _res: Response, next: NextFunction) => {
  const query: Record<string, unknown> = {
    ...(req.query as Record<string, unknown>),
  };
  sanitizeMongoKeys(query, 0);
  Object.defineProperty(req, `query`, {
    value: query,
    configurable: true,
    enumerable: true,
    writable: true,
  });

  sanitizeMongoKeys(req.body, 0);
  sanitizeMongoKeys(req.params, 0);
  next();
});

// rate-limit 설정 ------------------------------------------------------------------------------
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

// 자객증명 추정·인증코드 남용 방어용 전용 리및트 (일반 조회보다 훨심 엄겪한 창)
const authWindowMs: number = Number(
  process.env.AUTH_LIMIT_WINDOW_MS ?? 10 * 60 * 1000,
);
const authLimitMax: number = isDev
  ? Number(process.env.AUTH_LIMIT_MAX_DEV ?? 100_000)
  : Number(process.env.AUTH_LIMIT_MAX ?? 20);
const authLimiter = rateLimit({
  windowMs: authWindowMs,
  max: authLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});

// 헬스체크/레디니스 -----------------------------------------------------------------------------
app.get(`${preFix}/health`, (_req: Request, res: Response) => {
  res.status(200).json({ status: `ok` });
});
app.get(`${preFix}/ready`, (_req: Request, res: Response) => {
  const isReady: boolean = mongoose.connection.readyState === 1;
  res
    .status(isReady ? 200 : 503)
    .json({ status: isReady ? `ready` : `not-ready` });
});

// 라우터 설정 -------------------------------------------------------------------------------------
// - 도메인 라우터는 전원 requireAuth 게이트, 본문·쿼리의 user_id 는 토큰 주체로 대체됨
// - 공개 경로는 로그인·가입·비밀번호재설정·이메일인증·구글 OAuth·헬스체크만 해당함
// calendar
app.use(`${preFix}/calendar`, requireAuth, CalendarRouter);

// exercise
// 레거시 호환 경로 (구 클라이언트 /exercise/chart 호출 유지)
app.use(`${preFix}/exercise/chart`, requireAuth, ExerciseRecordChartRouter);
app.use(`${preFix}/exercise/record/chart`, requireAuth, ExerciseRecordChartRouter);
app.use(`${preFix}/exercise/goal/chart`, requireAuth, ExerciseGoalChartRouter);
app.use(`${preFix}/exercise/goal`, requireAuth, ExerciseGoalRouter);
app.use(`${preFix}/exercise/record`, requireAuth, ExerciseRecordRouter);
app.use(`${preFix}/exercise/favorite`, requireAuth, ExerciseFavoriteRouter);

// food
// 레거시 호환 경로 (구 클라이언트 /food/chart 호출 유지)
app.use(`${preFix}/food/chart`, requireAuth, FoodRecordChartRouter);
app.use(`${preFix}/food/record/chart`, requireAuth, FoodRecordChartRouter);
app.use(`${preFix}/food/goal/chart`, requireAuth, FoodGoalChartRouter);
app.use(`${preFix}/food/goal`, requireAuth, FoodGoalRouter);
app.use(`${preFix}/food/record`, requireAuth, FoodRecordRouter);
app.use(`${preFix}/food/favorite`, requireAuth, FoodFavoriteRouter);
app.use(`${preFix}/food/find`, requireAuth, FoodFindRouter);

// money
// 레거시 호환 경로 (구 클라이언트 /money/chart 호출 유지)
app.use(`${preFix}/money/chart`, requireAuth, MoneyRecordChartRouter);
app.use(`${preFix}/money/record/chart`, requireAuth, MoneyRecordChartRouter);
app.use(`${preFix}/money/goal/chart`, requireAuth, MoneyGoalChartRouter);
app.use(`${preFix}/money/goal`, requireAuth, MoneyGoalRouter);
app.use(`${preFix}/money/record`, requireAuth, MoneyRecordRouter);
app.use(`${preFix}/money/favorite`, requireAuth, MoneyFavoriteRouter);

// sleep
// 레거시 호환 경로 (구 클라이언트 /sleep/chart 호출 유지)
app.use(`${preFix}/sleep/chart`, requireAuth, SleepRecordChartRouter);
app.use(`${preFix}/sleep/record/chart`, requireAuth, SleepRecordChartRouter);
app.use(`${preFix}/sleep/goal/chart`, requireAuth, SleepGoalChartRouter);
app.use(`${preFix}/sleep/goal`, requireAuth, SleepGoalRouter);
app.use(`${preFix}/sleep/record`, requireAuth, SleepRecordRouter);
app.use(`${preFix}/sleep/favorite`, requireAuth, SleepFavoriteRouter);

// 자객증명을 다루는 공개 경로는 UserRouter 마운트 전에 전용 리및트를 섞어 부루트포스를 제한함
app.use(`${preFix}/user/login`, authLimiter);
app.use(`${preFix}/user/resetPw`, authLimiter);
app.use(`${preFix}/user/email/send`, authLimiter);
app.use(`${preFix}/user/email/verify`, authLimiter);

// user (민감 엔드포인트 — rate-limit 적용, 공개·보호 혼재로 UserRouter 내부에서 직접 지정)
app.use(`${preFix}/user/sync`, sensitiveLimiter, requireAuth, UserSyncRouter);
app.use(`${preFix}/user`, sensitiveLimiter, UserRouter);

// admin
app.use(`${preFix}/admin`, requireAdmin, AdminRouter);
app.use(`${preFix}/auth/google`, sensitiveLimiter, GoogleRouter);

// 0. 에러처리 미들웨어 -----------------------------------------------------------------------
// - 내부 예외 본문은 로그로만 남기고 상세는 서버 밖으로 보내지 않음
// - 키 이름은 라우터 계약과 동일하게 msg 로 통일해 클라이언트 번역 경로에 맞춤
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: `error`,
    msg: `serverError`,
    result: null,
  });
});

// 1. graceful shutdown -----------------------------------------------------------------------
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

// 2. 전역 예외 핸들러 -----------------------------------------------------------------------
process.on(`unhandledRejection`, (reason: unknown) => {
  console.error(`unhandledRejection: ${reason}`);
});
process.on(`uncaughtException`, (error: Error) => {
  console.error(`uncaughtException: ${error.stack ?? error}`);
  void gracefulShutdown(`uncaughtException`);
});
