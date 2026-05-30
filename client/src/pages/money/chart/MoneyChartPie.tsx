/**
 * @file MoneyChartPie.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useStorageLocal as usStrgLcl } from "@exportHooks";
import {
	axios,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer as RspnCntn,
	Tooltip,
} from "@exportLibs";
import { memo, useEffect, useState } from "@exportReacts";
import { MoneyPie, type MoneyPieType } from "@exportSchemas";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
declare interface MoneyChartPieProps {
	TYPE?: any;
	setTYPE?: any;
}
declare interface PieProps {
	cx?: number;
	cy?: number;
	midAngle?: number;
	innerRadius?: number;
	outerRadius?: number;
	value?: number;
	index?: number;
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const MnyChrtP = memo((props: MoneyChartPieProps) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, PATH, chartColors, sessionId } = usCmmnVal();
	const { getDayFmt, getWeekStartFmt: gtWkStrtFmt, getWeekEndFmt: gtWkEndFmt } = usCmmnDt();
	const { getMonthStartFmt: gtMnStFm, getMonthEndFmt: gtMnthEndFmt, getYearStartFmt: gtYrStrtFmt, getYearEndFmt: gtYrEndFmt } =
		usCmmnDt();
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();

	// 2-1. useStorageLocal ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const [TYPE, setTYPE] = usStrgLcl(`type`, `pie`, PATH, {
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
	const [OBJC_INCM_WK, stObjcIncmWk] = useState<[MoneyPieType]>([
		MoneyPie,
	]);
	const [OBJC_EXPN_WK, stObjcExpnWk] = useState<
		[MoneyPieType]
	>([MoneyPie]);
	const [OBJ_INC_MNT, stObInMn] = useState<
		[MoneyPieType]
	>([MoneyPie]);
	const [OBJ_EXP_MNT, stObExMn] = useState<
		[MoneyPieType]
	>([MoneyPie]);
	const [OBJC_INCM_YR, stObjcIncmYr] = useState<[MoneyPieType]>([
		MoneyPie,
	]);
	const [OBJC_EXPN_YR, stObjcExpnYr] = useState<
		[MoneyPieType]
	>([MoneyPie]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		(async () => {
			setLOADING(true);
			try {
				const params = {
					user_id: sessionId,
					DATE: DATE,
				};
				const [resWeek, resMonth, resYear] = await Promise.all([
					axios.get(`${URL_OBJECT}/chart/pie/week`, {
						params: params,
					}),
					axios.get(`${URL_OBJECT}/chart/pie/month`, {
						params: params,
					}),
					axios.get(`${URL_OBJECT}/chart/pie/year`, {
						params: params,
					}),
				]);

				// 서버에서 기본값을 포함한 응답을 받으므로 직접 설정
				stObjcIncmWk(
					resWeek.data.result.income &&
						Array.isArray(resWeek.data.result.income)
						? resWeek.data.result.income
						: [MoneyPie],
				);
				stObjcExpnWk(
					resWeek.data.result.expense &&
						Array.isArray(resWeek.data.result.expense)
						? resWeek.data.result.expense
						: [MoneyPie],
				);
				stObInMn(
					resMonth.data.result.income &&
						Array.isArray(resMonth.data.result.income)
						? resMonth.data.result.income
						: [MoneyPie],
				);
				stObExMn(
					resMonth.data.result.expense &&
						Array.isArray(resMonth.data.result.expense)
						? resMonth.data.result.expense
						: [MoneyPie],
				);
				stObjcIncmYr(
					resYear.data.result.income &&
						Array.isArray(resYear.data.result.income)
						? resYear.data.result.income
						: [MoneyPie],
				);
				stObjcExpnYr(
					resYear.data.result.expense &&
						Array.isArray(resYear.data.result.expense)
						? resYear.data.result.expense
						: [MoneyPie],
				);
			} catch (error: any) {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error.response.data.msg),
					severity: `error`,
				});
				console.error(error);
				// 에러 발생 시에도 기본값 설정
				stObjcIncmWk([MoneyPie]);
				stObjcExpnWk([MoneyPie]);
				stObInMn([MoneyPie]);
				stObExMn([MoneyPie]);
				stObjcIncmYr([MoneyPie]);
				stObjcExpnYr([MoneyPie]);
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

	// 4-1. render ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const renderPie = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		value,
		index,
	}: PieProps) => {
		let object: any = null;

		TYPE_STATE.section === `week` && TYPE_STATE.line === `income`
			? (() => {
					object = OBJC_INCM_WK;
				})()
			: TYPE_STATE.section === `week` && TYPE_STATE.line === `expense`
				? (() => {
						object = OBJC_EXPN_WK;
					})()
				: TYPE_STATE.section === `month` && TYPE_STATE.line === `income`
					? (() => {
							object = OBJ_INC_MNT;
						})()
					: TYPE_STATE.section === `month` && TYPE_STATE.line === `expense`
						? (() => {
								object = OBJ_EXP_MNT;
							})()
						: TYPE_STATE.section === `year` && TYPE_STATE.line === `income`
							? (() => {
									object = OBJC_INCM_YR;
								})()
							: TYPE_STATE.section === `year` &&
								TYPE_STATE.line === `expense` &&
								(() => {
									object = OBJC_EXPN_YR;
								})();

		if (
			cx === undefined ||
			cy === undefined ||
			midAngle === undefined ||
			innerRadius === undefined ||
			outerRadius === undefined ||
			value === undefined ||
			index === undefined
		) {
			return null;
		}

		const RADIAN: number = Math.PI / 180;
		const radius: number = innerRadius + (outerRadius - innerRadius) / 2;
		const x: number = cx + radius * Math.cos(-midAngle * RADIAN);
		const y: number = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill={`white`}
				textAnchor={`middle`}
				dominantBaseline={`central`}
				className={`fs-0-6rem`}
			>
				<tspan x={x} dy={`-0.5em`} dx={`0.4em`}>
					{object?.[index]?.name
						? translate(object?.[index].name as string)
						: ``}
				</tspan>
				<tspan x={x} dy={`1.4em`} dx={`0.4em`}>
					{Number(value).toLocaleString()}
				</tspan>
			</text>
		);
	};

	// 5-1. chart ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const chartNode = () => {
		let object: any[] = [MoneyPie];
		const endStr: string = ``;
		let dateRange: string = ``;

		TYPE_STATE.section === `week` && TYPE_STATE.line === `income`
			? (() => {
					object = OBJC_INCM_WK;
					dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`;
				})()
			: TYPE_STATE.section === `week` && TYPE_STATE.line === `expense`
				? (() => {
						object = OBJC_EXPN_WK;
						dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`;
					})()
				: TYPE_STATE.section === `month` && TYPE_STATE.line === `income`
					? (() => {
							object = OBJ_INC_MNT;
							dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`;
						})()
					: TYPE_STATE.section === `month` && TYPE_STATE.line === `expense`
						? (() => {
								object = OBJ_EXP_MNT;
								dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`;
							})()
						: TYPE_STATE.section === `year` && TYPE_STATE.line === `income`
							? (() => {
									object = OBJC_INCM_YR;
									dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`;
								})()
							: TYPE_STATE.section === `year` &&
								TYPE_STATE.line === `expense` &&
								(() => {
									object = OBJC_EXPN_YR;
									dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`;
								})();

		// 안전장치: object가 비어있거나 null인 경우 기본값 설정
		if (!object || !Array.isArray(object) || object.length === 0) {
			object = [MoneyPie];
		}

		return (
			<RspnCntn width={`100%`} height={500}>
				<PieChart margin={{ top: 60, right: 20, bottom: 10, left: 20 }}>
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
					<Pie
						data={object}
						cx={`50%`}
						cy={`45%`}
						label={renderPie as any}
						labelLine={false}
						outerRadius={110}
						fill={`#8884d8`}
						dataKey={`value`}
						isAnimationActive={true}
						animationBegin={0}
						animationDuration={400}
						animationEasing={`linear`}
					>
						{object?.map((_entry: any, index: number) => (
							<Cell
								key={`cell-${index}`}
								fill={chartColors[index % chartColors?.length]}
							/>
						))}
					</Pie>
					<Tooltip
						formatter={(value: any, name: any) => {
							const customName: string = translate(name as string);
							return [
								`${Number(value).toLocaleString()} ${endStr}`,
								customName,
							];
						}}
						contentStyle={{
							backgroundColor: `rgba(255, 255, 255, 0.8)`,
							border: `none`,
							borderRadius: `10px`,
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
				</PieChart>
			</RspnCntn>
		);
	};

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return <>{chartNode()}</>;
});
