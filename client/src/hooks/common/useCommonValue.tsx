/**
 * @file useCommonValue.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import {
  NavigateFunction,
  startTransition,
  useCallback,
  useLocation,
  useMemo,
  useNavigate,
} from "@exportReacts";
import { getLocalRoot, getSessionRoot } from "@assets/scripts/storage";
import type {
  CommonValueType,
  EnvType,
  LocalTitleType,
  SessionTitleType,
} from "@exportTypes";

// 정적 리터럴: 호출/렌더마다 동일하므로 모듈 스코프 1회 생성 후 참조 안정화 -------------------------------
const EXERCISE_CHART_ARRAY: string[] = [`volume`, `cardio`];
const FOOD_CHART_ARRAY: string[] = [`kcal`, `carb`, `protein`, `fat`];
const MONEY_CHART_ARRAY: string[] = [`income`, `expense`];
const SLEEP_CHART_ARRAY: string[] = [`bedTime`, `wakeTime`, `sleepTime`];
const BAR_CHART_ARRAY: string[] = [`goal`, `record`];
const TODAY_COLORS: string[] = [
  `red`,
  `orange`,
  `yellow`,
  `green`,
  `blue`,
  `navy`,
  `purple`,
  `black`,
  `gray`,
];
const BG_COLORS: string[] = [
  `#1976d2`,
  `#4CAF50`,
  `#FFC107`,
  `#FF5722`,
  `#673AB7`,
  `#3F51B5`,
  `#2196F3`,
  `#009688`,
  `#CDDC39`,
  `#FFEB3B`,
  `#9E9E9E`,
];
const CHART_COLORS: string[] = [
  `#0088FE`,
  `#00C49F`,
  `#FFBB28`,
  `#FF5733`,
  `#6F42C1`,
  `#0EA5E9`,
  `#22C55E`,
  `#D97706`,
  `#EF4444`,
  `#9333EA`,
];
const CHART_THEME_COLORS: Record<string, string> = {
  kcal: `#E85A5A`,
  carb: `#0876B9`,
  protein: `#2FA56D`,
  fat: `#D9A326`,
  volume: `#0876B9`,
  cardio: `#E85A5A`,
  scale: `#2FA56D`,
  income: `#0876B9`,
  expense: `#E85A5A`,
  balance: `#2FA56D`,
  bedTime: `#0876B9`,
  wakeTime: `#2FA56D`,
  sleepTime: `#D9A326`,
};
const MACRO_COLORS: Record<string, string> = {
  kcal: CHART_THEME_COLORS.kcal,
  carb: CHART_THEME_COLORS.carb,
  protein: CHART_THEME_COLORS.protein,
  fat: CHART_THEME_COLORS.fat,
};

// -------------------------------------------------------------------------------------------------
export const useCommonValue = (): CommonValueType => {
  const rawNavigate: NavigateFunction = useNavigate();
  // 화면 전환을 비긴급(transition)으로 처리: 무거운 레이아웃 리렌더가 클릭 응답을 막지 않도록
  const navigate = useCallback(
    ((to: any, options?: any): void => {
      startTransition(() => {
        rawNavigate(to, options);
      });
    }) as NavigateFunction,
    [ rawNavigate ],
  );
  const location: ReturnType<typeof useLocation> = useLocation();
  const PATH: string = location?.pathname ?? ``;
  const pathParts: string[] = PATH ? PATH.split(`/`) : [];
  const env: EnvType = import.meta.env as unknown as EnvType;
  const TITLE: string = env.VITE_APP_TITLE ?? ``;

  // 캐시된 root 사용: 페이지 전환 시 컴포넌트마다 전체 객체를 재파싱하지 않도록
  const localTitle: LocalTitleType = useMemo(() => {
    return getLocalRoot() as LocalTitleType;
  }, [TITLE, location.pathname]);

  const sessionTitle: SessionTitleType = useMemo(() => {
    return getSessionRoot() as SessionTitleType;
  }, [TITLE, location.pathname]);

  // 세션 파생값 기본 객체 생성 ----------------------------------------------------------------------
  const scaleDefault = useMemo(() => ({
    initScale: sessionTitle?.setting?.sync?.scale?.initScale ?? ``,
    minScale: sessionTitle?.setting?.sync?.scale?.minScale ?? ``,
    maxScale: sessionTitle?.setting?.sync?.scale?.maxScale ?? ``,
    curScale: sessionTitle?.setting?.sync?.scale?.curScale ?? ``,
    dateStart: sessionTitle?.setting?.sync?.scale?.dateStart ?? ``,
    dateEnd: sessionTitle?.setting?.sync?.scale?.dateEnd ?? ``,
  }), [sessionTitle]);

  const nutritionDefault = useMemo(() => ({
    initAvgKcalIntake:
      sessionTitle?.setting?.sync?.nutrition?.initAvgKcalIntake ?? ``,
    totalKcalIntake:
      sessionTitle?.setting?.sync?.nutrition?.totalKcalIntake ?? ``,
    totalCarbIntake:
      sessionTitle?.setting?.sync?.nutrition?.totalCarbIntake ?? ``,
    totalProteinIntake:
      sessionTitle?.setting?.sync?.nutrition?.totalProteinIntake ?? ``,
    totalFatIntake:
      sessionTitle?.setting?.sync?.nutrition?.totalFatIntake ?? ``,
    curAvgKcalIntake:
      sessionTitle?.setting?.sync?.nutrition?.curAvgKcalIntake ?? ``,
    curAvgCarbIntake:
      sessionTitle?.setting?.sync?.nutrition?.curAvgCarbIntake ?? ``,
    curAvgProteinIntake:
      sessionTitle?.setting?.sync?.nutrition?.curAvgProteinIntake ?? ``,
    curAvgFatIntake:
      sessionTitle?.setting?.sync?.nutrition?.curAvgFatIntake ?? ``,
    dateStart: sessionTitle?.setting?.sync?.nutrition?.dateStart ?? ``,
    dateEnd: sessionTitle?.setting?.sync?.nutrition?.dateEnd ?? ``,
  }), [sessionTitle]);

  const propertyDefault = useMemo(() => ({
    initProperty: sessionTitle?.setting?.sync?.property?.initProperty ?? ``,
    totalIncomeAll:
      sessionTitle?.setting?.sync?.property?.totalIncomeAll ?? ``,
    totalIncomeExclusion:
      sessionTitle?.setting?.sync?.property?.totalIncomeExclusion ?? ``,
    totalExpenseAll:
      sessionTitle?.setting?.sync?.property?.totalExpenseAll ?? ``,
    totalExpenseExclusion:
      sessionTitle?.setting?.sync?.property?.totalExpenseExclusion ?? ``,
    curPropertyAll:
      sessionTitle?.setting?.sync?.property?.curPropertyAll ?? ``,
    curPropertyExclusion:
      sessionTitle?.setting?.sync?.property?.curPropertyExclusion ?? ``,
    dateStart: sessionTitle?.setting?.sync?.property?.dateStart ?? ``,
    dateEnd: sessionTitle?.setting?.sync?.property?.dateEnd ?? ``,
  }), [sessionTitle]);

  // 매 렌더 재계산 완화: 파생값 전체를 의존성 기준으로 메모이즈 --------------------------------------------
  return useMemo((): CommonValueType => ({
    // Router & Location
    navigate: navigate,
    location: location as unknown as CommonValueType[`location`],
    location_id: location?.state?.id,
    location_from: location?.state?.from,
    location_dateType: location?.state?.dateType,
    location_dateStart: location?.state?.dateStart,
    location_dateEnd: location?.state?.dateEnd,
    location_category: location?.state?.category,
    // Path Information
    PATH: PATH,
    firstStr: pathParts[1] ?? ``,
    secondStr: pathParts[2] ?? ``,
    thirdStr: pathParts[3] ?? ``,
    // Basic Flags
    isList: PATH.includes(`/list`),
    isDetail: PATH.includes(`/detail`),
    isGoal: pathParts[2] === `goal`,
    isRecord: pathParts[2] === `record`,
    isFind: pathParts[2] === `find`,
    isFavorite: pathParts[2] === `favorite`,
    isChart: pathParts[2] === `chart`,
    isCalendar: pathParts[1] === `calendar`,
    isExercise: pathParts[1] === `exercise`,
    isFood: pathParts[1] === `food`,
    isMoney: pathParts[1] === `money`,
    isSleep: pathParts[1] === `sleep`,
    isUser: pathParts[1] === `user`,
    isAuth: pathParts[1] === `auth`,
    isAdminPage: pathParts[1] === `admin`,
    // Calendar Flags
    isCalendarList: PATH.includes(`/calendar/list`),
    isCalendarDetail: PATH.includes(`/calendar/detail`),
    // Exercise Flags
    isExerciseChartList: PATH.includes(`/exercise/chart/list`),
    isExerciseGoalList: PATH.includes(`/exercise/goal/list`),
    isExerciseGoalDetail: PATH.includes(`/exercise/goal/detail`),
    isExerciseRecordList: PATH.includes(`/exercise/record/list`),
    isExerciseRecordDetail: PATH.includes(`/exercise/record/detail`),
    isExerciseFindList: PATH.includes(`/exercise/find/list`),
    isExerciseFavoriteList: PATH.includes(`/exercise/favorite/list`),
    // Food Flags
    isFoodChartList: PATH.includes(`/food/chart/list`),
    isFoodGoalList: PATH.includes(`/food/goal/list`),
    isFoodGoalDetail: PATH.includes(`/food/goal/detail`),
    isFoodRecordList: PATH.includes(`/food/record/list`),
    isFoodRecordDetail: PATH.includes(`/food/record/detail`),
    isFoodFindList: PATH.includes(`/food/find/list`),
    isFoodFavoriteList: PATH.includes(`/food/favorite/list`),
    // Money Flags
    isMoneyChartList: PATH.includes(`/money/chart/list`),
    isMoneyGoalList: PATH.includes(`/money/goal/list`),
    isMoneyGoalDetail: PATH.includes(`/money/goal/detail`),
    isMoneyRecordList: PATH.includes(`/money/record/list`),
    isMoneyRecordDetail: PATH.includes(`/money/record/detail`),
    isMoneyFindList: PATH.includes(`/money/find/list`),
    isMoneyFavoriteList: PATH.includes(`/money/favorite/list`),
    // Sleep Flags
    isSleepChartList: PATH.includes(`/sleep/chart/list`),
    isSleepGoalList: PATH.includes(`/sleep/goal/list`),
    isSleepGoalDetail: PATH.includes(`/sleep/goal/detail`),
    isSleepRecordList: PATH.includes(`/sleep/record/list`),
    isSleepRecordDetail: PATH.includes(`/sleep/record/detail`),
    isSleepFindList: PATH.includes(`/sleep/find/list`),
    isSleepFavoriteList: PATH.includes(`/sleep/favorite/list`),
    // User Flags
    isUserAppInfo: PATH.includes(`/user/appInfo`),
    isUserAppSetting: PATH.includes(`/user/appSetting`),
    isUserSignup: PATH.includes(`/user/signup`),
    isUserLogin: PATH.includes(`/user/login`),
    isUserResetPw: PATH.includes(`/user/resetPw`),
    isUserDetail: PATH.includes(`/user/detail`),
    isUserDelete: PATH.includes(`/user/delete`),
    isUserCategory: PATH.includes(`/user/category`),
    // Auth Flags
    isAuthError: PATH.includes(`/auth/error`),
    isAuthGoogle: PATH.includes(`/auth/google`),
    isAuthPrivacy: PATH.includes(`/auth/privacy`),
    // Admin Flags
    isAdminDashboard: PATH.includes(`/admin/dashboard`),
    // Combined Flags
    isChartList:
      PATH.includes(`/exercise/chart/list`) ||
      PATH.includes(`/food/chart/list`) ||
      PATH.includes(`/money/chart/list`) ||
      PATH.includes(`/sleep/chart/list`),
    isFindList:
      PATH.includes(`/exercise/find/list`) ||
      PATH.includes(`/food/find/list`) ||
      PATH.includes(`/money/find/list`) ||
      PATH.includes(`/sleep/find/list`),
    isFavoriteList:
      PATH.includes(`/exercise/favorite/list`) ||
      PATH.includes(`/food/favorite/list`) ||
      PATH.includes(`/money/favorite/list`) ||
      PATH.includes(`/sleep/favorite/list`),
    isGoalList:
      PATH.includes(`/exercise/goal/list`) ||
      PATH.includes(`/food/goal/list`) ||
      PATH.includes(`/money/goal/list`) ||
      PATH.includes(`/sleep/goal/list`),
    isGoalDetail:
      PATH.includes(`/exercise/goal/detail`) ||
      PATH.includes(`/food/goal/detail`) ||
      PATH.includes(`/money/goal/detail`) ||
      PATH.includes(`/sleep/goal/detail`),
    isRecordList:
      PATH.includes(`/exercise/record/list`) ||
      PATH.includes(`/food/record/list`) ||
      PATH.includes(`/money/record/list`) ||
      PATH.includes(`/sleep/record/list`),
    isRecordDetail:
      PATH.includes(`/exercise/record/detail`) ||
      PATH.includes(`/food/record/detail`) ||
      PATH.includes(`/money/record/detail`) ||
      PATH.includes(`/sleep/record/detail`),
    // Navigation Paths
    toFind: `/${pathParts[1] ?? ``}/find/list`,
    toFavorite: `/${pathParts[1] ?? ``}/favorite/list`,
    toList: pathParts[2] === `goal` ? `/${pathParts[1] ?? ``}/goal/list` : `/${pathParts[1] ?? ``}/record/list`,
    toDetail: pathParts[2] === `goal` ? `/${pathParts[1] ?? ``}/goal/detail` : `/${pathParts[1] ?? ``}/record/detail`,
    toDelete: pathParts[2] === `goal` ? `/${pathParts[1] ?? ``}/goal/delete` : `/${pathParts[1] ?? ``}/record/delete`,
    toCalendarList: `/calendar/list`,
    toCalendarDetail: `/calendar/detail`,
    // Environment Variables
    TITLE: TITLE,
    URL: env.VITE_APP_SERVER_URL ?? ``,
    GCLOUD_URL: env.VITE_APP_GCLOUD_URL ?? ``,
    ADMIN_ID: env.VITE_APP_ADMIN_ID ?? ``,
    ADMIN_PW: env.VITE_APP_ADMIN_PW ?? ``,
    // API Suffixes
    SUBFIX: env[`VITE_APP_${(pathParts[1] ?? ``).toUpperCase()}`] ?? ``,
    SUBFIX_CALENDAR: env.VITE_APP_CALENDAR ?? ``,
    SUBFIX_GOOGLE: env.VITE_APP_GOOGLE ?? ``,
    SUBFIX_ADMOB: env.VITE_APP_ADMOB ?? ``,
    SUBFIX_ADMIN: env.VITE_APP_ADMIN ?? ``,
    SUBFIX_EXERCISE: env.VITE_APP_EXERCISE ?? ``,
    SUBFIX_FOOD: env.VITE_APP_FOOD ?? ``,
    SUBFIX_MONEY: env.VITE_APP_MONEY ?? ``,
    SUBFIX_SLEEP: env.VITE_APP_SLEEP ?? ``,
    // API URLs
    URL_OBJECT: (env.VITE_APP_SERVER_URL ?? ``) + (env[`VITE_APP_${(pathParts[1] ?? ``).toUpperCase()}`] ?? ``),
    URL_CALENDAR: (env.VITE_APP_SERVER_URL ?? ``) + (env.VITE_APP_CALENDAR ?? ``),
    URL_GOOGLE: (env.VITE_APP_SERVER_URL ?? ``) + (env.VITE_APP_GOOGLE ?? ``),
    URL_ADMOB: (env.VITE_APP_SERVER_URL ?? ``) + (env.VITE_APP_ADMOB ?? ``),
    URL_ADMIN: (env.VITE_APP_SERVER_URL ?? ``) + (env.VITE_APP_ADMIN ?? ``),
    URL_EXERCISE: (env.VITE_APP_SERVER_URL ?? ``) + (env.VITE_APP_EXERCISE ?? ``),
    URL_FOOD: (env.VITE_APP_SERVER_URL ?? ``) + (env.VITE_APP_FOOD ?? ``),
    URL_MONEY: (env.VITE_APP_SERVER_URL ?? ``) + (env.VITE_APP_MONEY ?? ``),
    URL_SLEEP: (env.VITE_APP_SERVER_URL ?? ``) + (env.VITE_APP_SLEEP ?? ``),
    // Admin & Session ID
    isAdmin: sessionTitle?.setting?.id?.admin ?? ``,
    sessionId: sessionTitle?.setting?.id?.sessionId ?? ``,
    // Local Storage Settings
    localSetting: localTitle?.setting ?? {},
    localTimeZone: (localTitle?.setting?.locale?.timeZone ?? `UTC`).trim(),
    localZoneName: (localTitle?.setting?.locale?.zoneName ?? `UTC`).trim(),
    localLang: (localTitle?.setting?.locale?.lang ?? `ko`).trim(),
    localIsoCode: (localTitle?.setting?.locale?.isoCode ?? `US`).trim(),
    localCurrency: (localTitle?.setting?.locale?.currency ?? `USD`).trim(),
    localUnit: (localTitle?.setting?.locale?.unit ?? `lbs`).trim(),
    // Session Storage Settings
    sessionPercent: sessionTitle?.setting?.sync?.percent ?? {},
    sessionCategory: sessionTitle?.setting?.sync?.category ?? {},
    sessionScale: scaleDefault,
    sessionFavorite: sessionTitle?.setting?.sync?.favorite ?? {},
    sessionProperty: propertyDefault,
    sessionNutrition: nutritionDefault,
    // Category Arrays
    exerciseArray: sessionTitle?.setting?.sync?.category?.exercise ?? [],
    foodArray: sessionTitle?.setting?.sync?.category?.food ?? [],
    moneyArray: sessionTitle?.setting?.sync?.category?.money ?? [],
    sleepArray: sessionTitle?.setting?.sync?.category?.sleep ?? [],
    // Storage Objects
    sessionTitle: sessionTitle || {},
    localTitle: localTitle || {},
    sessionSetting: sessionTitle?.setting ?? {},
    sessionFoodSection: sessionTitle?.section?.food ?? [],
    // Chart Configuration Arrays
    exerciseChartArray: EXERCISE_CHART_ARRAY,
    foodChartArray: FOOD_CHART_ARRAY,
    moneyChartArray: MONEY_CHART_ARRAY,
    sleepChartArray: SLEEP_CHART_ARRAY,
    barChartArray: BAR_CHART_ARRAY,
    todayColors: TODAY_COLORS,
    bgColors: BG_COLORS,
    chartColors: CHART_COLORS,
    chartThemeColors: CHART_THEME_COLORS,
    macroColors: MACRO_COLORS,
  }), [
    navigate,
    location,
    TITLE,
    localTitle,
    sessionTitle,
    scaleDefault,
    nutritionDefault,
    propertyDefault,
  ]);
};
