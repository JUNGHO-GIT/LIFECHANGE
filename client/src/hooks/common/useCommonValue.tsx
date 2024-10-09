// useCommonValue.tsx

import { useLocation, useNavigate } from "@imports/ImportReacts";

// -------------------------------------------------------------------------------------------------
export const useCommonValue = () => {

  const navigate: any = useNavigate();
  const location: any = useLocation();

  const location_id: string = location?.state?.id;
  const location_dateType: string = location?.state?.dateType;
  const location_dateStart: string = location?.state?.dateStart;
  const location_dateEnd: string = location?.state?.dateEnd;
  const location_category: string = location?.state?.category;

  const PATH: string = location?.pathname;
  const firstStr: string = PATH?.split("/")[1] || "";
  const secondStr: string = PATH?.split("/")[2] || "";
  const thirdStr: string = PATH?.split("/")[3] || "";

  const isGoal: boolean = secondStr === "goal";
  const isGoalToday: boolean = PATH.includes("/today/goal");
  const isToday: boolean = !isGoalToday && PATH.includes("/today/list");
  const isCalendarDetail: boolean = PATH.includes("/calendar/detail");
  const isGoalList: boolean = PATH.includes("/goal/list");
  const isGoalDetail: boolean = PATH.includes("/goal/detail");
  const isRealList: boolean = !PATH.includes("/goal") && PATH.includes("/list");
  const isRealDetail: boolean = !PATH.includes("/goal") && PATH.includes("/detail");

  const toFind: string = `/${firstStr}/find/list`;
  const toFavorite: string = `/${firstStr}/favorite/list`;
  const toList: string = isGoal ? `/${firstStr}/goal/list` : `/${firstStr}/list`;
  const toDetail: string = isGoal ? `/${firstStr}/goal/detail` : `/${firstStr}/detail`;
  const toDelete: string = isGoal ? `/${firstStr}/goal/delete` : `/${firstStr}/delete`;

  const TITLE: any = process.env.REACT_APP_TITLE || "";
  const URL: string = process.env.REACT_APP_SERVER_URL || "";
  const GCLOUD_URL: string = process.env.REACT_APP_GCLOUD_URL || "";
  const SUBFIX : string= process.env[`REACT_APP_${firstStr.toUpperCase()}`] || "";
  const SUBFIX_GOOGLE: string = process.env[`REACT_APP_GOOGLE`] || "";
  const SUBFIX_ADMOB: string = process.env[`REACT_APP_ADMOB`] || "";
  const SUBFIX_EXERCISE: string = process.env[`REACT_APP_EXERCISE`] || "";
  const SUBFIX_FOOD: string = process.env[`REACT_APP_FOOD`] || "";
  const SUBFIX_MONEY: string = process.env[`REACT_APP_MONEY`] || "";
  const SUBFIX_SLEEP: string = process.env[`REACT_APP_SLEEP`] || "";
  const URL_OBJECT: string = URL + SUBFIX;
  const URL_GOOGLE: string = URL + SUBFIX_GOOGLE;
  const URL_ADMOB: string = URL + SUBFIX_ADMOB;
  const URL_EXERCISE: string = URL + SUBFIX_EXERCISE;
  const URL_FOOD: string = URL + SUBFIX_FOOD;
  const URL_MONEY: string = URL + SUBFIX_MONEY;
  const URL_SLEEP: string = URL + SUBFIX_SLEEP;
  const ADMIN_ID: string = process.env.REACT_APP_ADMIN_ID || "";
  const ADMIN_PW: string = process.env.REACT_APP_ADMIN_PW || "";

  // object 타입
  const sessionPercent: any = sessionStorage.getItem(`${TITLE}_percent`) || "{}";
  const sessionCategory: any = sessionStorage.getItem(`${TITLE}_category`)|| "{}";
  const sessionScale: string = sessionStorage.getItem(`${TITLE}_scale`) || "{}";
  const sessionFavorite: any = sessionStorage.getItem(`${TITLE}_favorite`) || "{}";
  const sessionProperty: any = sessionStorage.getItem(`${TITLE}_property`) || "{}";
  const calendarArray: any[] = JSON.parse(sessionCategory)?.calendar || [];
  const exerciseArray: any[] = JSON.parse(sessionCategory)?.exercise || [];
  const foodArray: any[] = JSON.parse(sessionCategory)?.food || [];
  const moneyArray: any[] = JSON.parse(sessionCategory)?.money || [];
  const sleepArray: any[] = JSON.parse(sessionCategory)?.sleep || [];

  // string 타입
  const isAdmin: string = sessionStorage.getItem(`${TITLE}_admin`) || "";
  const sessionId: string = sessionStorage.getItem(`${TITLE}_sessionId`) || "";
  const localeSetting: any = localStorage.getItem(`${TITLE}_localeSetting`) || "{}";

  const localTimeZone: string = JSON.parse(localeSetting)?.timeZone || "Asia/Seoul";
  const localZoneName: string = JSON.parse(localeSetting)?.zoneName || "KST";
  const localLocale: string = JSON.parse(localeSetting)?.locale || "ko";
  const localIsoCode: string = JSON.parse(localeSetting)?.isoCode || "KR";
  const localCurrency: string = JSON.parse(localeSetting)?.currency || "KRW";

  const exerciseChartArray: any[] = [
    "volume", "cardio"
  ];
  const foodChartArray: any[] = [
    "kcal", "carb", "protein", "fat"
  ];
  const moneyChartArray: any[] = [
    "income", "expense"
  ];
  const sleepChartArray: any[] = [
    "bedTime", "wakeTime", "sleepTime"
  ];
  const barChartArray: any[] = [
    "goal", "real"
  ];
  const calendarColors: any[] = [
    "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
  ];
  const bgColors: any[] = [
    "#1976d2", "#4CAF50", "#FFC107", "#FF5722", "#673AB7",
    "#3F51B5", "#2196F3", "#009688", "#CDDC39", "#FFEB3B",
    "#9E9E9E"
  ];
  const chartColors: any[] = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // -----------------------------------------------------------------------------------------------
  return {
    navigate,
    location,
    location_id,
    location_dateType,
    location_dateStart,
    location_dateEnd,
    location_category,
    PATH,
    firstStr,
    secondStr,
    thirdStr,
    isGoal,
    isGoalToday,
    isToday,
    isCalendarDetail,
    isGoalList,
    isGoalDetail,
    isRealList,
    isRealDetail,
    toFind,
    toFavorite,
    toList,
    toDetail,
    toDelete,
    TITLE,
    URL,
    GCLOUD_URL,
    SUBFIX,
    SUBFIX_GOOGLE,
    SUBFIX_EXERCISE,
    SUBFIX_FOOD,
    SUBFIX_MONEY,
    SUBFIX_SLEEP,
    URL_OBJECT,
    URL_GOOGLE,
    URL_ADMOB,
    URL_EXERCISE,
    URL_FOOD,
    URL_MONEY,
    URL_SLEEP,
    ADMIN_ID,
    ADMIN_PW,
    isAdmin,
    sessionId,
    localeSetting,
    localTimeZone,
    localZoneName,
    localLocale,
    localIsoCode,
    localCurrency,
    sessionPercent,
    sessionCategory,
    sessionScale,
    sessionFavorite,
    sessionProperty,
    calendarArray,
    exerciseArray,
    foodArray,
    moneyArray,
    sleepArray,
    exerciseChartArray,
    foodChartArray,
    moneyChartArray,
    sleepChartArray,
    barChartArray,
    calendarColors,
    bgColors,
    chartColors,
  };
};