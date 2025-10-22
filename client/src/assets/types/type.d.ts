// type.d.ts

import { type Location, type NavigateFunction } from "@importReacts";

// 공통 리터럴 · 유틸 타입 -------------------------------------------------------------------------
export type FirstPathType =
  | "today"
  | "calendar"
  | "exercise"
  | "food"
  | "money"
  | "sleep"
  | "user"
  | "auth"
  | "admin"
  | (string & {});

export type SecondPathType =
  | "goal"
  | "record"
  | "find"
  | "favorite"
  | "chart"
  | "dashboard"
  | (string & {});

export type SortType = "asc" | "desc";
export type DateTypeLiteral = "" | "day" | "week" | "month" | "year";
export type FoodLineMetricType = "kcal" | "carb" | "protein" | "fat" | (string & {});
export type ExerciseChartMetricType = "volume" | "cardio" | (string & {});
export type MoneyChartMetricType = "income" | "expense" | (string & {});
export type SleepChartMetricType = "bedTime" | "wakeTime" | "sleepTime" | (string & {});

// 라우팅 상태 -------------------------------------------------------------------------------------
export interface LocationStateType {
  id?: string | number;
  from?: string;
  dateType?: string;
  dateStart?: string;
  dateEnd?: string;
  category?: string;
}

// 환경변수 -----------------------------------------------------------------------------------------
export interface EnvType {
  REACT_APP_TITLE?: string;
  REACT_APP_SERVER_URL?: string;
  REACT_APP_GCLOUD_URL?: string;
  REACT_APP_ADMIN_ID?: string;
  REACT_APP_ADMIN_PW?: string;
  REACT_APP_TODAY?: string;
  REACT_APP_CALENDAR?: string;
  REACT_APP_GOOGLE?: string;
  REACT_APP_ADMOB?: string;
  REACT_APP_ADMIN?: string;
  REACT_APP_EXERCISE?: string;
  REACT_APP_FOOD?: string;
  REACT_APP_MONEY?: string;
  REACT_APP_SLEEP?: string;
  [key: `REACT_APP_${string}`]: string | undefined;
}

// 로컬 스토리지 스키마 (인라인) -------------------------------------------------------------------
export interface LocalSettingType {
  id?: {
    autoLogin?: "true" | "false" | string;
    autoLoginId?: string;
    autoLoginPw?: string;
    isSaved?: "true" | "false" | string;
    isSavedId?: string;
  };
  locale?: {
    timeZone?: string;
    lang?: string;
    zoneName?: string;
    isoCode?: string;
    currency?: string;
    unit?: string;
  };
}

export interface LocalTitleType {
  setting?: {
    id?: {
      autoLogin?: "true" | "false" | string;
      autoLoginId?: string;
      autoLoginPw?: string;
      isSaved?: "true" | "false" | string;
      isSavedId?: string;
    };
    locale?: {
      timeZone?: string;
      lang?: string;
      zoneName?: string;
      isoCode?: string;
      currency?: string;
      unit?: string;
    };
  };
  tabs?: {
    top?: {
      exercise?: "record" | "chart" | "goal" | "calendar" | "dashboard" | (string & {});
      food?: "record" | "chart" | "goal" | "calendar" | "dashboard" | (string & {});
      today?: "record" | "chart" | "goal" | "calendar" | "dashboard" | (string & {});
      calendar?: "record" | "chart" | "goal" | "calendar" | "dashboard" | (string & {});
      money?: "record" | "chart" | "goal" | "calendar" | "dashboard" | (string & {});
      sleep?: "record" | "chart" | "goal" | "calendar" | "dashboard" | (string & {});
      admin?: "record" | "chart" | "goal" | "calendar" | "dashboard" | (string & {});
      [key: string]: string | undefined;
    };
    bottom?: {
      exercise?: boolean;
      food?: boolean;
      today?: boolean;
      calendar?: boolean;
      money?: boolean;
      sleep?: boolean;
      [key: string]: boolean | undefined;
    };
  };
  paging?: {
    [route: string]: {
      sort?: SortType;
      page?: number;
    };
  };
  isExpanded?: {
    [route: string]:
      | {
          exercise?: unknown[];
          food?: unknown[];
          money?: unknown[];
          sleep?: unknown[];
        }
      | Array<{ expanded?: boolean }>;
  };
  type?: {
    list?: { [route: string]: DateTypeLiteral };
    pie?: {
      [route: string]: {
        section?: DateTypeLiteral;
        line?: FoodLineMetricType | ExerciseChartMetricType | MoneyChartMetricType | SleepChartMetricType;
      };
    };
    line?: {
      [route: string]: {
        section?: DateTypeLiteral;
        line?: FoodLineMetricType | ExerciseChartMetricType | MoneyChartMetricType | SleepChartMetricType;
      };
    };
    avg?: {
      [route: string]: {
        section?: DateTypeLiteral;
        line?: FoodLineMetricType | ExerciseChartMetricType | MoneyChartMetricType | SleepChartMetricType;
      };
    };
  };
  date?: {
    [route: string]: {
      dateType?: DateTypeLiteral;
      dateStart?: string;
      dateEnd?: string;
    };
  };
  [key: string]: unknown;
}

