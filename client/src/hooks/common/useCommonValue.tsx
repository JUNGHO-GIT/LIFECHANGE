// useCommonValue.tsx

import { useLocation, useNavigate, useMemo } from "@importReacts";

// -------------------------------------------------------------------------------------------------
export const useCommonValue = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const PATH: string = location?.pathname;
  const pathParts = PATH?.split("/") || [];
  const TITLE: any = process.env.REACT_APP_TITLE || "";
  const localTitle: any = useMemo(() => JSON.parse(localStorage.getItem(TITLE) || "{}"), [TITLE]);
  const sessionTitle: any = useMemo(() => JSON.parse(sessionStorage.getItem(TITLE) || "{}"), [TITLE]);

  // ----------------------------------------------------------------------------------------------------
  return {
    // Router & Location
    navigate: navigate,
    location: location,
    location_id: location?.state?.id,
    location_from: location?.state?.from,
    location_dateType: location?.state?.dateType,
    location_dateStart: location?.state?.dateStart,
    location_dateEnd: location?.state?.dateEnd,
    location_category: location?.state?.category,
    // Path Information
    PATH: PATH,
    firstStr: pathParts[1] || "",
    secondStr: pathParts[2] || "",
    thirdStr: pathParts[3] || "",
    // Basic Flags
		isList: PATH.includes("/list"),
		isDetail: PATH.includes("/detail"),
		isGoal: pathParts[2] === "goal",
		isRecord: pathParts[2] === "record",
		isFind: pathParts[2] === "find",
		isFavorite: pathParts[2] === "favorite",
		isChart: pathParts[2] === "chart",
		isToday: pathParts[1] === "today",
		isCalendar: pathParts[1] === "calendar",
		isExercise: pathParts[1] === "exercise",
		isFood: pathParts[1] === "food",
		isMoney: pathParts[1] === "money",
		isSleep: pathParts[1] === "sleep",
		isUser: pathParts[1] === "user",
		isAuth: pathParts[1] === "auth",
		isAdminPage: pathParts[1] === "admin",
    // Today Flags
		isTodayGoalList: PATH.includes("/today/goal/list"),
		isTodayGoalDetail: PATH.includes("/today/goal/detail"),
		isTodayRecordList: PATH.includes("/today/record/list"),
		isTodayRecordDetail: PATH.includes("/today/record/detail"),
		// Calendar Flags
		isCalendarList: PATH.includes("/calendar/list"),
		isCalendarDetail: PATH.includes("/calendar/detail"),
    // Exercise Flags
		isExerciseChartList: PATH.includes("/exercise/chart/list"),
		isExerciseGoalList: PATH.includes("/exercise/goal/list"),
		isExerciseGoalDetail: PATH.includes("/exercise/goal/detail"),
		isExerciseRecordList: PATH.includes("/exercise/record/list"),
		isExerciseRecordDetail: PATH.includes("/exercise/record/detail"),
		isExerciseFindList: PATH.includes("/exercise/find/list"),
		isExerciseFavoriteList: PATH.includes("/exercise/favorite/list"),
    // Food Flags
		isFoodChartList: PATH.includes("/food/chart/list"),
		isFoodGoalList: PATH.includes("/food/goal/list"),
		isFoodGoalDetail: PATH.includes("/food/goal/detail"),
		isFoodRecordList: PATH.includes("/food/record/list"),
		isFoodRecordDetail: PATH.includes("/food/record/detail"),
		isFoodFindList: PATH.includes("/food/find/list"),
		isFoodFavoriteList: PATH.includes("/food/favorite/list"),
    // Money Flags
		isMoneyChartList: PATH.includes("/money/chart/list"),
		isMoneyGoalList: PATH.includes("/money/goal/list"),
		isMoneyGoalDetail: PATH.includes("/money/goal/detail"),
		isMoneyRecordList: PATH.includes("/money/record/list"),
		isMoneyRecordDetail: PATH.includes("/money/record/detail"),
		isMoneyFindList: PATH.includes("/money/find/list"),
		isMoneyFavoriteList: PATH.includes("/money/favorite/list"),
    // Sleep Flags
		isSleepChartList: PATH.includes("/sleep/chart/list"),
		isSleepGoalList: PATH.includes("/sleep/goal/list"),
		isSleepGoalDetail: PATH.includes("/sleep/goal/detail"),
		isSleepRecordList: PATH.includes("/sleep/record/list"),
		isSleepRecordDetail: PATH.includes("/sleep/record/detail"),
		isSleepFindList: PATH.includes("/sleep/find/list"),
		isSleepFavoriteList: PATH.includes("/sleep/favorite/list"),
    // User Flags
		isUserAppInfo: PATH.includes("/user/appInfo"),
		isUserAppSetting: PATH.includes("/user/appSetting"),
		isUserSignup: PATH.includes("/user/signup"),
		isUserLogin: PATH.includes("/user/login"),
		isUserResetPw: PATH.includes("/user/resetPw"),
		isUserDetail: PATH.includes("/user/detail"),
		isUserDelete: PATH.includes("/user/delete"),
		isUserCategory: PATH.includes("/user/category"),
    // Auth Flags
		isAuthError: PATH.includes("/auth/error"),
		isAuthGoogle: PATH.includes("/auth/google"),
		isAuthPrivacy: PATH.includes("/auth/privacy"),
    // Admin Flags
		isAdminDashboard: PATH.includes("/admin/dashboard"),
    // Combined Flags
		isChartList: (
			PATH.includes("/exercise/chart/list") ||
			PATH.includes("/food/chart/list") ||
			PATH.includes("/money/chart/list") ||
			PATH.includes("/sleep/chart/list")
		),
		isFindList: (
			PATH.includes("/exercise/find/list") ||
			PATH.includes("/food/find/list") ||
			PATH.includes("/money/find/list") ||
			PATH.includes("/sleep/find/list")
		),
		isFavoriteList: (
			PATH.includes("/exercise/favorite/list") ||
			PATH.includes("/food/favorite/list") ||
			PATH.includes("/money/favorite/list") ||
			PATH.includes("/sleep/favorite/list")
		),
		isGoalList: (
			PATH.includes("/exercise/goal/list") ||
			PATH.includes("/food/goal/list") ||
			PATH.includes("/money/goal/list") ||
			PATH.includes("/sleep/goal/list")
		),
		isGoalDetail: (
			PATH.includes("/exercise/goal/detail") ||
			PATH.includes("/food/goal/detail") ||
			PATH.includes("/money/goal/detail") ||
			PATH.includes("/sleep/goal/detail")
		),
		isRecordList: (
			PATH.includes("/exercise/record/list") ||
			PATH.includes("/food/record/list") ||
			PATH.includes("/money/record/list") ||
			PATH.includes("/sleep/record/list")
		),
		isRecordDetail: (
			PATH.includes("/exercise/record/detail") ||
			PATH.includes("/food/record/detail") ||
			PATH.includes("/money/record/detail") ||
			PATH.includes("/sleep/record/detail")
		),
    // Navigation Paths
    toFind: `/${pathParts[1]}/find/list`,
    toFavorite: `/${pathParts[1]}/favorite/list`,
    toList: pathParts[2] === "goal" ? `/${pathParts[1]}/goal/list` : `/${pathParts[1]}/record/list`,
		toToday: `/today/record/list`,
    toDetail: pathParts[2] === "goal" ? `/${pathParts[1]}/goal/detail` : `/${pathParts[1]}/record/detail`,
    toDelete: pathParts[2] === "goal" ? `/${pathParts[1]}/goal/delete` : `/${pathParts[1]}/record/delete`,
    // Environment Variables
    TITLE,
    URL: process.env.REACT_APP_SERVER_URL || "",
    GCLOUD_URL: process.env.REACT_APP_GCLOUD_URL || "",
    ADMIN_ID: process.env.REACT_APP_ADMIN_ID || "",
    ADMIN_PW: process.env.REACT_APP_ADMIN_PW || "",
    // API Suffixes
    SUBFIX: process.env[`REACT_APP_${pathParts[1]?.toUpperCase()}`] || "",
		SUBFIX_TODAY: process.env.REACT_APP_TODAY || "",
		SUBFIX_CALENDAR: process.env.REACT_APP_CALENDAR || "",
    SUBFIX_GOOGLE: process.env.REACT_APP_GOOGLE || "",
    SUBFIX_ADMOB: process.env.REACT_APP_ADMOB || "",
    SUBFIX_ADMIN: process.env.REACT_APP_ADMIN || "",
    SUBFIX_EXERCISE: process.env.REACT_APP_EXERCISE || "",
    SUBFIX_FOOD: process.env.REACT_APP_FOOD || "",
    SUBFIX_MONEY: process.env.REACT_APP_MONEY || "",
    SUBFIX_SLEEP: process.env.REACT_APP_SLEEP || "",
    // API URLs
    URL_OBJECT:(process.env.REACT_APP_SERVER_URL || "") + (process.env[`REACT_APP_${pathParts[1]?.toUpperCase()}`] || ""),
		URL_TODAY: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_TODAY || ""),
		URL_CALENDAR: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_CALENDAR || ""),
    URL_GOOGLE: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_GOOGLE || ""),
    URL_ADMOB: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_ADMOB || ""),
    URL_ADMIN: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_ADMIN || ""),
    URL_EXERCISE: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_EXERCISE || ""),
    URL_FOOD: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_FOOD || ""),
    URL_MONEY: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_MONEY || ""),
    URL_SLEEP: (process.env.REACT_APP_SERVER_URL || "") + (process.env.REACT_APP_SLEEP || ""),
    // Admin & Session ID
    isAdmin: sessionTitle?.setting?.id?.admin || "",
    sessionId: sessionTitle?.setting?.id?.sessionId || "",
    // Local Storage Settings
    localSetting: localTitle?.setting || {},
    localTimeZone: localTitle?.setting?.locale?.timeZone || "UTC",
    localZoneName: localTitle?.setting?.locale?.zoneName || "UTC",
    localLang: localTitle?.setting?.locale?.lang,
    localIsoCode: localTitle?.setting?.locale?.isoCode || "US",
    localCurrency: localTitle?.setting?.locale?.currency || "USD",
    localUnit: localTitle?.setting?.locale?.unit || "lbs",
    // Session Storage Settings
    sessionPercent: sessionTitle?.setting?.sync?.percent || {},
    sessionCategory: sessionTitle?.setting?.sync?.category || {},
    sessionScale: sessionTitle?.setting?.sync?.scale || {},
    sessionFavorite: sessionTitle?.setting?.sync?.favorite || {},
    sessionProperty: sessionTitle?.setting?.sync?.property || {},
		sessionNutrition: sessionTitle?.setting?.sync?.nutrition || {},
    // Category Arrays
    exerciseArray: sessionTitle?.setting?.sync?.category?.exercise || [],
    foodArray: sessionTitle?.setting?.sync?.category?.food || [],
    moneyArray: sessionTitle?.setting?.sync?.category?.money || [],
    sleepArray: sessionTitle?.setting?.sync?.category?.sleep || [],
    // Storage Objects
    sessionTitle: sessionTitle,
    localTitle: localTitle,
    sessionSetting: sessionTitle?.setting || {},
    sessionFoodSection: sessionTitle?.section?.food || [],
    // Chart Configuration Arrays
    exerciseChartArray: [
			"volume", "cardio"
		],
    foodChartArray: [
			"kcal", "carb", "protein", "fat"
		],
    moneyChartArray: [
			"income", "expense"
		],
    sleepChartArray: [
			"bedTime", "wakeTime", "sleepTime"
		],
    barChartArray: [
			"goal", "record"
		],
		todayColors: [
			"red", "orange", "yellow", "green", "blue",
			"navy", "purple", "black", "gray"
		],
    bgColors: [
			"#1976d2", "#4CAF50", "#FFC107", "#FF5722", "#673AB7",
			"#3F51B5", "#2196F3", "#009688", "#CDDC39", "#FFEB3B", "#9E9E9E"
		],
    chartColors: [
			"#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
			"#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA"
		],
  };
};