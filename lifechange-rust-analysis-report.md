# lifechange-rust 복제 분석 보고서

작성일: 2026-05-23
대상 프로젝트: C:/JUNGHO/9.Workspace/2.Project/2.Node/lifechange
목표: 기존 lifechange를 Rust 기반 lifechange-rust로 기능 동등 복제하기 위한 구조와 워크플로우 분석

## 결론

lifechange는 서버와 클라이언트가 같은 저장소에 공존하는 Bun/TypeScript 풀스택 앱이다. 서버는 Express,
Mongoose, MongoDB를 중심으로 동작하고, 클라이언트는 Vite, React, React Router, MUI, Zustand, Axios, Recharts를
사용한다. 핵심 업무 도메인은 달력, 운동, 음식, 금전, 수면, 사용자, 동기화이다.

Rust 복제는 단순 언어 치환보다 HTTP 계약, MongoDB 컬렉션/필드명, 날짜 범위 규칙, 세션/로컬 스토리지 구조,
차트 집계 응답 형태를 먼저 고정해야 한다. 현재 저장소에는 누락 import와 서비스/저장소 명명 불일치가 확인되므로,
lifechange-rust는 현재 코드 그대로의 빌드 가능성보다 확인된 런타임 계약과 데이터 모델을 기준으로 재구현해야 한다.

## 작업 범위

- 확인됨: 루트 서버 구조, 클라이언트 구조, 패키지 메타, 라우터, 서비스, 저장소, 스키마, 스토리지/동기화 흐름을 직접 읽었다.
- 확인됨: node_modules, build, dist, .git, 캐시, 출력물은 분석 기준에서 제외했다.
- 확인됨: 현재 Git 작업트리는 public/main 브랜치이며 기존 수정 파일이 많다. 본 보고서는 기존 변경을 수정하지 않고 새 파일만 추가한다.
- 미검증: 실제 서버 기동, MongoDB 연결, 브라우저 화면 실행, 외부 FatSecret/SMTP/Google 연동 호출은 실행하지 않았다.

## 프로젝트 구조

확인된 소스 기준 구조는 다음과 같다.

~~~text
lifechange/
├─ index.ts                         # Express 서버 엔트리
├─ package.json                     # 서버 패키지, Bun 기반 보조 스크립트
├─ tsconfig.json                    # 서버 TS alias, strict 옵션
├─ .server.swcrc                    # 서버 SWC 설정
├─ architecture.md                  # 기존 구조 요약 문서
├─ readme.md                        # 기존 개요 문서
├─ src/
│  ├─ assets/
│  │  ├─ arrays/                    # 기본 카테고리 배열
│  │  └─ scripts/                   # email, fetch polyfill, util
│  ├─ routers/                      # HTTP 엔드포인트
│  ├─ services/                     # 업무 흐름, 상태 판정, 집계 조립
│  ├─ repositories/                 # Mongoose 쿼리와 aggregate
│  ├─ middlewares/                  # 목록 응답 후처리
│  └─ schemas/                      # Mongoose 컬렉션 스키마
└─ client/
   ├─ index.tsx                     # React 앱 엔트리와 route table
   ├─ package.json                  # 클라이언트 패키지
   ├─ vite.config.ts                # Vite 설정, alias, 빌드 chunk
   ├─ .client.swcrc                 # 클라이언트 SWC 설정
   ├─ public/
   │  ├─ manifest.json              # PWA manifest
   │  └─ service-worker.js          # 이미지 캐시 서비스 워커
   └─ src/
      ├─ pages/                     # 도메인별 화면
      ├─ hooks/                     # 공통값, 날짜, 저장소, 검증 hook
      ├─ interfaces/                # UI component/layout/container
      ├─ schemas/                   # 클라이언트 DTO 기본값/타입
      ├─ stores/                    # Zustand 전역 UI 상태
      ├─ assets/                    # CSS, storage/sync/utils, 타입
      └─ exports/                   # alias re-export 게이트