// 세션 스토리지 스키마 (인라인) -------------------------------------------------------------------
export interface ExerciseCategoryItem {
  exercise_record_part: string;
  exercise_record_title?: string[];
}
export interface FoodCategoryItem {
  food_record_part: string;
}
export interface MoneyCategoryItem {
  money_record_part: string;
  money_record_title?: string[];
}
export interface SleepCategoryItem {
  sleep_record_part: string;
}

export interface SessionPercentBlock { score?: string; percent?: string }
export interface SessionSyncPercent {
  exercise?: {
    diff_count?: SessionPercentBlock;
    diff_volume?: SessionPercentBlock;
    diff_cardio?: SessionPercentBlock;
    diff_scale?: SessionPercentBlock;
    average?: SessionPercentBlock;
  };
  food?: {
    diff_kcal?: SessionPercentBlock;
    diff_carb?: SessionPercentBlock;
    diff_protein?: SessionPercentBlock;
    diff_fat?: SessionPercentBlock;
    average?: SessionPercentBlock;
  };
  money?: {
    diff_income?: SessionPercentBlock;
    diff_expense?: SessionPercentBlock;
    average?: SessionPercentBlock;
  };
  sleep?: {
    diff_bedTime?: SessionPercentBlock;
    diff_wakeTime?: SessionPercentBlock;
    diff_sleepTime?: SessionPercentBlock;
    average?: SessionPercentBlock;
  };
  total?: { average?: SessionPercentBlock };
}

export interface SessionSyncCategory {
  exercise?: ExerciseCategoryItem[];
  food?: FoodCategoryItem[];
  money?: MoneyCategoryItem[];
  sleep?: SleepCategoryItem[];
}

export interface SessionSyncScale {
  initScale: string;
  minScale: string;
  maxScale: string;
  curScale: string;
  dateStart: string;
  dateEnd: string;
}

export interface SessionSyncNutrition {
  initAvgKcalIntake: string;
  totalKcalIntake: string;
  totalCarbIntake: string;
  totalProteinIntake: string;
  totalFatIntake: string;
  curAvgKcalIntake: string;
  curAvgCarbIntake: string;
  curAvgProteinIntake: string;
  curAvgFatIntake: string;
  dateStart: string;
  dateEnd: string;
}

export interface SessionSyncFavoriteItem {
  food_record_key?: string;
  food_record_name?: string;
  food_record_brand?: string;
  food_record_count?: string;
  food_record_serv?: string;
  food_record_gram?: string;
  food_record_kcal?: string;
  food_record_carb?: string;
  food_record_protein?: string;
  food_record_fat?: string;
}
export interface SessionSyncFavorite {
  foodFavorite?: SessionSyncFavoriteItem[];
  dateStart?: string;
  dateEnd?: string;
}

export interface SessionSyncProperty {
  initProperty: string;
  totalIncomeAll: string;
  totalIncomeExclusion: string;
  totalExpenseAll: string;
  totalExpenseExclusion: string;
  curPropertyAll: string;
  curPropertyExclusion: string;
  dateStart: string;
  dateEnd: string;
}

export interface SessionSync {
  category?: SessionSyncCategory;
  percent?: SessionSyncPercent;
  scale?: SessionSyncScale;
  nutrition?: SessionSyncNutrition;
  favorite?: SessionSyncFavorite;
  property?: SessionSyncProperty;
}

export interface SessionSettingType {
  id?: { sessionId?: string; admin?: "true" | "false" | string };
  sync?: SessionSync;
}

export interface SessionTitleType {
  section?: {
    food?: Array<{
      food_record_part: string;
      food_record_name: string;
      food_record_brand: string;
      food_record_count: string;
      food_record_serv: string;
      food_record_gram: string;
      food_record_kcal: string;
      food_record_carb: string;
      food_record_protein: string;
      food_record_fat: string;
    }>;
    [key: string]: unknown;
  };
  setting?: SessionSettingType;
  date?: {
    [route: string]: {
      dateType?: DateTypeLiteral;
      dateStart?: string;
      dateEnd?: string;
    };
  };
  [key: string]: unknown;
}

// 공용 Title 타입 ----------------------------------------------------------------------------------
export type AppTitleType = LocalTitleType | SessionTitleType;

// useCommonValue 반환 타입 ------------------------------------------------------------------------
export interface CommonValueType {
  navigate: NavigateFunction;
  location: Location<LocationStateType> & Record<string, unknown>;

  location_id?: LocationStateType["id"];
  location_from?: LocationStateType["from"];
  location_dateType?: LocationStateType["dateType"];
  location_dateStart?: LocationStateType["dateStart"];
  location_dateEnd?: LocationStateType["dateEnd"];
  location_category?: LocationStateType["category"];

