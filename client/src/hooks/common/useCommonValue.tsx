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

  const isGoalTodayList: boolean = PATH.includes("/today/goal/list");
  const isGoalList: boolean = !isGoalTodayList && PATH.includes("/goal/list");
  const isTodayList: boolean = !isGoalTodayList && !isGoalList && PATH.includes("/today/list");
  const isRealList: boolean = !isGoalList && !isTodayList && !isGoalTodayList && PATH.includes("/list");

  const isGoalDetail: boolean =  PATH.includes("/goal/detail");
  const isCalendarDetail: boolean = !isGoalDetail && PATH.includes("/calendar/detail");
  const isRealDetail: boolean = !isGoalDetail && !isCalendarDetail && PATH.includes("/detail");

  const isGoal: boolean = secondStr === "goal";
  const toFind: string = `/${firstStr}/find/list`;
  const toFavorite: string = `/${firstStr}/favorite/list`;
  const toList: string = isGoal ? `/${firstStr}/goal/list` : `/${firstStr}/list`;
  const toDetail: string = isGoal ? `/${firstStr}/goal/detail` : `/${firstStr}/detail`;
  const toDelete: string = isGoal ? `/${firstStr}/goal/delete` : `/${firstStr}/delete`;

  // env
  const TITLE: any = process.env.REACT_APP_TITLE || "";
  const URL: string = process.env.REACT_APP_SERVER_URL || "";
  const GCLOUD_URL: string = process.env.REACT_APP_GCLOUD_URL || "";
  const ADMIN_ID: string = process.env.REACT_APP_ADMIN_ID || "";
  const ADMIN_PW: string = process.env.REACT_APP_ADMIN_PW || "";
  const SUBFIX : string= process.env[`REACT_APP_${firstStr.toUpperCase()}`] || "";
  const SUBFIX_GOOGLE: string = process.env[`REACT_APP_GOOGLE`] || "";
  const SUBFIX_ADMOB: string = process.env[`REACT_APP_ADMOB`] || "";
  const SUBFIX_EXERCISE: string = process.env[`REACT_APP_EXERCISE`] || "";
  const SUBFIX_FOOD: string = process.env[`REACT_APP_FOOD`] || "";
  const SUBFIX_MONEY: string = process.env[`REACT_APP_MONEY`] || "";
  const SUBFIX_SLEEP: string = process.env[`REACT_APP_SLEEP`] || "";

  // URL
  const URL_OBJECT: string = URL + SUBFIX;
  const URL_GOOGLE: string = URL + SUBFIX_GOOGLE;
  const URL_ADMOB: string = URL + SUBFIX_ADMOB;
  const URL_EXERCISE: string = URL + SUBFIX_EXERCISE;
  const URL_FOOD: string = URL + SUBFIX_FOOD;
  const URL_MONEY: string = URL + SUBFIX_MONEY;
  const URL_SLEEP: string = URL + SUBFIX_SLEEP;

  // local storage (object 타입)
  const localTitle: any = JSON.parse(localStorage.getItem(TITLE) || "{}");
  const localSetting: any = localTitle?.setting || {};

  // local storage (string 타입)
  const localTimeZone: string = localTitle?.setting?.locale?.timeZone;
  const localZoneName: string = localTitle?.setting?.locale?.zoneName;
  const localLang: string = localTitle?.setting?.locale?.lang;
  const localIsoCode: string = localTitle?.setting?.locale?.isoCode;
  const localCurrency: string = localTitle?.setting?.locale?.currency;

  // session storage (object 타입)
  const sessionTitle: any = JSON.parse(sessionStorage.getItem(TITLE) || "{}");
  const sessionSetting: any = sessionTitle?.setting || {};

  const sessionPercent: any = sessionTitle?.setting?.sync?.percent || {};
  const sessionScale: any = sessionTitle?.setting?.sync?.scale || {};
  const sessionFavorite: any = sessionTitle?.setting?.sync?.favorite || {};
  const sessionProperty: any = sessionTitle?.setting?.sync?.property || {};
  const sessionCategory: any = sessionTitle?.setting?.sync?.category || {};
  const sessionFoodSection: any[] = sessionTitle?.section?.food || [];

  const calendarArray: any[] = sessionTitle?.setting?.sync?.category?.calendar || [];
  const exerciseArray: any[] = sessionTitle?.setting?.sync?.category?.exercise || [];
  const foodArray: any[] = sessionTitle?.setting?.sync?.category?.food || [];
  const moneyArray: any[] = sessionTitle?.setting?.sync?.category?.money || [];
  const sleepArray: any[] = sessionTitle?.setting?.sync?.category?.sleep || [];

  // session storage (string 타입)
  const isAdmin: string = sessionTitle?.setting?.id?.admin || "";
  const sessionId: string = sessionTitle?.setting?.id?.sessionId || "";
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
    isTodayList,
    isGoalTodayList,
    isRealList,
    isCalendarDetail,
    isGoalList,
    isGoalDetail,
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
    localSetting,
    localTimeZone,
    localZoneName,
    localLang,
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
    sessionTitle,
    localTitle,
    sessionSetting,
    sessionFoodSection,
  };
};