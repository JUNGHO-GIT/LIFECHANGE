# lifechange 클라이언트 종합 분석 보고서

* 작성일: 2026-07-03
* 분석 범위: `client/` (React 19 + Vite 8 + MUI + Zustand + recharts SPA)
* 분석 방법: 4축(성능/병목, 도메인 로직, UI/UX·디자인, 인프라·오류) 병렬 정밀 코드 판독.
  서버측 집계(`src/repositories/money`)와 교차 검증. 빌드 산출물 실측은 미수행(번들 수치는 추정 표기).
* 기준선: `tsc --noEmit` 통과(오류 0).

---

## 요약

| 축 | high | mid | low |
|---|---|---|---|
| 보안/인증 | 3 | 4 | 0 |
| 도메인 로직 | 1 | 3 | 6 |
| 성능/병목 | 5 | 8 | 2 |
| UI/UX/접근성 | 4 | 9 | 3 |

최우선 5건: money 합계 include 플래그 누락(서버 불일치), 로그인 실패 분기의 세션 설정,
라우트 가드 무력화, user 페이지 5곳 wrapper key 리마운트(입력 포커스 소실), 평문 비밀번호 localStorage 저장.

---

## 1. 보안/인증 (infra)

### high

1. 자동로그인 비밀번호 평문 저장 — `pages/user/UserLogin.tsx:113`, `pages/auth/AuthGoogle.tsx:34`.
   `autoLoginPw`에 평문 pw를 localStorage에 기록. XSS·공용 PC에서 자격증명 유출.
   서버 발급 refresh 토큰(httpOnly 쿠키) 전환 필요. **[구조 변경 — 서버 작업 동반, 권고로 유지]**
2. 로그인 실패 분기에서 세션 설정 — `UserLogin.tsx:164-176`. `isGoogleUser`(로그인 거절) 분기에서
   `setSession(... sessionId ...)` 수행 → 미인증 상태로 보호 화면 진입·sync 동작. **[수정 대상 F1]**
3. 토큰 기반 인증 부재 — `assets/scripts/interceptor.ts:23-47`, `sync.ts:48-51`. 요청 인증이 `params.user_id`뿐,
   인터셉터에 토큰 첨부·401 처리 없음. 타 user_id 접근 가능 구조(서버측 검증 미확인, 추정). **[권고]**

### mid

1. 자동로그인 자격증명 wipe 경합 + stale pw 저장 — `UserLogin.tsx:84-140`. 쓰기 effect가 마운트 초기값으로
   선실행, deps 누락으로 체크 후 수정한 pw가 stale 저장. 저장 시점을 로그인 성공 콜백으로 이동 권고.
2. 중복 제출 가드 부재 — `UserLogin.tsx:143-207`, `UserDelete.tsx:164-207`. `flowSave`가 axios 체인 미대기,
   버튼 disabled 없음.
3. 401/419 만료 공통 처리 부재 + `networkError` 번역 키 미등록 — `interceptor.ts`.
   raw 문자열 "networkError" 그대로 노출. **[번역 키 등록은 수정 대상 F15]**
4. OAuth 콜백 실패 처리 — `pages/auth/AuthGoogle.tsx:56-64`. Error 객체를 translate에 전달,
   실패 시 빈 화면 방치(navigate 없음). **[수정 대상 F16]**

---

## 2. 도메인 로직 (logic/domain)

### high

1. money 합계 include 플래그 누락 — `pages/money/record/MoneyRecordDetail.tsx:206-224`.
   클라이언트 총액 reduce가 `money_record_include === 'Y'` 조건 없이 전액 합산.
   서버 `src/repositories/money/MoneyRecordRepository.ts:122-135`는 include='Y'만 합산
   → 상세/저장 직후 총액과 목록·차트 총액 불일치. **[수정 대상 F3]**

### mid

1. sleep 섹션 정렬이 NaN 비교자 — `pages/sleep/record/SleepRecordDetail.tsx:183-185`. 존재하지 않는
   `sleep_record_part`로 정렬(무동작, 복붙 흔적). **[수정 대상 F5]**
2. 금액 0 검증 불일치 — `hooks/validate/useValidateMoney.tsx:126`은 `'0'` 통과,
   `useValidateCalendar.tsx`는 에러. 진입 경로별 규칙 상이. **[수정 대상 F4]**
3. food 개수 스케일링 결함 — `pages/food/record/FoodRecordDetail.tsx:700-711`. `Number(x) ?? 1`은 죽은 코드
   (NaN은 null 아님), 개수 0 경유 시 재계산 붕괴, toFixed 반올림 누적, 상한 클램프 우회. **[수정 대상 F6]**