  PATH: string;
  firstStr: string;
  secondStr: string;
  thirdStr: string;

  isList: boolean;
  isDetail: boolean;
  isGoal: boolean;
  isRecord: boolean;
  isFind: boolean;
  isFavorite: boolean;
  isChart: boolean;
  isToday: boolean;
  isCalendar: boolean;
  isExercise: boolean;
  isFood: boolean;
  isMoney: boolean;
  isSleep: boolean;
  isUser: boolean;
  isAuth: boolean;
  isAdminPage: boolean;

  isTodayGoalList: boolean;
  isTodayGoalDetail: boolean;
  isTodayRecordList: boolean;
  isTodayRecordDetail: boolean;

  isCalendarList: boolean;
  isCalendarDetail: boolean;

  isExerciseChartList: boolean;
  isExerciseGoalList: boolean;
  isExerciseGoalDetail: boolean;
  isExerciseRecordList: boolean;
  isExerciseRecordDetail: boolean;
  isExerciseFindList: boolean;
  isExerciseFavoriteList: boolean;

  isFoodChartList: boolean;
  isFoodGoalList: boolean;
  isFoodGoalDetail: boolean;
  isFoodRecordList: boolean;
  isFoodRecordDetail: boolean;
  isFoodFindList: boolean;
  isFoodFavoriteList: boolean;

  isMoneyChartList: boolean;
  isMoneyGoalList: boolean;
  isMoneyGoalDetail: boolean;
  isMoneyRecordList: boolean;
  isMoneyRecordDetail: boolean;
  isMoneyFindList: boolean;
  isMoneyFavoriteList: boolean;

  isSleepChartList: boolean;
  isSleepGoalList: boolean;
  isSleepGoalDetail: boolean;
  isSleepRecordList: boolean;
  isSleepRecordDetail: boolean;
  isSleepFindList: boolean;
  isSleepFavoriteList: boolean;

  isUserAppInfo: boolean;
  isUserAppSetting: boolean;
  isUserSignup: boolean;
  isUserLogin: boolean;
  isUserResetPw: boolean;
  isUserDetail: boolean;
  isUserDelete: boolean;
  isUserCategory: boolean;

  isAuthError: boolean;
  isAuthGoogle: boolean;
  isAuthPrivacy: boolean;
  isAdminDashboard: boolean;

  isChartList: boolean;
  isFindList: boolean;
  isFavoriteList: boolean;
  isGoalList: boolean;
  isGoalDetail: boolean;
  isRecordList: boolean;
  isRecordDetail: boolean;

  toFind: string;
  toFavorite: string;
  toList: string;
  toToday: string;
  toDetail: string;
  toDelete: string;

  TITLE: string;
  URL: string;
  GCLOUD_URL: string;
  ADMIN_ID: string;
  ADMIN_PW: string;

  SUBFIX: string;
  SUBFIX_TODAY: string;
  SUBFIX_CALENDAR: string;
  SUBFIX_GOOGLE: string;
  SUBFIX_ADMOB: string;
  SUBFIX_ADMIN: string;
  SUBFIX_EXERCISE: string;
  SUBFIX_FOOD: string;
  SUBFIX_MONEY: string;
  SUBFIX_SLEEP: string;

  URL_OBJECT: string;
  URL_TODAY: string;
  URL_CALENDAR: string;
  URL_GOOGLE: string;
  URL_ADMOB: string;
  URL_ADMIN: string;
  URL_EXERCISE: string;
  URL_FOOD: string;
  URL_MONEY: string;
  URL_SLEEP: string;

  isAdmin: string | boolean | "";
  sessionId: string;

  localSetting: LocalSettingType | {};
  localTimeZone: string;
  localZoneName: string;
  localLang: string;
  localIsoCode: string;
  localCurrency: string;
  localUnit: string;

  sessionPercent: SessionSyncPercent | {};
  sessionCategory: SessionSyncCategory | {};
  sessionScale: SessionSyncScale;
  sessionFavorite: SessionSyncFavorite | {};
  sessionProperty: SessionSyncProperty;
  sessionNutrition: SessionSyncNutrition;

  exerciseArray: ExerciseCategoryItem[];
  foodArray: FoodCategoryItem[];
  moneyArray: MoneyCategoryItem[];
  sleepArray: SleepCategoryItem[];

  sessionTitle: SessionTitleType;
  localTitle: LocalTitleType;
  sessionSetting: NonNullable<SessionTitleType["setting"]> | {};
  sessionFoodSection: Array<{
    food_record_part: string;
    food_record_name: string;
    food_record_brand: string;
    food_record_count: string;
    food_record_serv: string;
    food_record_gram: string;
    food_record_kcal: string;
    food_record_carb: string;
    food_record_protein: string;
    food_record_fat: string;
  }>;

  exerciseChartArray: string[];
  foodChartArray: string[];
  moneyChartArray: string[];
  sleepChartArray: string[];
  barChartArray: string[];
  todayColors: string[];
  bgColors: string[];
  chartColors: string[];
}
