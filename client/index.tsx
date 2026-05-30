/**
 * @file index.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import "react-calendar/dist/Calendar.css";
import "@assets/styles/Core.css";
import "@assets/styles/Calendar.css";
import "@assets/styles/Chart.css";
import "@assets/styles/Mui.css";
import "@assets/styles/Components.css";

import {
	useCommonValue as usCmmnVal,
	useFoodSection as usFdSec,
	useLanguageInitialize as usLangIntl,
	useLanguageSetting as usLangSttn,
	useRoot,
	useScrollTop,
} from "@exportHooks";
import {
	Alert,
	BottomNav,
	Confirm,
	Header,
	Loader,
	TopNav,
} from "@exportLayouts";
import { CssBaseline, createTheme, ThemeProvider as ThmProv } from "@exportMuis";
import {
	AdminAppInfo,
	AdminDashboard as AdmnDshb,
	AuthError,
	AuthGoogle,
	AuthPrivacy,
	CalendarDetail as ClndDtl,
	CalendarList,
	ExerciseChart as ExerChrt,
	ExerciseGoalDetail as ExerGlDtl,
	ExerciseGoalList as ExerGlLst,
	ExerciseRecordDetail as ExerRecDtl,
	ExerciseRecordList as ExerRecLst,
	FoodChart,
	FoodFavoriteList as FdFavLst,
	FoodFindList,
	FoodGoalDetail as FdGlDtl,
	FoodGoalList,
	FoodRecordDetail as FdRecDtl,
	FoodRecordList as FdRecLst,
	MoneyChart,
	MoneyGoalDetail as MnyGlDtl,
	MoneyGoalList as MnyGlLst,
	MoneyRecordDetail as MnyRecDtl,
	MoneyRecordList as MnyRecLst,
	SleepChart,
	SleepGoalDetail as SlpGlDtl,
	SleepGoalList as SlpGlLst,
	SleepRecordDetail as SlpRecDtl,
	SleepRecordList as SlpRecLst,
	UserAppSetting as UsrAppSttn,
	UserCategory,
	UserDelete,
	UserDetail,
	UserLogin,
	UserResetPw,
	UserSignup,
} from "@exportPages";
import {
	BrowserRouter as BrwsRtr,
	createRoot,
	memo,
	Route,
	Routes,
	useEffect,
} from "@exportReacts";
import { useStoreLoading as usStrLoad } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
const App = memo(() => {
	const { PATH } = usCmmnVal();
	const { setLOADING } = usStrLoad();

	useEffect(() => {
		setLOADING(true);
		setTimeout(() => {
			setLOADING(false);
		}, 500);
	}, []);

	useRoot();
	useScrollTop();
	usFdSec();
	usLangIntl();
	usLangSttn();

	const noneHeader: boolean =
		!PATH.includes(`/user/login`) &&
		!PATH.includes(`/user/signup`) &&
		!PATH.includes(`/user/resetPw`) &&
		!PATH.includes(`/auth/error`) &&
		!PATH.includes(`/auth/privacy`);
	const noneTop: boolean =
		!PATH.includes(`/user`) &&
		!PATH.includes(`/auth/error`) &&
		!PATH.includes(`/auth/privacy`);
	const noneBottom: boolean =
		!PATH.includes(`/user`) &&
		!PATH.includes(`/auth/error`) &&
		!PATH.includes(`/auth/privacy`);

	return (
		<div className={`App`}>
			{noneHeader ? <Header /> : null}
			{noneTop ? <TopNav /> : null}
			<Loader />
			<Alert />
			<Confirm />
			<Routes>
				{/** home * */}
				<Route path={`/`} element={<div />} />
				{/** admin * */}
				<Route path={`/admin/dashboard/*`} element={<AdmnDshb />} />
				{/** auth * */}
				<Route path={`/auth/error/*`} element={<AuthError />} />
				<Route path={`/auth/google/*`} element={<AuthGoogle />} />
				<Route path={`/auth/privacy/*`} element={<AuthPrivacy />} />
				{/** calendar * */}
				<Route path={`/calendar/list/*`} element={<CalendarList />} />
				<Route path={`/calendar/detail/*`} element={<ClndDtl />} />
				{/** exercise * */}
				<Route path={`/exercise/chart/list/*`} element={<ExerChrt />} />
				<Route path={`/exercise/goal/list/*`} element={<ExerGlLst />} />
				<Route
					path={`/exercise/goal/detail/*`}
					element={<ExerGlDtl />}
				/>
				<Route
					path={`/exercise/record/list/*`}
					element={<ExerRecLst />}
				/>
				<Route
					path={`/exercise/record/detail/*`}
					element={<ExerRecDtl />}
				/>
				{/** food * */}
				<Route path={`/food/chart/list/*`} element={<FoodChart />} />
				<Route path={`/food/goal/list/*`} element={<FoodGoalList />} />
				<Route path={`/food/goal/detail/*`} element={<FdGlDtl />} />
				<Route path={`/food/record/list/*`} element={<FdRecLst />} />
				<Route path={`/food/record/detail/*`} element={<FdRecDtl />} />
				<Route path={`/food/favorite/list/*`} element={<FdFavLst />} />
				<Route path={`/food/find/list/*`} element={<FoodFindList />} />
				{/** money * */}
				<Route path={`/money/chart/list/*`} element={<MoneyChart />} />
				<Route path={`/money/goal/list/*`} element={<MnyGlLst />} />
				<Route path={`/money/goal/detail/*`} element={<MnyGlDtl />} />
				<Route path={`/money/record/list/*`} element={<MnyRecLst />} />
				<Route
					path={`/money/record/detail/*`}
					element={<MnyRecDtl />}
				/>
				{/** sleep * */}
				<Route path={`/sleep/chart/list/*`} element={<SleepChart />} />
				<Route path={`/sleep/goal/list/*`} element={<SlpGlLst />} />
				<Route path={`/sleep/goal/detail/*`} element={<SlpGlDtl />} />
				<Route path={`/sleep/record/list/*`} element={<SlpRecLst />} />
				<Route
					path={`/sleep/record/detail/*`}
					element={<SlpRecDtl />}
				/>
				{/** user * */}
				<Route path={`/user/appInfo/*`} element={<AdminAppInfo />} />
				<Route path={`/user/appSetting/*`} element={<UsrAppSttn />} />
				<Route path={`/user/signup/*`} element={<UserSignup />} />
				<Route path={`/user/login/*`} element={<UserLogin />} />
				<Route path={`/user/resetPw/*`} element={<UserResetPw />} />
				<Route path={`/user/detail/*`} element={<UserDetail />} />
				<Route path={`/user/delete/*`} element={<UserDelete />} />
				<Route path={`/user/category/*`} element={<UserCategory />} />
			</Routes>
			{noneBottom ? <BottomNav /> : null}
		</div>
	);
});

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
const fontFamily: string = `'Pretendard Variable', Pretendard, FontAwesome, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif`;

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
createRoot(document.querySelector(`#root`) as HTMLElement).render(
	<BrwsRtr basename={`/lifechange`}>
		<ThmProv
			theme={createTheme({ typography: { fontFamily: fontFamily } })}
		>
			<CssBaseline />
			<App />
		</ThmProv>
	</BrwsRtr>,
);
