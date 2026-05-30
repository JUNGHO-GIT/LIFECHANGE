/**
 * @file MoneyChartLine.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useStorageLocal as usStrgLcl } from "@exportHooks";
import {
	axios,
	CartesianGrid as CrtsGrd,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer as RspnCntn,
	Tooltip,
	XAxis,
	YAxis,
} from "@exportLibs";
import { memo, useEffect, useState } from "@exportReacts";
import { MoneyLine, type MoneyLineType as MnyLnTyp } from "@exportSchemas";
import { formatDate, formatY } from "@exportScripts";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
declare interface MoneyChartLineProps {
	TYPE?: any;
	setTYPE?: any;
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const MnyChrtLn = memo((props: MoneyChartLineProps) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, PATH, sessionId, chartColors, moneyChartArray: mnyChrtArry } =
		usCmmnVal();
	const { getDayFmt, getWeekStartFmt: gtWkStrtFmt, getWeekEndFmt: gtWkEndFmt } = usCmmnDt();
	const { getMonthStartFmt: gtMnStFm, getMonthEndFmt: gtMnthEndFmt, getYearStartFmt: gtYrStrtFmt, getYearEndFmt: gtYrEndFmt } =
		usCmmnDt();
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();

	// 2-1. useStorageLocal ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const [TYPE, setTYPE] = usStrgLcl(`type`, `line`, PATH, {
		section: `week`,
		line: `income`,
	});

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [TYPE_STATE, stTypSt] = useState(() => {
		return props?.TYPE !== undefined ? props.TYPE : TYPE;
	});
	const [DATE, _setDATE] = useState({
		dateType: ``,
		dateStart: getDayFmt(),
		dateEnd: getDayFmt(),
		weekStartFmt: gtWkStrtFmt(),
		weekEndFmt: gtWkEndFmt(),
		monthStartFmt: gtMnStFm(),
		monthEndFmt: gtMnthEndFmt(),
		yearStartFmt: gtYrStrtFmt(),
		yearEndFmt: gtYrEndFmt(),
	});

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [OBJECT_WEEK, stObjcWk] = useState<[MnyLnTyp]>([MoneyLine]);
	const [OBJECT_MONTH, stObjcMnth] = useState<[MnyLnTyp]>([
		MoneyLine,
	]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		(async () => {
			setLOADING(true);
			try {
				const params = {
					user_id: sessionId,
					DATE: DATE,
				};
				const [resWeek, resMonth] = await Promise.all([
					axios.get(`${URL_OBJECT}/chart/line/week`, {
						params: params,
					}),
					axios.get(`${URL_OBJECT}/chart/line/month`, {
						params: params,
					}),
				]);
				stObjcWk(
					resWeek.data.result?.length > 0 ? resWeek.data.result : [MoneyLine],
				);
				stObjcMnth(
					resMonth.data.result?.length > 0 ? resMonth.data.result : [MoneyLine],
				);
			} catch (error: any) {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
				console.error(error);
			} finally {
				setLOADING(false);
			}
		})();
	}, [URL_OBJECT, DATE, sessionId]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		if (props?.TYPE !== undefined) {
			const isSame: boolean =
				JSON.stringify(props.TYPE) === JSON.stringify(TYPE_STATE);
			if (!isSame) {
				stTypSt(props.TYPE);
			}
		}
	}, [props?.TYPE]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		if (props?.setTYPE) {
			const isSame: boolean =
				JSON.stringify(props.TYPE) === JSON.stringify(TYPE_STATE);
			if (!isSame) {
				props.setTYPE(TYPE_STATE);
			}
		} else {
			setTYPE(TYPE_STATE);
		}
	}, [TYPE_STATE]);

	// 5-1. chart ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const chartNode = () => {
		let object: any = null;
		let endStr: string = ``;
		let dateRange: string = ``;

		TYPE_STATE.section === `week`
			? (() => {
					object = OBJECT_WEEK;
					endStr = ``;
					dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`;
				})()
			: TYPE_STATE.section === `month` &&
				(() => {
					object = OBJECT_MONTH;
					endStr = ``;
					dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`;
				})();

		const { domain, ticks, formatterY } = formatY(
			object,
			mnyChrtArry,
			`money`,
		);
		return (
			<RspnCntn width={`100%`} height={500}>
				<LineChart
					data={object as any[]}
					margin={{ top: 60, right: 20, bottom: 10, left: 20 }}
					barGap={20}
					barCategoryGap={`20%`}
				>
					<defs>
						<filter id={`textBackground`} x={0} y={0} width={1} height={1}>
							<feFlood floodColor={`#f9f9f9`} />
							<feComposite in={`SourceGraphic`} />
						</filter>
					</defs>
					<rect
						x={`50%`}
						y={15}
						width={120}
						height={20}
						rx={4}
						transform={`translate(-60, 0)`}
						fill={`transparent`}
					/>
					<text
						x={`50%`}
						y={25}
						textAnchor={`middle`}
						dominantBaseline={`middle`}
						style={{
							fontSize: `1.0rem`,
							fill: `#666`,
							fontWeight: 600,
						}}
					>
						{dateRange}
					</text>
					<CrtsGrd strokeDasharray={`3 3`} stroke={`#f5f5f5`} />
					<XAxis
						type={`category`}
						dataKey={`name`}
						tickLine={false}
						axisLine={false}
						tick={{ fill: `#666`, fontSize: 14 }}
					/>
					<YAxis
						width={30}
						type={`number`}
						domain={domain}
						tickLine={false}
						axisLine={false}
						ticks={ticks}
						tick={{ fill: `#666`, fontSize: 14 }}
						tickFormatter={formatterY}
					/>
					{TYPE_STATE.line.includes(`income`) && (
						<Line
							dataKey={`income`}
							type={`monotone`}
							stroke={chartColors[0]}
							strokeWidth={2}
							activeDot={{ r: 4 }}
							dot={false}
							isAnimationActive={true}
							animationBegin={0}
							animationDuration={400}
							animationEasing={`linear`}
						/>
					)}
					{TYPE_STATE.line.includes(`expense`) && (
						<Line
							dataKey={`expense`}
							type={`monotone`}
							stroke={chartColors[3]}
							strokeWidth={2}
							activeDot={{ r: 4 }}
							dot={false}
							isAnimationActive={true}
							animationBegin={0}
							animationDuration={400}
							animationEasing={`linear`}
						/>
					)}
					<Tooltip
						labelFormatter={(_label: any, payload: any) => {
							const name: string =
								payload?.length > 0 ? payload[0]?.payload.name : ``;
							const date: string =
								payload?.length > 0 ? payload[0]?.payload.date : ``;
							return `${translate(name)} (${formatDate(date)})`;
						}}
						formatter={(value: any, name: any) => {
							const customName: string = translate(name as string);
							return [
								`${Number(value).toLocaleString()} ${endStr}`,
								customName,
							];
						}}
						cursor={{
							fill: `rgba(0, 0, 0, 0.1)`,
						}}
						contentStyle={{
							borderRadius: `10px`,
							boxShadow: `0 2px 4px 0 rgba(0, 0, 0, 0.1)`,
							padding: `10px`,
							border: `none`,
							background: `#fff`,
							color: `#666`,
						}}
					/>
					<Legend
						iconType={`circle`}
						verticalAlign={`bottom`}
						align={`center`}
						formatter={(value) => {
							return translate(value as string);
						}}
						wrapperStyle={{
							width: `95%`,
							display: `flex`,
							justifyContent: `center`,
							alignItems: `center`,
							fontSize: `0.8rem`,
						}}
					/>
				</LineChart>
			</RspnCntn>
		);
	};

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return <>{chartNode()}</>;
});
