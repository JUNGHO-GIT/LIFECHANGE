// useCommon.jsx

import { useLocation, useNavigate } from "../../import/ImportReacts.jsx";
import { useTranslate } from "../../import/ImportHooks.jsx";
import { moment } from "../../import/ImportLibs.jsx";

// -------------------------------------------------------------------------------------------------
export const useCommon = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const location_id = location?.state?.id;
  const location_dateType = location?.state?.dateType;
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const location_category = location?.state?.category;

  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env[`REACT_APP_${firstStr.toUpperCase()}`] || "";
  const SUBFIX_GOOGLE = process.env[`REACT_APP_GOOGLE`] || "";
  const SUBFIX_EXERCISE = process.env[`REACT_APP_EXERCISE`] || "";
  const SUBFIX_FOOD = process.env[`REACT_APP_FOOD`] || "";
  const SUBFIX_MONEY = process.env[`REACT_APP_MONEY`] || "";
  const SUBFIX_SLEEP = process.env[`REACT_APP_SLEEP`] || "";
  const URL_OBJECT = URL + SUBFIX;
  const URL_GOOGLE = URL + SUBFIX_GOOGLE;
  const URL_EXERCISE = URL + SUBFIX_EXERCISE;
  const URL_FOOD = URL + SUBFIX_FOOD;
  const URL_MONEY = URL + SUBFIX_MONEY;
  const URL_SLEEP = URL + SUBFIX_SLEEP;

  const ADMIN_ID = process.env.REACT_APP_ADMIN_ID || "";
  const ADMIN_PW = process.env.REACT_APP_ADMIN_PW || "";

  const sessionId = sessionStorage.getItem("ID_SESSION") || "";
  const session = sessionStorage.getItem("CATEGORY") || "{}";
  const dataCategoryArray = ["exercise", "food", "calendar", "money", "sleep"];

  const calendarArray = JSON.parse(session)?.calendar || [];
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const foodArray = JSON.parse(session)?.food || [];
  const moneyArray = JSON.parse(session)?.money || [];
  const sleepArray = JSON.parse(session)?.sleep || [];

  const property = JSON.parse(sessionStorage.getItem("property") || "{}");
  const curProperty = property?.curProperty || "0";

  const exerciseChartArray = ["volume", "cardio"];
  const foodChartArray = ["kcal", "carb", "protein", "fat"];
  const moneyChartArray = ["income", "expense"];
  const sleepChartArray = ["bedTime", "wakeTime", "sleepTime"];
  const barChartArray = ["goal", "real"];
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];
  const colors = [
    "red", "orange", "yellow", "green",
    "blue", "navy", "purple", "black", "gray"
  ];

  const newDate = moment().tz("Asia/Seoul");
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");
  const curMonthStart = moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD");
  const curMonthEnd = moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD");
  const curYearStart = moment().tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD");
  const curYearEnd = moment().tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD");

  const {translate} = useTranslate();

  return {
    navigate, location,
    location_id, location_category, location_dateType, location_dateStart, location_dateEnd,
    PATH, firstStr, secondStr, thirdStr,
    URL_OBJECT, URL_GOOGLE, URL_EXERCISE, URL_FOOD, URL_MONEY, URL_SLEEP,
    ADMIN_ID, ADMIN_PW,
    sessionId, session, dataCategoryArray,
    calendarArray, exerciseArray, foodArray, moneyArray, sleepArray,
    property, curProperty,
    exerciseChartArray, foodChartArray, moneyChartArray, sleepChartArray, barChartArray,
    COLORS, colors,
    newDate, koreanDate, curWeekStart, curWeekEnd, curMonthStart, curMonthEnd, curYearStart, curYearEnd,
    translate,
  };
};