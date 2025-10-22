// ExerciseChartLine.tsx

import { useState, useEffect, memo } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@importStores";
import { ExerciseLineVolume, ExerciseLineCardio, ExerciseLineScale, ExerciseLineType } from "@importSchemas";
import { axios } from "@importLibs";
import { fnFormatY, fnFormatDate } from "@importScripts";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@importLibs";

// -------------------------------------------------------------------------------------------------
declare interface ExerciseChartLineProps {
	TYPE?: any;
	setTYPE?: any;
}

// -------------------------------------------------------------------------------------------------
export const ExerciseChartLine = memo((props: ExerciseChartLineProps) => {

	// 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, chartColors } = useCommonValue();
  const { localUnit, exerciseChartArray } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

	// 2-1. useStorageLocal -----------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(
    "type", "line", PATH, {
      section: "week",
      line: "volume"
    }
  );

	// 2-2. useState -------------------------------------------------------------------------------
	const [TYPE_STATE, setTYPE_STATE] = useState(() => {
		return props?.TYPE !== undefined ? props.TYPE : TYPE;
	});
  const [DATE, _setDATE] = useState({
    dateType: "",
    dateStart: getDayFmt(),
    dateEnd: getDayFmt(),
    weekStartFmt: getWeekStartFmt(),
    weekEndFmt: getWeekEndFmt(),
    monthStartFmt: getMonthStartFmt(),
    monthEndFmt: getMonthEndFmt(),
    yearStartFmt: getYearStartFmt(),
    yearEndFmt: getYearEndFmt(),
  });

	// 2-2. useState -------------------------------------------------------------------------------
  const [OBJECT_SCALE_WEEK, setOBJECT_SCALE_WEEK] = useState<[ExerciseLineType]>([ExerciseLineScale]);
  const [OBJECT_VOLUME_WEEK, setOBJECT_VOLUME_WEEK] = useState<[ExerciseLineType]>([ExerciseLineVolume]);
  const [OBJECT_CARDIO_WEEK, setOBJECT_CARDIO_WEEK] = useState<[ExerciseLineType]>([ExerciseLineCardio]);
  const [OBJECT_SCALE_MONTH, setOBJECT_SCALE_MONTH] = useState<[ExerciseLineType]>([ExerciseLineScale]);
  const [OBJECT_VOLUME_MONTH, setOBJECT_VOLUME_MONTH] = useState<[ExerciseLineType]>([ExerciseLineVolume]);
  const [OBJECT_CARDIO_MONTH, setOBJECT_CARDIO_MONTH] = useState<[ExerciseLineType]>([ExerciseLineCardio]);

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {(async () => {
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
      setOBJECT_SCALE_WEEK(
        resWeek.data.result.scale?.length > 0 ? resWeek.data.result.scale : [ExerciseLineScale]
      );
      setOBJECT_VOLUME_WEEK(
        resWeek.data.result.volume?.length > 0 ? resWeek.data.result.volume : [ExerciseLineVolume]
      );
      setOBJECT_CARDIO_WEEK(
        resWeek.data.result.cardio?.length > 0 ? resWeek.data.result.cardio : [ExerciseLineCardio]
      );
      setOBJECT_SCALE_MONTH(
        resMonth.data.result.scale?.length > 0 ? resMonth.data.result.scale : [ExerciseLineScale]
      );
      setOBJECT_VOLUME_MONTH(
        resMonth.data.result.volume?.length > 0 ? resMonth.data.result.volume : [ExerciseLineVolume]
      );
      setOBJECT_CARDIO_MONTH(
        resMonth.data.result.cardio?.length > 0 ? resMonth.data.result.cardio : [ExerciseLineCardio]
      );
    }
    catch (err: any) {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
		if (props?.TYPE !== undefined) {
			const isSame = JSON.stringify(props.TYPE) === JSON.stringify(TYPE_STATE);
			if (!isSame) {
				setTYPE_STATE(props.TYPE);
			}
		}
	}, [props?.TYPE]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
		if (props?.setTYPE) {
			const isSame = JSON.stringify(props.TYPE) === JSON.stringify(TYPE_STATE);
			if (!isSame) {
				props.setTYPE(TYPE_STATE);
			}
		}
		else {
			setTYPE(TYPE_STATE);
		}
	}, [TYPE_STATE]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartNode = () => {

    let object = null;
    let endStr = "";
    let dateRange = "";

		(TYPE_STATE.section === "week" && TYPE_STATE.line === "scale") && (
			object = OBJECT_SCALE_WEEK,
			endStr = localUnit,
			dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`
		);

		(TYPE_STATE.section === "week" && TYPE_STATE.line === "volume") && (
			object = OBJECT_VOLUME_WEEK,
			endStr = "vol",
			dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`
		);

		(TYPE_STATE.section === "week" && TYPE_STATE.line === "cardio") && (
			object = OBJECT_CARDIO_WEEK,
			endStr = "hr",
			dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`
		);

		(TYPE_STATE.section === "month" && TYPE_STATE.line === "scale") && (
			object = OBJECT_SCALE_MONTH,
			endStr = localUnit,
			dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`
		);

		(TYPE_STATE.section === "month" && TYPE_STATE.line === "volume") && (
			object = OBJECT_VOLUME_MONTH,
			endStr = "vol",
			dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`
		);

		(TYPE_STATE.section === "month" && TYPE_STATE.line === "cardio") && (
			object = OBJECT_CARDIO_MONTH,
			endStr = "hr",
			dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`
		);

    const { domain, ticks, formatterY } = fnFormatY(object, exerciseChartArray, "exercise");
		return (
			<ResponsiveContainer width={"100%"} height={500}>
				<LineChart
					data={object as any[]}
					margin={{top: 60, right: 20, bottom: 10, left: 20}}
					barGap={20}
					barCategoryGap={"20%"}
				>
					<defs>
						<filter id={"textBackground"} x={0} y={0} width={1} height={1}>
							<feFlood floodColor={"#f9f9f9"} />
							<feComposite in={"SourceGraphic"} />
						</filter>
					</defs>
					<rect
						x={"50%"}
						y={15}
						width={120}
						height={20}
						rx={4}
						transform={"translate(-60, 0)"}
						fill={"transparent"}
					/>
					<text
						x={"50%"}
						y={25}
						textAnchor={"middle"}
						dominantBaseline={"middle"}
						style={{
							fontSize: "1.0rem",
							fill: "#666",
							fontWeight: 600,
						}}
					>
						{dateRange}
					</text>
					<CartesianGrid
						strokeDasharray={"3 3"}
						stroke={"#f5f5f5"}
					/>
					<XAxis
						type={"category"}
						dataKey={"name"}
						tickLine={false}
						axisLine={false}
						tick={{fill:"#666", fontSize:14}}
					/>
					<YAxis
						width={30}
						type={"number"}
						domain={domain}
						tickLine={false}
						axisLine={false}
						ticks={ticks}
						tick={{fill: "#666", fontSize: 14}}
						tickFormatter={formatterY}
					/>
					{TYPE_STATE.line === ("scale") && (
						<Line
							dataKey={"scale"}
							type={"monotone"}
							stroke={chartColors[5]}
							strokeWidth={2}
							activeDot={{r:4}}
							dot={false}
							isAnimationActive={true}
							animationBegin={0}
							animationDuration={400}
							animationEasing={"linear"}
						/>
					)}
					{TYPE_STATE.line === ("volume") && (
						<Line
							dataKey={"volume"}
							type={"monotone"}
							stroke={chartColors[1]}
							strokeWidth={2}
							activeDot={{r:4}}
							dot={false}
							isAnimationActive={true}
							animationBegin={0}
							animationDuration={400}
							animationEasing={"linear"}
						/>
					)}
					{TYPE_STATE.line === ("cardio") && (
						<Line
							dataKey={"cardio"}
							type={"monotone"}
							stroke={chartColors[3]}
							strokeWidth={2}
							activeDot={{r:4}}
							dot={false}
							isAnimationActive={true}
							animationBegin={0}
							animationDuration={400}
							animationEasing={"linear"}
						/>
					)}
					<Tooltip
						labelFormatter={(_label: any, payload: any) => {
							const name = payload?.length > 0 ? payload[0]?.payload.name : '';
							const date = payload?.length > 0 ? payload[0]?.payload.date : '';
							return `${translate(name)} (${fnFormatDate(date)})`;
						}}
						formatter={(value: any, name: any) => {
							const customName = translate(name);
							return [`${Number(value).toLocaleString()} ${endStr}`, customName];
						}}
						cursor={{
							fill:"rgba(0, 0, 0, 0.1)"
						}}
						contentStyle={{
							borderRadius:"10px",
							boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
							padding:"10px",
							border:"none",
							background:"#fff",
							color:"#666"
						}}
					/>
					<Legend
						iconType={"circle"}
						verticalAlign={"bottom"}
						align={"center"}
						formatter={(value) => {
							return translate(value);
						}}
						wrapperStyle={{
							width:"95%",
							display:"flex",
							justifyContent:"center",
							alignItems:"center",
							fontSize: "0.8rem",
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
});