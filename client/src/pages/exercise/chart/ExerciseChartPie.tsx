// ExerciseChartPie.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useStorageLocal, useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { ExercisePie } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Select, PopUp } from "@imports/ImportContainers";
import { Div, Img, Br } from "@imports/ImportComponents";
import { Paper, MenuItem, Grid } from "@imports/ImportMuis";
import { FormGroup, FormControlLabel, Switch } from "@imports/ImportMuis";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// -------------------------------------------------------------------------------------------------
declare type PieProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  index: number;
}

// -------------------------------------------------------------------------------------------------
export const ExerciseChartPie = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, chartColors, sessionId } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(

    "type", "pie", PATH, {
      section: "week",
      line: "part",
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(true);
  const [radius, setRadius] = useState<number>(120);
  const [DATE, setDATE] = useState<any>({
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT_PART_WEEK, setOBJECT_PART_WEEK] = useState<any>([ExercisePie]);
  const [OBJECT_TITLE_WEEK, setOBJECT_TITLE_WEEK] = useState<any>([ExercisePie]);
  const [OBJECT_PART_MONTH, setOBJECT_PART_MONTH] = useState<any>([ExercisePie]);
  const [OBJECT_TITLE_MONTH, setOBJECT_TITLE_MONTH] = useState<any>([ExercisePie]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    try {
      const params = {
        user_id: sessionId,
        DATE: DATE,
      };
      const [resWeek, resMonth] = await Promise.all([
        axios.get(`${URL_OBJECT}/chart/pie/week`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/chart/pie/month`, {
          params: params,
        }),
      ]);
      setOBJECT_PART_WEEK(
        resWeek.data.result.part.length > 0 ? resWeek.data.result.part : [ExercisePie]
      );
      setOBJECT_TITLE_WEEK(
        resWeek.data.result.title.length > 0 ? resWeek.data.result.title : [ExercisePie]
      );
      setOBJECT_PART_MONTH(
        resMonth.data.result.part.length > 0 ? resMonth.data.result.part : [ExercisePie]
      );
      setOBJECT_TITLE_MONTH(
        resMonth.data.result.title.length > 0 ? resMonth.data.result.title : [ExercisePie]
      );
    }
    catch (err: any) {
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const updateRadius = () => {
      // lg
      if (window.innerWidth >= 1200) {
        setRadius(120);
      }
      // md
      else if (window.innerWidth >= 992) {
        setRadius(110);
      }
      // sm
      else if (window.innerWidth >= 768) {
        setRadius(100);
      }
      // xs
      else {
        setRadius(90);
      }
    };

    window.addEventListener('resize', updateRadius);
    updateRadius();

    return () => {
      window.removeEventListener('resize', updateRadius);
    }
  }, []);

  // 4-1. render -----------------------------------------------------------------------------------
  const renderPartWeek = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
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
        {`${translate(OBJECT_PART_WEEK[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 4-2. render -----------------------------------------------------------------------------------
  const renderTitleWeek = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
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
        {`${translate(OBJECT_TITLE_WEEK[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  }

  // 4-3. render -----------------------------------------------------------------------------------
  const renderPartMonth = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
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
        {`${translate(OBJECT_PART_MONTH[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  }

  // 4-4. render -----------------------------------------------------------------------------------
  const renderTitleMonth = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
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
        {`${translate(OBJECT_TITLE_MONTH[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartPartWeek = () => (
    <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
      <Grid size={12} className={"d-col-center"}>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_PART_WEEK}
              cx={"50%"}
              cy={"50%"}
              label={renderPartWeek}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_PART_WEEK?.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const customName = translate(name);
                return [`${Number(value).toLocaleString()}%`, customName];
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
                lineHeight:"40px",
                paddingTop:"10px",
                fontSize:"12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartTitleWeek = () => (
    <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
      <Grid size={12} className={"d-col-center"}>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_TITLE_WEEK}
              cx={"50%"}
              cy={"50%"}
              label={renderTitleWeek}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_TITLE_WEEK?.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const customName = translate(name);
                return [`${Number(value).toLocaleString()}%`, customName];
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
                lineHeight:"40px",
                paddingTop:"10px",
                fontSize:"12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartPartMonth = () => (
    <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
      <Grid size={12} className={"d-col-center"}>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_PART_MONTH}
              cx={"50%"}
              cy={"50%"}
              label={renderPartMonth}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_PART_MONTH?.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const customName = translate(name);
                return [`${Number(value).toLocaleString()}%`, customName];
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
                lineHeight:"40px",
                paddingTop:"10px",
                fontSize:"12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );

  // 5-4. chart ------------------------------------------------------------------------------------
  const chartTitleMonth = () => (
    <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
      <Grid size={12} className={"d-col-center"}>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_TITLE_MONTH}
              cx={"50%"}
              cy={"50%"}
              label={renderTitleMonth}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_TITLE_MONTH?.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const customName = translate(name);
                return [`${Number(value).toLocaleString()}%`, customName];
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
                lineHeight:"40px",
                paddingTop:"10px",
                fontSize:"12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleFragment = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Div className={"fs-1-0rem fw-600"}>
              {translate("chartPie")}
            </Div>
            <Div className={"fs-1-0rem fw-500 grey ms-10"}>
              {`[${translate(`exercise${TYPE.line.charAt(0).toUpperCase() + TYPE.line.slice(1)}`)}]`}
            </Div>
          </Grid>
        </Grid>
      );
      const selectFragment1 = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Select
              value={TYPE.section}
              onChange={(e: any) => {
                setTYPE((prev: any) => ({
                  ...prev,
                  section: e.target.value,
                }));
              }}
            >
              <MenuItem value={"week"}>{translate("week")}</MenuItem>
              <MenuItem value={"month"}>{translate("month")}</MenuItem>
            </Select>
          </Grid>
        </Grid>
      );
      const selectFragment2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={
            ["part", "title"]?.map((key: string, index: number) => (
              <FormGroup
                key={index}
                children={
                  <FormControlLabel
                    label={translate(`exercise${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                    labelPlacement={"start"}
                    control={
                      <Switch
                        checked={TYPE.line === key}
                        onChange={() => {
                          if (TYPE.line === key) {
                            return;
                          }
                          else {
                            setTYPE((prev: any) => ({
                              ...prev,
                              line: key,
                            }));
                          }
                        }}
                      />
                    }
                  />
                }
              />
            ))
          }
        >
          {(popTrigger: any) => (
            <Img
              key={"common3_1"}
              src={"common3_1"}
              className={"w-24 h-24 pointer me-10"}
              onClick={(e: any) => {
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          )}
        </PopUp>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={3} className={"d-row-left"}>
            {selectFragment1()}
          </Grid>
          <Grid size={7} className={"d-row-center"}>
            {titleFragment()}
          </Grid>
          <Grid size={2} className={"d-row-right"}>
            {selectFragment2()}
          </Grid>
        </Grid>
      );
    };
    // 7-2. chart
    const chartSection = () => (
      <Grid container spacing={0} columns={12}>
        <Grid size={12} className={"d-row-center"}>
          {LOADING ? <Loading /> : (
            <>
              {TYPE.section === "week" && TYPE.line === "part" && chartPartWeek()}
              {TYPE.section === "week" && TYPE.line === "title" && chartTitleWeek()}
              {TYPE.section === "month" && TYPE.line === "part" && chartPartMonth()}
              {TYPE.section === "month" && TYPE.line === "title" && chartTitleMonth()}
            </>
          )}
        </Grid>
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min40vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {headSection()}
            <Br px={20} />
            {chartSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
};
