// ExerciseChartLine.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@importStores";
import { ExerciseLineVolume, ExerciseLineCardio, ExerciseLineScale, ExerciseLineType } from "@importSchemas";
import { axios } from "@importLibs";
import { handleY } from "@importScripts";
import { Select, PopUp } from "@importContainers";
import { Div, Img, Br, Paper, Grid } from "@importComponents";
import { FormGroup, FormControlLabel, Switch, MenuItem } from "@importMuis";
import { Line, LineChart } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// -------------------------------------------------------------------------------------------------
export const ExerciseChartLine = () => {

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

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartLine = () => {

    let object = null;
    let endStr = "";
    if (TYPE.section === "week" && TYPE.line === "scale") {
      object = OBJECT_SCALE_WEEK;
      endStr = localUnit;
    }
    else if (TYPE.section === "week" && TYPE.line === "volume") {
      object = OBJECT_VOLUME_WEEK;
      endStr = "vol";
    }
    else if (TYPE.section === "week" && TYPE.line === "cardio") {
      object = OBJECT_CARDIO_WEEK;
      endStr = "hr";
    }
    else if (TYPE.section === "month" && TYPE.line === "scale") {
      object = OBJECT_SCALE_MONTH;
      endStr = localUnit;
    }
    else if (TYPE.section === "month" && TYPE.line === "volume") {
      object = OBJECT_VOLUME_MONTH;
      endStr = "vol";
    }
    else if (TYPE.section === "month" && TYPE.line === "cardio") {
      object = OBJECT_CARDIO_MONTH;
      endStr = "hr";
    }

    const {domain, ticks, formatterY} = handleY(object, exerciseChartArray, "exercise");
		return (
			<ResponsiveContainer width={"100%"} height={350}>
				<LineChart
					data={object as any[]}
					margin={{top: 30, right: 30, bottom: 20, left: 20}}
					barGap={20}
					barCategoryGap={"20%"}
				>
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
						tickFormatter={(value) => (
							translate(value)
						)}
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
					{TYPE.line === ("scale") && (
						<>
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
						</>
					)}
					{TYPE.line === ("volume") && (
						<>
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
						</>
					)}
					{TYPE.line === ("cardio") && (
						<>
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
						</>
					)}
					<Tooltip
						labelFormatter={(_label: any, payload: any) => {
							const date = payload?.length > 0 ? payload[0]?.payload.date : '';
							return `${date}`;
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
							justifyContent :"center",
							alignItems:"center",
							fontSize: "0.8rem",
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
    );
  };

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => (
			<Grid container={true} spacing={2} className={"p-10px d-row-between"}>
				<Grid size={3} className={"d-row-left"}>
					<Select
						value={TYPE.section}
						onChange={(e: any) => {
							setTYPE((prev) => ({
								...prev,
								section: e.target.value,
							}));
						}}
					>
						<MenuItem value={"week"}>{translate("week")}</MenuItem>
						<MenuItem value={"month"}>{translate("month")}</MenuItem>
					</Select>
				</Grid>
				<Grid size={6} className={"d-row-center"}>
					<Div className={"fs-0-75rem fw-600"}>
						{translate("chartLine")}
					</Div>
					<Div className={"fs-0-75rem fw-500 grey ml-10px"}>
						{`[${translate(TYPE.line)}]`}
					</Div>
				</Grid>
				<Grid size={3} className={"d-row-right"}>
					<PopUp
						type={"chart"}
						position={"bottom"}
						direction={"center"}
						contents={
							["volume", "cardio", "scale"].map((key, index) => (
								<FormGroup key={index} children={
									<FormControlLabel label={translate(key)} labelPlacement={"start"} control={
										<Switch checked={TYPE.line === key} onChange={() => {
											if (TYPE.line === key) {
												return;
											}
											else {
												setTYPE((prev) => ({
													...prev,
													line: key,
												}));
											}
										}}/>
									}/>
								}/>
							))
						}
						children={(popTrigger: any) => (
							<Img
								max={24}
								hover={true}
								shadow={false}
								radius={false}
								src={"common3_1.webp"}
								onClick={(e: any) => {
									popTrigger.openPopup(e.currentTarget)
								}}
							/>
						)}
					/>
				</Grid>
			</Grid>
		);
    // 7-2. chart
    const chartSection = () => (
      <Grid container={true} spacing={2} className={"border-1 radius-2"}>
        <Grid size={12} className={"d-col-center p-10px"}>
					{chartLine()}
				</Grid>
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-40vh"}>
        {headSection()}
        <Br m={10} />
        {chartSection()}
      </Paper>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
};