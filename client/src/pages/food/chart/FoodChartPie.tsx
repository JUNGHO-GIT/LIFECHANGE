// FoodChartPie.tsx

import { useState, useEffect, memo } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@importStores";
import { FoodPie, FoodPieType } from "@importSchemas";
import { axios } from "@importLibs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "@importLibs";

// -------------------------------------------------------------------------------------------------
declare interface FoodChartPieProps {
	TYPE?: any;
	setTYPE?: any;
}
declare type PieProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  value?: number;
  index?: number;
};

// -------------------------------------------------------------------------------------------------
export const FoodChartPie = memo((props: FoodChartPieProps) => {

	// 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, chartColors, sessionId } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

	// 2-1. useStorageLocal -----------------------------------------------------------------------
	const [TYPE, setTYPE] = useStorageLocal(
		"type", "pie", PATH, {
			section: "week",
			line: "kcal",
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
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState<[FoodPieType]>([FoodPie]);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState<[FoodPieType]>([FoodPie]);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState<[FoodPieType]>([FoodPie]);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState<[FoodPieType]>([FoodPie]);
  const [OBJECT_KCAL_YEAR, setOBJECT_KCAL_YEAR] = useState<[FoodPieType]>([FoodPie]);
  const [OBJECT_NUT_YEAR, setOBJECT_NUT_YEAR] = useState<[FoodPieType]>([FoodPie]);

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {(async () => {
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
      setOBJECT_KCAL_WEEK(
        resWeek.data.result.kcal?.length > 0 ? resWeek.data.result.kcal : [FoodPie]
      );
      setOBJECT_NUT_WEEK(
        resWeek.data.result.nut?.length > 0 ? resWeek.data.result.nut : [FoodPie]
      );
      setOBJECT_KCAL_MONTH(
        resMonth.data.result.kcal?.length > 0 ? resMonth.data.result.kcal : [FoodPie]
      );
      setOBJECT_NUT_MONTH(
        resMonth.data.result.nut?.length > 0 ? resMonth.data.result.nut : [FoodPie]
      );
      setOBJECT_KCAL_YEAR(
        resYear.data.result.kcal?.length > 0 ? resYear.data.result.kcal : [FoodPie]
      );
      setOBJECT_NUT_YEAR(
        resYear.data.result.nut?.length > 0 ? resYear.data.result.nut : [FoodPie]
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

  // 4-1. render -----------------------------------------------------------------------------------
  const renderPie = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {

    let object = null;
    let endStr = "";
		if (TYPE_STATE.section === "week" && TYPE_STATE.line === "kcal") {
			object = OBJECT_KCAL_WEEK;
			endStr = "kcal";
		}
		else if (TYPE_STATE.section === "week" && TYPE_STATE.line === "nut") {
			object = OBJECT_NUT_WEEK;
			endStr = "g";
		}
		else if (TYPE_STATE.section === "month" && TYPE_STATE.line === "kcal") {
			object = OBJECT_KCAL_MONTH;
			endStr = "kcal";
		}
		else if (TYPE_STATE.section === "month" && TYPE_STATE.line === "nut") {
			object = OBJECT_NUT_MONTH;
			endStr = "g";
		}
		else if (TYPE_STATE.section === "year" && TYPE_STATE.line === "kcal") {
			object = OBJECT_KCAL_YEAR;
			endStr = "kcal";
		}
		else if (TYPE_STATE.section === "year" && TYPE_STATE.line === "nut") {
			object = OBJECT_NUT_YEAR;
			endStr = "g";
		}

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

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={"white"}
        textAnchor={"middle"}
        dominantBaseline={"central"}
        className={"fs-0-6rem"}
      >
        <tspan x={x} dy={"-0.5em"} dx={"0.4em"}>
          {object && object[index]?.name ? translate(object[index].name) : ""}
        </tspan>
        <tspan x={x} dy={"1.4em"} dx={"0.4em"}>
          {`${Number(value).toLocaleString()} ${endStr}`}
        </tspan>
      </text>
    );
  };

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartNode = () => {

    let object = null;
    let endStr = "";
    let dateRange = "";

		(TYPE_STATE.section === "week" && TYPE_STATE.line === "kcal") && (
			object = OBJECT_KCAL_WEEK,
			endStr = "kcal",
			dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`
		);

		(TYPE_STATE.section === "week" && TYPE_STATE.line === "nut") && (
			object = OBJECT_NUT_WEEK,
			endStr = "g",
			dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`
		);

		(TYPE_STATE.section === "month" && TYPE_STATE.line === "kcal") && (
			object = OBJECT_KCAL_MONTH,
			endStr = "kcal",
			dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`
		);

		(TYPE_STATE.section === "month" && TYPE_STATE.line === "nut") && (
			object = OBJECT_NUT_MONTH,
			endStr = "g",
			dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`
		);

		(TYPE_STATE.section === "year" && TYPE_STATE.line === "kcal") && (
			object = OBJECT_KCAL_YEAR,
			endStr = "kcal",
			dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`
		);

		(TYPE_STATE.section === "year" && TYPE_STATE.line === "nut") && (
			object = OBJECT_NUT_YEAR,
			endStr = "g",
			dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`
		);

    return (
			<ResponsiveContainer width={"100%"} height={350}>
				<PieChart margin={{top: 60, right: 20, bottom: 10, left: 20}}>
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
							fontSize: "0.80rem",
							fill: "#666",
							fontWeight: 600,
						}}
					>
						{dateRange}
					</text>
					<Pie
						data={object as any[]}
						cx={"50%"}
						cy={"45%"}
						label={renderPie as any}
						labelLine={false}
						outerRadius={110}
						fill={"#8884d8"}
						dataKey={"value"}
						isAnimationActive={true}
						animationBegin={0}
						animationDuration={400}
						animationEasing={"linear"}
					>
						{object?.map((_entry: any, index: number) => (
							<Cell key={`cell-${index}`} fill={chartColors[index % chartColors?.length]} />
						))}
					</Pie>
					<Tooltip
						formatter={(value: any, name: any) => {
							const customName = translate(name);
							return [`${Number(value).toLocaleString()} ${endStr}`, customName];
						}}
						contentStyle={{
							backgroundColor:"rgba(255, 255, 255, 0.8)",
							border:"none",
							borderRadius:"10px"
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
				</PieChart>
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