~~~

소스 규모는 출력물 제외 기준 약 333개 항목, 241개 파일이다. .ts 87개, .tsx 123개, CSS 5개,
JSON 7개가 확인됐다.

## 런타임과 빌드 워크플로우

### 서버

- 확인됨: package.json 이름은 lifechange-server, 진입점은 index.ts, type은 module이다.
- 확인됨: 런타임 의존성은 express, mongoose, mongodb, dotenv, cors, qs, bcryptjs, nodemailer,
  jsonwebtoken, passport, google-auth-library, axios, node-fetch 등이다.
- 확인됨: scripts는 git, swc, sync, tools만 있고 모두 bun run ~/.bootstrap/bootstrap-sync.ts 계열이다.
  저장소 내부에 일반 dev, build, test 스크립트는 없다.
- 확인됨: 서버는 HTTP_PORT로 listen하고 EADDRINUSE면 포트를 1씩 증가시켜 재시도한다.
- 확인됨: MongoDB 연결 문자열은 DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_AUTH_SOURCE, ENV_MODE,
  DB_NAME, DB_TEST로 구성된다.
- 확인됨: ENV_MODE가 DEVELOPMENT이면 Mongoose debug 로그를 컬렉션/메서드/쿼리 형태로 출력한다.
- 확인됨: qs.parse를 Express query parser로 설정해서 중첩 query 객체를 받는다.
- 확인됨: express.json, express.urlencoded, CORS 전체 허용 뒤 라우터를 mount한다.

### 클라이언트

- 확인됨: client/package.json 이름은 lifechange-client, homepage는 /lifechange이다.
- 확인됨: 핵심 의존성은 react, react-dom, react-router, @mui 계열, zustand, axios, recharts,
  react-calendar, moment-timezone이다.
