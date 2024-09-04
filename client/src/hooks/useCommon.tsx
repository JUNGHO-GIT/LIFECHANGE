// useCommon.tsx

import { useLocation, useNavigate } from "@imports/ImportReacts";
import { useTranslate } from "@imports/ImportHooks";
import { moment, Moment } from "@imports/ImportLibs";

// -------------------------------------------------------------------------------------------------
export const useCommon = () => {

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

  const TITLE = process.env.REACT_APP_TITLE || "";
  const URL: string = process.env.REACT_APP_SERVER_URL || "";
  const SUBFIX : string= process.env[`REACT_APP_${firstStr.toUpperCase()}`] || "";
  const SUBFIX_GOOGLE: string = process.env[`REACT_APP_GOOGLE`] || "";
  const SUBFIX_EXERCISE: string = process.env[`REACT_APP_EXERCISE`] || "";
  const SUBFIX_FOOD: string = process.env[`REACT_APP_FOOD`] || "";
  const SUBFIX_MONEY: string = process.env[`REACT_APP_MONEY`] || "";
  const SUBFIX_SLEEP: string = process.env[`REACT_APP_SLEEP`] || "";
  const URL_OBJECT: string = URL + SUBFIX;
  const URL_GOOGLE: string = URL + SUBFIX_GOOGLE;
  const URL_EXERCISE: string = URL + SUBFIX_EXERCISE;
  const URL_FOOD: string = URL + SUBFIX_FOOD;
  const URL_MONEY: string = URL + SUBFIX_MONEY;
  const URL_SLEEP: string = URL + SUBFIX_SLEEP;

  const ADMIN_ID: string = process.env.REACT_APP_ADMIN_ID || "";
  const ADMIN_PW: string = process.env.REACT_APP_ADMIN_PW || "";

  // string 타입
  const isAdmin: string = sessionStorage.getItem(`${TITLE}_admin`) || "";
  const sessionLang: string = sessionStorage.getItem(`${TITLE}_lang`) || "ko";
  const sessionId: string = sessionStorage.getItem(`${TITLE}_sessionId`) || "";

  // object 타입
  const sessionPercent: any = sessionStorage.getItem(`${TITLE}_percent`) || "{}";
  const sessionProperty: any = sessionStorage.getItem(`${TITLE}_property`) || "{}";
  const sessionCategory: any = sessionStorage.getItem(`${TITLE}_category`)|| "{}";

  const sessionScale: string = sessionStorage.getItem(`${TITLE}_scale`) || "";

  const calendarArray: any[] = JSON.parse(sessionCategory)?.calendar || [];
  const exerciseArray: any[] = JSON.parse(sessionCategory)?.exercise || [];
  const foodArray: any[] = JSON.parse(sessionCategory)?.food || [];
  const moneyArray: any[] = JSON.parse(sessionCategory)?.money || [];
  const sleepArray: any[] = JSON.parse(sessionCategory)?.sleep || [];
  const curProperty = sessionProperty?.curProperty || "0";

  const dataCategoryArray: any[] = [
    "exercise", "food", "calendar", "money", "sleep"
  ];
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
  const COLORS: any[] = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];
  const colors: any[] = [
    "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
  ];

  const newDate: Moment = moment().tz("Asia/Seoul");
  const koreanDate: string = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const curWeekStart: string = moment().tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const curWeekEnd: string = moment().tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");
  const curMonthStart: string = moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD");
  const curMonthEnd: string = moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD");
  const curYearStart: string = moment().tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD");
  const curYearEnd: string = moment().tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD");

  const { translate }: any = useTranslate();

  return {
    navigate, location,
    location_id, location_category, location_dateType, location_dateStart, location_dateEnd,
    PATH, firstStr, secondStr, thirdStr, TITLE,
    URL_OBJECT, URL_GOOGLE, URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP,
    ADMIN_ID, ADMIN_PW, isAdmin,
    sessionLang, sessionPercent, sessionProperty, sessionScale, sessionId, sessionCategory,
    calendarArray, exerciseArray, foodArray, moneyArray, sleepArray, curProperty,
    dataCategoryArray,
    exerciseChartArray, foodChartArray, moneyChartArray, sleepChartArray, barChartArray,
    COLORS, colors,
    newDate, koreanDate, curWeekStart, curWeekEnd, curMonthStart, curMonthEnd, curYearStart, curYearEnd,
    translate,
  };
};