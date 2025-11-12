// ExerciseChartPie.tsx

import { useState, useEffect, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@exportStores";
import { ExercisePie, ExercisePieType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "@exportLibs";

// -------------------------------------------------------------------------------------------------
declare interface ExerciseChartPieProps {
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
export const ExerciseChartPie = memo((props: ExerciseChartPieProps) => {

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
      line: "part",
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
  const [OBJECT_PART_WEEK, setOBJECT_PART_WEEK] = useState<[ExercisePieType]>([ExercisePie]);
  const [OBJECT_TITLE_WEEK, setOBJECT_TITLE_WEEK] = useState<[ExercisePieType]>([ExercisePie]);
  const [OBJECT_PART_MONTH, setOBJECT_PART_MONTH] = useState<[ExercisePieType]>([ExercisePie]);
  const [OBJECT_TITLE_MONTH, setOBJECT_TITLE_MONTH] = useState<[ExercisePieType]>([ExercisePie]);
  const [OBJECT_PART_YEAR, setOBJECT_PART_YEAR] = useState<[ExercisePieType]>([ExercisePie]);
  const [OBJECT_TITLE_YEAR, setOBJECT_TITLE_YEAR] = useState<[ExercisePieType]>([ExercisePie]);

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

      // 서버에서 기본값을 포함한 응답을 받으므로 직접 설정
      setOBJECT_PART_WEEK(
        resWeek.data.result.part && Array.isArray(resWeek.data.result.part)
          ? resWeek.data.result.part
          : [ExercisePie]
      );
      setOBJECT_TITLE_WEEK(
        resWeek.data.result.title && Array.isArray(resWeek.data.result.title)
          ? resWeek.data.result.title
          : [ExercisePie]
      );
      setOBJECT_PART_MONTH(
        resMonth.data.result.part && Array.isArray(resMonth.data.result.part)
          ? resMonth.data.result.part
          : [ExercisePie]
      );
      setOBJECT_TITLE_MONTH(
        resMonth.data.result.title && Array.isArray(resMonth.data.result.title)
          ? resMonth.data.result.title
          : [ExercisePie]
      );
      setOBJECT_PART_YEAR(
        resYear.data.result.part && Array.isArray(resYear.data.result.part)
          ? resYear.data.result.part
          : [ExercisePie]
      );
      setOBJECT_TITLE_YEAR(
        resYear.data.result.title && Array.isArray(resYear.data.result.title)
          ? resYear.data.result.title
          : [ExercisePie]
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
      // 에러 발생 시에도 기본값 설정
      setOBJECT_PART_WEEK([ExercisePie]);
      setOBJECT_TITLE_WEEK([ExercisePie]);
      setOBJECT_PART_MONTH([ExercisePie]);
      setOBJECT_TITLE_MONTH([ExercisePie]);
      setOBJECT_PART_YEAR([ExercisePie]);
      setOBJECT_TITLE_YEAR([ExercisePie]);
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
    let object: any[] = [ExercisePie];
    let endStr = "%";

		if (TYPE_STATE.section === "week" && TYPE_STATE.line === "part") {
      object = OBJECT_PART_WEEK || [ExercisePie];
    }
		else if (TYPE_STATE.section === "week" && TYPE_STATE.line === "title") {
      object = OBJECT_TITLE_WEEK || [ExercisePie];
    }
		else if (TYPE_STATE.section === "month" && TYPE_STATE.line === "part") {
      object = OBJECT_PART_MONTH || [ExercisePie];
    }
		else if (TYPE_STATE.section === "month" && TYPE_STATE.line === "title") {
      object = OBJECT_TITLE_MONTH || [ExercisePie];
    }
		else if (TYPE_STATE.section === "year" && TYPE_STATE.line === "part") {
      object = OBJECT_PART_YEAR || [ExercisePie];
    }
		else if (TYPE_STATE.section === "year" && TYPE_STATE.line === "title") {
      object = OBJECT_TITLE_YEAR || [ExercisePie];
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

    let object: any[] = [ExercisePie];
    let endStr = "%";
    let dateRange = "";

		if (TYPE_STATE.section === "week" && TYPE_STATE.line === "part") {
			object = OBJECT_PART_WEEK || [ExercisePie];
			dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`;
		}
		else if (TYPE_STATE.section === "week" && TYPE_STATE.line === "title") {
			object = OBJECT_TITLE_WEEK || [ExercisePie];
			dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`;
		}
		else if (TYPE_STATE.section === "month" && TYPE_STATE.line === "part") {
			object = OBJECT_PART_MONTH || [ExercisePie];
			dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`;
		}
		else if (TYPE_STATE.section === "month" && TYPE_STATE.line === "title") {
			object = OBJECT_TITLE_MONTH || [ExercisePie];
			dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`;
		}
		else if (TYPE_STATE.section === "year" && TYPE_STATE.line === "part") {
			object = OBJECT_PART_YEAR || [ExercisePie];
			dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`;
		}
		else if (TYPE_STATE.section === "year" && TYPE_STATE.line === "title") {
			object = OBJECT_TITLE_YEAR || [ExercisePie];
			dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`;
		}
		else {
			if (TYPE_STATE.section === "week") {
				dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`;
			}
			else if (TYPE_STATE.section === "month") {
				dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`;
			}
			else if (TYPE_STATE.section === "year") {
				dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`;
			}
		}
		if (!object || !Array.isArray(object) || object.length === 0) {
			object = [ExercisePie];
		}

    return (
			<ResponsiveContainer width={"100%"} height={500}>
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
							fontSize: "1.0rem",
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