- 확인됨: Vite base는 VITE_APP_PUBLIC_URL 또는 /lifechange이고 dev server/preview port는 3000이다.
- 확인됨: production build는 build 폴더로 출력하고, React/MUI/vendor manual chunk를 나눈다.
- 확인됨: production build에서 vite-plugin-compression이 Brotli .br 파일을 만든다.
- 확인됨: 서비스 워커는 Google Cloud Storage의 lifechange/image/main/*.webp 이미지를 캐시한다.

## 서버 프로세스

서버 요청 처리 흐름은 다음 순서다.

~~~text
HTTP request
-> Express query/body/CORS middleware
-> mounted router
-> service function
-> optional middleware list formatter
-> repository function
-> Mongoose schema/model
-> MongoDB collection or external HTTP source
-> JSON response { msg, status, result, totalCnt?, sectionCnt? }
~~~

HTTP_PREFIX가 있으면 모든 API 앞에 붙는다.

| Mount | Router | 역할 |
| --- | --- | --- |
| /calendar | CalendarRouter | 날짜 단위 통합 운동/음식/금전/수면 조회와 쓰기 위임 |
| /exercise/chart | ExerciseChartRouter | 운동 차트 집계 |
| /exercise/goal | ExerciseGoalRouter | 운동 목표 CRUD |
| /exercise/record | ExerciseRecordRouter | 운동 기록 CRUD |
| /food/chart | FoodChartRouter | 음식 차트 집계 |
| /food/goal | FoodGoalRouter | 음식 목표 CRUD |
| /food/record | FoodRecordRouter | 음식 기록 CRUD |
| /food/favorite | FoodFavoriteRouter | 사용자 즐겨찾기 음식 |
| /food/find | FoodFindRouter | FatSecret HTML 검색/파싱 |
| /money/chart | MoneyChartRouter | 금전 차트 집계 |
| /money/goal | MoneyGoalRouter | 금전 목표 CRUD |
| /money/record | MoneyRecordRouter | 금전 기록 CRUD |
| /sleep/chart | SleepChartRouter | 수면 차트 집계 |
| /sleep/goal | SleepGoalRouter | 수면 목표 CRUD |
| /sleep/record | SleepRecordRouter | 수면 기록 CRUD |
| /user | UserRouter | 이메일 인증, 가입, 로그인, 설정, 삭제 |
| /user/sync | UserSyncRouter | 클라이언트 세션 동기화 데이터 |
| /admin | AdminRouter | import 확인, 실제 파일 누락 |
| /auth/google | GoogleRouter | import 확인, 실제 파일 누락 |

## API 표면

| Domain | Endpoints |
| --- | --- |
| Calendar | GET /calendar/exist, GET /calendar/list, GET /calendar/detail, POST /calendar/create, PUT /calendar/update, DELETE /calendar/delete |
| Exercise chart | GET /exercise/chart/bar, /bar/week, /bar/month, /pie/week, /pie/month, /pie/year, /line/week, /line/month, /avg/week, /avg/month |
| Exercise goal | GET /exercise/goal/exist, /list, /detail, POST /create, PUT /update, DELETE /delete |
| Exercise record | GET /exercise/record/exist, /list, /detail, POST /create, PUT /update, DELETE /delete |
| Food chart | GET /food/chart/bar, /pie/week, /pie/month, /pie/year, /line/week, /line/month, /avg/week, /avg/month |
| Food goal | GET /food/goal/exist, /list, /detail, POST /create, PUT /update, DELETE /delete |
| Food record | GET /food/record/exist, /list, /detail, POST /create, PUT /update, DELETE /delete |
| Food find/favorite | GET /food/find/list, GET /food/favorite/list, PUT /food/favorite/update |
| Money chart | GET /money/chart/bar, /pie/week, /pie/month, /pie/year, /line/week, /line/month, /avg/week, /avg/month |
| Money goal | GET /money/goal/exist, /list, /detail, POST /create, PUT /update, DELETE /delete |
| Money record | GET /money/record/exist, /list, /detail, POST /create, PUT /update, DELETE /delete |
| Sleep chart | GET /sleep/chart/bar, /pie/week, /pie/month, /pie/year, /line/week, /line/month, /avg/week, /avg/month |
| Sleep goal | GET /sleep/goal/exist, /list, /detail, POST /create, PUT /update, DELETE /delete |
| Sleep record | GET /sleep/record/exist, /list, /detail, POST /create, PUT /update, DELETE /delete |
| User | POST /user/email/send, POST /user/email/verify, POST /user/signup, POST /user/resetPw, POST /user/login, GET /user/detail, PUT /user/update, DELETE /user/delete, GET /user/category/detail, POST /user/category/update |
| User sync | GET /user/sync/category, /percent, /scale, /nutrition, /favorite, /property |

## 도메인별 서버 워크플로우

### Goal/Record 공통

운동, 음식, 금전, 수면의 목표/기록 도메인은 같은 패턴을 반복한다.

~~~text
exist  -> 날짜 범위 중복/존재 확인
list   -> user_id + DATE + PAGING 기준 목록 조회
detail -> user_id + DATE 기준 상세 조회
create -> body.user_id + body.OBJECT + body.DATE 저장
update -> body.user_id + body.OBJECT + body.DATE + body.type 수정
delete -> body.user_id + body.DATE 삭제
~~~

응답은 대부분 status: success|fail|error, msg, result를 가진다. 목록 응답은 totalCnt, 상세 응답은
sectionCnt를 추가할 수 있다.

### Chart 공통

- 운동: volume, cardio, scale 중심.
- 음식: kcal, carb, protein, fat 중심.
- 금전: income, expense, property 중심.
- 수면: bedTime, wakeTime, sleepTime 중심.
- 기간: today/bar, week, month, year 조합.

Rust 복제 시 차트 API는 화면 컴포넌트보다 응답 shape을 먼저 고정해야 한다. 클라이언트 Recharts 의존은
Rust/WASM 차트 컴포넌트로 교체 가능하지만, API 필드명은 그대로 유지해야 한다.

### Calendar

CalendarRepository는 별도 Calendar 컬렉션만 읽는 구조가 아니다. 운동/음식/금전/수면 Record 컬렉션을 각각
aggregate한 뒤, 날짜별 통합 객체를 조립한다.

~~~text
Calendar list/detail
-> ExerciseRecord aggregate
-> FoodRecord aggregate
-> MoneyRecord aggregate
-> SleepRecord aggregate
-> dateStart..dateEnd 일자 루프
-> calendar_* 섹션 통합 응답 생성
~~~

CalendarService.update는 calendar 화면의 통합 입력을 도메인별 record create/update/delete로 분해한다.
섹션이 비어 있으면 기존 데이터 삭제도 수행한다.

### User/Auth

사용자 흐름은 다음 순서다.

~~~text
email/send
-> 중복/존재/google 사용자 여부 검사
-> 인증 코드 생성
-> nodemailer 발송
-> Verify 컬렉션 upsert

email/verify
-> Verify 조회
-> 코드 비교

signup/resetPw/login/delete
-> User 조회
-> bcrypt hash 또는 compare
-> token salt 조합
-> User 및 관련 도메인 컬렉션 변경
~~~

로그인은 user_pw + user_token 조합을 bcrypt로 비교한다. Google 사용자는 user_id + user_token 조합을
비밀번호 비교 입력으로 사용한다. 관리자 판정은 ADMIN_ID와 user_id 비교다.

### Food Find

FoodFindService는 FatSecret 페이지를 HTTP로 가져와 JSDOM으로 HTML을 파싱한다. 국가 ISO 코드에 따라
fatsecret.com, fatsecret.co.*, fatsecret.com.*, fatsecret.* URL 규칙을 다르게 만든다. 한국어, 스페인어,
영어권 영양 문자열 정규식이 직접 구현돼 있다.

Rust 복제 시 이 부분은 reqwest + scraper 또는 tl 계열 HTML parser로 재작성한다. 정규식은 locale별 테스트
fixture를 먼저 고정해야 한다.

## 클라이언트 워크플로우

### 라우팅

client/index.tsx는 BrowserRouter basename="/lifechange"로 앱을 시작한다. 주요 route는 다음과 같다.

- /
- /calendar/list, /calendar/detail
- /exercise/chart/list, /exercise/goal/list, /exercise/goal/detail, /exercise/record/list, /exercise/record/detail
- /food/chart/list, /food/goal/list, /food/goal/detail, /food/record/list, /food/record/detail, /food/favorite/list, /food/find/list
- /money/chart/list, /money/goal/list, /money/goal/detail, /money/record/list, /money/record/detail
- /sleep/chart/list, /sleep/goal/list, /sleep/goal/detail, /sleep/record/list, /sleep/record/detail
- /user/appInfo, /user/appSetting, /user/signup, /user/login, /user/resetPw, /user/detail, /user/delete, /user/category
- /admin/dashboard, /auth/error, /auth/google, /auth/privacy는 route에 있으나 관련 파일이 현재 누락됐다.

### 공통 hook과 URL 조립

useCommonValue가 현재 path를 분해해 isGoal, isRecord, isChart, isFood 같은 화면 플래그와 이동 경로를 만든다.
API URL은 다음 방식으로 조립한다.

~~~text
URL_OBJECT = VITE_APP_SERVER_URL + VITE_APP_ + FIRST_PATH_SEGMENT_UPPERCASE
URL_CALENDAR = VITE_APP_SERVER_URL + VITE_APP_CALENDAR
URL_EXERCISE = VITE_APP_SERVER_URL + VITE_APP_EXERCISE
URL_FOOD = VITE_APP_SERVER_URL + VITE_APP_FOOD
URL_MONEY = VITE_APP_SERVER_URL + VITE_APP_MONEY
URL_SLEEP = VITE_APP_SERVER_URL + VITE_APP_SLEEP
~~~

### 저장소

storage.ts는 VITE_APP_TITLE을 localStorage/sessionStorage 최상위 key로 사용한다. getLocal, setLocal,
getSession, setSession은 최대 3단계 key를 병합 저장한다. useStorageLocal과 useStorageSession은 React state를
스토리지와 동기화하고, key 변경 시 이전 state가 새 key를 덮어쓰지 않게 한 번 쓰기를 건너뛴다.

~~~text
localStorage[VITE_APP_TITLE]
└─ setting.locale.{timeZone, zoneName, lang, isoCode, currency, unit}

sessionStorage[VITE_APP_TITLE]
├─ setting.id.{sessionId, admin}
├─ setting.sync.{category, percent, scale, nutrition, favorite, property}
├─ section.food[]
└─ paging[path]
~~~

### 동기화

sync.ts는 로그인/초기화 후 /user/sync/* API를 호출해 세션 저장소를 채운다.

~~~text
sync()
-> /sync/category
-> /sync/percent
-> /sync/scale
-> /sync/nutrition
-> /sync/favorite
-> /sync/property
-> sessionStorage.setting.sync 갱신

sync(extra)
-> /sync/{extra}
-> sessionStorage.setting.sync[extra] 갱신
~~~

## 데이터 모델

MongoDB 컬렉션과 주요 필드는 다음 기준으로 복제해야 한다.

| Collection | 주요 필드 |
| --- | --- |
| Counter | _id, seq. 새 문서 저장 전 도메인별 번호 증가 |
| User | user_id, user_number, user_google, user_token, user_pw, scale, nutrition, property, user_favorite, user_dataCategory |
| Verify | verify_id, verify_code, 등록/수정일 |
| ExerciseGoal | 날짜 범위, 목표 count/volume/cardio/scale |
| ExerciseRecord | 날짜 범위, total volume/cardio/scale, exercise_section[] |
| FoodGoal | 날짜 범위, 목표 kcal/carb/protein/fat |
| FoodRecord | 날짜 범위, total kcal/carb/protein/fat, food_section[] |
| MoneyGoal | 날짜 범위, income/expense |
| MoneyRecord | 날짜 범위, total income/expense, money_section[] |
| SleepGoal | 날짜 범위, bedTime/wakeTime/sleepTime |
| SleepRecord | 날짜 범위, sleep_section[] |
| Calendar | 통합 calendar 섹션 스키마가 있으나 조회는 주로 Record 컬렉션 aggregate 기반 |

모든 주요 도메인 컬렉션은 user_id, 도메인별 *_number, *_dateType, *_dateStart, *_dateEnd, 등록/수정일 필드를
공유한다. 값 대부분은 숫자 타입이 아니라 문자열로 저장된다. Rust 복제 시 DB 호환성을 우선하면 숫자로 정규화하지
말고 문자열 필드명을 유지해야 한다.

## 환경 변수 표면

값은 읽지 않았고 코드에서 참조된 key만 정리했다.

### 서버

HTTP_PREFIX, HTTP_PORT, HTTPS_PORT, ENV_MODE, DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_AUTH_SOURCE,
DB_NAME, DB_TEST, ADMIN_ID, EMAIL_SERVICE, EMAIL_HOST, EMAIL_PORT, EMAIL_ID, EMAIL_PW, GCLOUD_BUCKET_PATH,
NODE_ENV, PUBLIC_URL

### 클라이언트

VITE_APP_TITLE, VITE_APP_PUBLIC_URL, VITE_APP_SERVER_URL, VITE_APP_CALENDAR, VITE_APP_GOOGLE,
VITE_APP_ADMOB, VITE_APP_ADMIN, VITE_APP_EXERCISE, VITE_APP_FOOD, VITE_APP_MONEY, VITE_APP_SLEEP,
VITE_APP_GCLOUD_URL, VITE_APP_ADMIN_ID, VITE_APP_ADMIN_PW

## Rust 복제 설계 기준

### 순수 Rust 해석

브라우저 앱까지 포함해 "소스 코드 100% Rust"를 목표로 하면 클라이언트는 React가 아니라 WASM 기반 Rust UI로
갈아타야 한다. 다만 브라우저 배포물에는 wasm-bindgen류가 생성하는 JavaScript glue가 생길 수 있다. 생성물까지
0% JavaScript를 요구하면 웹 앱이 아니라 native desktop/mobile 쪽으로 범위를 재정의해야 한다.

### 권장 구조

~~~text
lifechange-rust/
├─ Cargo.toml
├─ crates/
│  ├─ domain/                       # DTO, enum, date range, storage contract
│  ├─ server/                       # Axum/Actix HTTP API
│  ├─ db/                           # MongoDB repository
│  ├─ auth/                         # bcrypt, token, email verify, google oauth
│  ├─ food_find/                    # FatSecret scraper/parser
│  └─ web/                          # Leptos/Yew/Dioxus WASM client
├─ migrations-or-indexes/           # MongoDB index 정의 문서 또는 스크립트
├─ fixtures/                        # API/HTML/parser 회귀 fixture
└─ docs/
   └─ api-contract.md
~~~

### 서버 crate 매핑

| TypeScript | Rust 후보 |
| --- | --- |
| Express Router | axum::Router 또는 actix-web scope |
| Service | 도메인 service module, async function |
| Repository | mongodb crate collection wrapper |
| Mongoose Schema | serde Serialize/Deserialize struct + BSON mapping |
| Counter.pre(save) | repository create 전 find_one_and_update($inc) |
| bcryptjs | bcrypt crate |
| nodemailer | lettre crate |
| axios/node-fetch | reqwest crate |
| JSDOM | scraper, tl, html5ever 계열 |
| qs.parse | Axum query extractor + nested query deserializer 직접 구현 |

### 클라이언트 crate 매핑

| TypeScript/React | Rust 후보 |
| --- | --- |
| React Router | Leptos router, Yew router, Dioxus router |
| Zustand | signal/store resource 또는 전역 context |
| localStorage/sessionStorage | web-sys Storage wrapper |
| Axios | gloo-net 또는 reqwasm |
| MUI | Rust component + CSS design system 직접 구현 |
| Recharts | SVG/canvas chart component 직접 구현 또는 Rust chart crate WASM 적용 |
| service-worker.js | 순수 Rust 조건이면 직접 대체 어려움. 생성 JS 허용 여부 결정 필요 |

## Rust 복제 우선순위

1. API 계약 고정: 모든 endpoint, method, query/body, response shape을 fixture로 만든다.
2. MongoDB 모델 고정: 컬렉션명, 필드명, 문자열 숫자 정책, counter 정책을 그대로 문서화한다.
3. 서버부터 Rust로 복제: Axum + MongoDB + serde + bcrypt + lettre 기반으로 기존 API 호환 서버를 만든다.
4. API 회귀 테스트 작성: 기존 TS 서버와 Rust 서버에 같은 fixture를 보내 응답 shape을 비교한다.
5. 클라이언트 상태 저장소 복제: VITE_APP_TITLE 기반 local/session 구조를 Rust WASM에서 재현한다.
6. 화면 복제: route table, layout 노출 조건, list/detail/chart/find 흐름 순으로 구현한다.
7. 외부 연동 복제: SMTP, FatSecret parser, Google OAuth/admin/auth는 누락 파일 복구 후 계약을 확정한다.
8. 서비스 워커 정책 결정: 100% Rust 원칙과 PWA 캐시 요구사항 중 우선순위를 정한다.

## 확인된 문제와 복제 주의점

- 확인됨: index.ts는 @assets/scripts/env를 import하지만 src/assets/scripts/env.ts가 현재 없다.
- 확인됨: index.ts는 @routers/admin/AdminRouter, @routers/auth/GoogleRouter를 import하지만 해당 경로가 현재 없다.
- 확인됨: client/index.tsx와 ExportPages.tsx는 admin/auth page를 import하지만 client/src/pages/admin,
  client/src/pages/auth가 현재 없다.
- 확인됨: ExportSchemas.tsx는 @schemas/admin/Admin을 export하지만 client/src/schemas/admin이 현재 없다.
- 확인됨: architecture.md, readme.md는 ecosystem.config.cjs를 언급하지만 루트에 해당 파일이 현재 없다.
- 확인됨: UserService.ts는 repository.emailSendEmail, repository.emailVerifyEmail을 호출하지만
  UserRepository.ts는 emlSndEml, emlVrfyEml을 export한다.
- 확인됨: CalendarRouter POST /create는 dedicated create가 아니라 service.update(..., type)를 호출한다.
  의도된 통합 upsert인지, 명명 오류인지 Rust 복제 전 결정해야 한다.
- 확인됨: CalendarService의 food 생성 객체는 food_record_total_calorie를 쓰지만 FoodRecord 스키마는
  food_record_total_kcal을 사용한다.
- 확인됨: CalendarService의 sleep 생성 객체는 sleep_record_total_time, sleep_record_total_scale을 만들지만
  SleepRecord 스키마에는 해당 total 필드가 없다.
- 추론: 현재 상태 그대로 타입체크나 기동을 수행하면 누락 import와 명명 불일치로 실패할 가능성이 높다.
- 미검증: 위 문제들이 작업트리의 임시 수정 때문인지, 생성/비공개 파일이 별도로 주입되는 배포 구조 때문인지는 확인하지 않았다.

## 검증

- 확인됨: ~/.codex/FS.md를 먼저 읽고 파일 접근 정책을 적용했다.
- 확인됨: git_status로 현재 브랜치와 dirty worktree를 확인했다.
- 확인됨: dir_list로 루트, src, client/src 구조를 확인했다.
- 확인됨: file_read와 file_lines로 package, tsconfig, Vite, entry, router, service, repository, schema,
  storage/sync 파일을 확인했다.
- 확인됨: search_regex로 endpoint, env key, missing import 후보를 확인했다.
- 미검증: bun, tsc, Vite build, 서버 run, 브라우저 run은 실행하지 않았다. 목적이 보고서 생성이고 현재 저장소에
  누락 import가 직접 확인됐기 때문이다.

## 후속 작업

1. 누락 파일이 의도된 비공개/생성 파일인지 확인하고, Rust 복제 범위에 admin/auth/google/env를 포함할지 결정한다.
2. 현재 TS 프로젝트에서 타입체크 가능한 기준 커밋 또는 복구 브랜치를 확보한다.
3. API fixture를 먼저 만든다. 최소 단위는 user login, sync, 각 도메인 goal/record CRUD, chart, calendar, food find다.
4. MongoDB 샘플 데이터 또는 anonymized dump를 확보한다.
5. Rust 서버를 먼저 구현하고 기존 클라이언트로 붙여 API 호환성을 검증한다.
6. 순수 Rust 클라이언트 전략을 결정한다. 웹 유지 시 Leptos/Yew/Dioxus 중 하나를 선택하고 JS glue 허용 범위를 문서화한다.

## 근거

- 확인됨: package.json, client/package.json
- 확인됨: index.ts, client/index.tsx
- 확인됨: src/routers/**/*Router.ts
- 확인됨: src/services/**/*Service.ts
- 확인됨: src/repositories/**/*Repository.ts
- 확인됨: src/schemas/**/*.ts
- 확인됨: client/src/hooks/common/useCommonValue.tsx
- 확인됨: client/src/assets/scripts/storage.ts, client/src/assets/scripts/sync.ts
- 확인됨: client/vite.config.ts, tsconfig.json, client/tsconfig.json
- 확인됨: client/public/manifest.json, client/public/service-worker.js

## 변경 파일

- lifechange-rust-analysis-report.md: Rust 복제용 구조, 워크플로우, API, 데이터 모델, 위험 목록 보고서 신규 생성