### low

1. food 두 번째 정렬 NaN 비교자 — `FoodRecordDetail.tsx:223` (무동작, 무해).
2. sleep goal sleepTime `'00:00'` 검증 불일치 — `useValidateSleep.tsx`.
3. 수면 시간 계산이 브라우저 로컬 TZ 사용 — `hooks/util/useTime.tsx` (DST 경계 1시간 오차 가능, 추정).
4. 사장 코드 — `assets/scripts/utils.ts:12,23,31,43`. 특히 `calcDate`는 `useTime`과 규칙 상이해 재사용 시 혼선 위험.
5. 로드 직후 서버 total을 클라이언트 재계산으로 덮어씀 — `FoodRecordDetail.tsx:261-267`,
   `MoneyRecordDetail.tsx:229-233` (money는 high #1과 결합 시 가시적 불일치).
6. 합계 파서의 k/m 접미사 오해석 여지 — `pages/money/record/MoneyRecordList.tsx:169-186`.

---

## 3. 성능/병목 (perf)

### high

1. Icons 렌더마다 전체 아이콘 맵 생성 — `interfaces/components/Icons.tsx:28-49`. 렌더 1회당 `new URL()` 19개
   + 약 40개 JSX 생성 후 1개만 사용. 리스트 N행이면 N×40 낭비. **[수정 대상 F7]**
2. moment-timezone 전체 tz DB 번들 포함 — `exports/ExportLibs.tsx:12`.
   10-year-range 빌드 교체로 수백 KB 절감 추정. **[수정 대상 F10]**
3. storage 훅 마운트 시 무조건 루트 전체 직렬화 쓰기 — `hooks/storage/useStorageLocal.tsx:51`,
   `useStorageSession.tsx:51`. 내비게이션마다 다수 반복. 마운트 1회차 no-op 가드 권고.
4. useCommonValue 폴백 리터럴 신규 identity — `hooks/common/useCommonValue.tsx:100,167`. `?? {}`/`?? []`가
   재구축마다 새 참조 → 하위 useEffect/useMemo 연쇄 무효화. **[수정 대상 F8]**
5. 차트 진입 시 7건+ 동시 선행 fetch + 공유 LOADING 레이스 — `pages/money/chart/MoneyChartPie.tsx:74-146` 등.
   먼저 끝난 자식의 finally가 로딩 해제. 표시 섹션만 지연 fetch 또는 카운팅 로딩 권고.

### mid

1. `vite.config.ts:142` `target: es2015` — React 19/MUI에 하향 변환 강제. `es2020` 상향. **[수정 대상 F9]**
2. `vite.config.ts:155` manualChunks `node_modules/react` 오매치 — react-calendar까지 초기 청크 편입,
   `date-fns` 항목은 죽은 설정(클라이언트 미의존). **[수정 대상 F9]**
3. 리스트 8곳 서버 데이터 행 `key={i}` — `MoneyRecordList.tsx:409` 외 7곳. sort/페이지 변경 시 DOM
   오재사용. `key={item._id}`로 교체. **[수정 대상 F13]**
4. 아코디언 토글 stale 참조 + 클릭 경로 전체 직렬화 — `MoneyRecordList.tsx:422`. 함수형 업데이트 권고.
5. TopNav 매 전환 setSelectedTab → localStorage 쓰기 — `interfaces/layouts/TopNav.tsx:195`.
   동일 값 가드 추가. **[수정 대상 F12]**
6. 부모-자식 TYPE 이중 소유 + JSON.stringify 양방향 동기화 — `MoneyChartPie.tsx:149-169` 등 차트 공통.
7. renderPie 매 렌더 신규 함수 + 애니메이션 재시작 — `MoneyChartPie.tsx:174,264-276`.
8. ExportHooks ↔ useCommonDate 순환 의존 — `hooks/common/useCommonDate.tsx:9`. 직접 경로 import로 교체.
   **[수정 대상 F11]**

### low

1. useCommonDate 마운트당 50여 클로저 + moment-tz 다중 생성.
2. sync.ts 현재 시각 moment 4회 중복 생성 — `assets/scripts/sync.ts:34-46`. **[수정 대상 F21]**

---

## 4. UI/UX/접근성 (ui/ux/design/a11y)

### high

1. wrapper key에 live 입력값 → 타이핑마다 리마운트·포커스 소실 — `UserLogin.tsx:247`, `UserSignup.tsx:263`,
   `UserResetPw.tsx:252`, `UserDetail.tsx:139`, `UserDelete.tsx:225`.
   `key={\`detail-${item._id || item.user_id}\`}`에서 `_id` 기본값이 빈 문자열이라 key=입력값.
   index 고정 key로 교체. **[수정 대상 F2]**
2. 자동로그인 평문 pw 저장 (보안 high #1과 동일).
3. Confirm 다이얼로그 clickaway 시 콜백 유실 — `interfaces/layouts/Confirm.tsx:30`. Snackbar 기반,
   바깥 터치로 닫히면 호출측 콜백 영구 방치. **[수정 대상 F14]**
4. 상호배타 선택을 Checkbox 2개로 구현 + label 미연결 — `TopNav.tsx:531,541`, UserLogin checkSection 동일.

### mid

1. 로그인 폼 `form` 부재(Enter 제출 불가) + 제출 중 disabled 없음 — `UserLogin.tsx:339`.
2. 프라이머리 블루 2종 분열 — `Calendar.css`(#006ab3) vs `Mui.css`/`PickerDay.tsx`(#0876b9).
   토큰 단일화. **[수정 대상 F20]**
3. 다크모드 전면 부재 — `Core.css`, `prefers-color-scheme` 0건, PWA theme-color 고정.
4. IconButton `component="div"` — 네이티브 button 시맨틱 상실 — `Icons.tsx:597`, `Dialog.tsx`.
5. PickerDay 체브론 음수 마진 → 터치 타깃 겹침 — `PickerDay.tsx:551` 외 4곳.
6. 체중 입력 단위가 `cm` — `UserSignup.tsx:404`. `localUnit`(kg)으로 교체. **[수정 대상 F19]**
7. `!important` 약 60건 + z-index 인플레이션(1,000,000 등) — `Mui.css`, `Components.css`.
8. Toolbar 8vh/BottomNav 14vw 뷰포트 고정 — 가로모드·키보드 시 왜곡.
9. manifest `theme_color #0876b9` vs index.html `#ffffff` 불일치, service worker 미등록(오프라인 무동작).

### low

1. Alert 무의미 재설정 effect — `interfaces/layouts/Alert.tsx:21`. 삭제. **[수정 대상 F18]**
2. AuthError stale 타이머(clearTimeout 부재) — `pages/auth/AuthError.tsx:23-28`. **[수정 대상 F17]**
3. i18n 누락: placeholder `abcd@naver.com` 고정, `aria-label` 영어 전용, `Loader.tsx:47`.

---

## 5. 이번 수정 범위 (실행 계획)

안전하고 즉시 검증 가능한 항목만 수정한다. 구조 변경(토큰 인증, refresh 토큰, PWA SW, 다크모드,
Dialog 전환, 차트 fetch 구조)은 6장 권고로 남긴다.

| # | 항목 | 파일 |
|---|---|---|
| F1 | 로그인 실패 분기 세션 설정 제거 | `UserLogin.tsx` |
| F2 | user 페이지 5곳 wrapper key → index 고정 | `UserLogin/Signup/ResetPw/Detail/Delete.tsx` |
| F3 | money 합계 include 조건 추가 | `MoneyRecordDetail.tsx` |
| F4 | 금액 0 검증 통일 | `useValidateMoney.tsx` |
| F5 | sleep NaN 정렬 제거 | `SleepRecordDetail.tsx` |
| F6 | food 스케일링 가드 교정 | `FoodRecordDetail.tsx` |
| F7 | Icons 정적 자원 모듈 스코프화 | `Icons.tsx` |
| F8 | useCommonValue 폴백 상수화 | `useCommonValue.tsx` |
| F9 | vite target es2020 + manualChunks 경계 매칭 + date-fns 제거 | `vite.config.ts` |
| F10 | moment-timezone 10-year-range 빌드 교체 | `ExportLibs.tsx` |
| F11 | ExportHooks 순환 의존 제거 | `useCommonDate.tsx` |
| F12 | TopNav 동일 값 setState 가드 | `TopNav.tsx` |
| F13 | 리스트 8곳 `key={i}` → `key={item._id}` | record/goal/find 리스트 |
| F14 | Confirm clickaway 콜백 보전 | `Confirm.tsx` |
| F15 | `networkError` 번역 키 등록 | `useStoreLanguage.tsx` |
| F16 | AuthGoogle 실패 시 로그인 이동 + 메시지 교정 | `AuthGoogle.tsx` |
| F17 | AuthError clearTimeout | `AuthError.tsx` |
| F18 | Alert 무의미 effect 삭제 | `Alert.tsx` |
| F19 | 체중 단위 cm → localUnit | `UserSignup.tsx` |
| F20 | Calendar.css 색상 #006ab3 → #0876b9 통일 | `Calendar.css` |
| F21 | sync.ts moment 1회 생성 재사용 | `sync.ts` |

---

## 6. 구조 개선 권고 (이번 범위 외)

1. 자동로그인: 평문 pw 저장 폐기 → 서버 refresh 토큰(httpOnly 쿠키).
2. API 인증: user_id 파라미터 신뢰 구조 폐기 → JWT/세션 + 인터셉터 401 공통 처리.
3. 라우트 가드: 화이트리스트 기반 미인증 리다이렉트(`useRoot.tsx:19-31` 현재 `PATH === '/'`만 동작)
   — 서버 인증 도입과 함께 설계.
4. PWA: service worker 도입(vite-plugin-pwa) 또는 manifest-only 명시, theme_color 통일.
5. 차트: 표시 섹션 지연 fetch + 카운팅 로딩 스토어, TYPE 부모 단일 소유.
6. 디자인 토큰: CSS 변수 기반 색상/z-index 스케일, `!important` 제거(MUI theme override 이관).
7. moment → dayjs 전환 검토(번들 추가 절감).

---

## 7. 디자인 개선 적용 (2차 — frontends-redesign-skill 감사 기반)

redesign 스킬 감사 항목과 4장 UI/UX 발견을 교차해 기능 무손상 범위로 적용한 디자인 수정 세트.

| # | 항목 | 내용 |
|---|---|---|
| D1 | 색상 토큰화 | `Core.css`에 `:root` 변수(`--color-primary/secondary/error/bg/border`) 정의, Mui/Components/Calendar/Core 하드코딩 색상 var() 치환. `Components.css` 테이블 헤더 `#006ab3` 잔존 교정 |
| D2 | z-index 스케일 | `--z-content 100 / --z-layout 500 / --z-loader 9000 / --z-splash 9100 / --z-popover 9200 / --z-alert 9300`. 1,000,000·9999·9998 임의값 전부 스케일로 치환(상대 순서 보존) |
| D3 | 그림자 틴트 | `.shadow-1` 순수 검정 → 블루그레이(`--shadow-tint: 21,53,75`) 틴트 |
| D4 | Toolbar 치수 | `8vh` 뷰포트 의존 → `56px` 고정(가로모드 찌그러짐 해소) |
| D5 | BottomNav | `14vw` → `min 56px / max 168px`, `safe-area-inset-bottom` 패딩 추가(노치 단말) |
| D6 | 스플래시 dvh | `100vh`/`80vh` → `dvh` 보강(iOS 뷰포트 점프 방지, vh 폴백 유지) |
| D7 | theme-color 통일 | `index.html` `#ffffff` → `#0876b9`(manifest·스플래시와 일치) |
| D8 | placeholder 중립화 | `abcd@naver.com` → `email@example.com` (UserLogin/UserSignup) |
| D9 | 체크박스 접근성 | UserLogin 자동로그인/아이디저장, TopNav avg/total에 aria-label + 텍스트 클릭 토글 |
| D10 | 터치 타깃 | PickerDay 체브론 음수 마진 제거(인접 타깃 겹침 해소) |
| 부수 | Alert/Confirm | 인라인 `zIndex: 1_000_000` → `.snackbar-top` 클래스(`--z-alert`) 이관 |
| E1 | color-scheme | `:root { color-scheme: light }` — 안드로이드 강제 다크 모드 색 왜곡 방지 |
| E2 | 숫자 타이포 | `body { font-variant-numeric: tabular-nums }` — 금액/통계 자릿수 정렬 |
| E3 | ::selection | 브랜드 틴트(rgba primary .18) 선택 영역 |
| E4 | 프레스 피드백 | `.MuiButtonBase-root:active` scale(0.97) + 모션 감소 가드(아코디언 제외) |
| E5 | BottomNav 전환 | 선택 scale 1.2에 0.2s 트랜지션(급격 점프 제거) |
| E6 | smooth scroll | `html { scroll-behavior: smooth }` + 모션 감소 시 auto |
| E7 | 포커스 링 | 버튼 전역 `:focus-visible` 브랜드 링 — CDN Reset이 outline을 제거해 `!important` 필요함을 실측 확인, Extra.css 아코디언 링도 동일 보강 |

미적용(권고 유지): 다크모드 전면 도입, `!important` 전면 제거(MUI theme override 이관),
IconButton `component="div"` 교체(중첩 버튼 구조라 재설계 필요), 폰트 교체(Pretendard 유지 — 한글 품질 양호).
