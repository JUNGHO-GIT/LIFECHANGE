// MoneyChartLine.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { MoneyLine } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { handleY } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Select, PopUp } from "@imports/ImportContainers";
import { Div, Img, Br } from "@imports/ImportComponents";
import { Paper, Card, MenuItem, Grid } from "@imports/ImportMuis";
import { FormGroup, FormControlLabel, Switch } from "@imports/ImportMuis";
import { Line, LineChart } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// -------------------------------------------------------------------------------------------------
export const MoneyChartLine = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, chartColors, moneyChartArray } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(true);
  const [SECTION, setSECTION] = useState<string>("week");
  const [LINE, setLINE] = useState<any>(moneyChartArray);
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
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState<any>([MoneyLine]);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState<any>([MoneyLine]);

  // 2-3. useEffect --------------------------------------------------------------------------------
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
      setOBJECT_WEEK (
        resWeek.data.result.length > 0 ? resWeek.data.result : [MoneyLine]
      );
      setOBJECT_MONTH (
        resMonth.data.result.length > 0 ? resMonth.data.result : [MoneyLine]
      );
    }
    catch (err: any) {
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartWeek = () => {
    const {domain, ticks, formatterY} = handleY(OBJECT_WEEK, moneyChartArray, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart
          data={OBJECT_WEEK}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
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
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={formatterY}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:12}}
            width={30}
          />
          {LINE.includes("income") && (
            <Line
              dataKey={"income"}
              type={"monotone"}
              stroke={chartColors[0]}
              strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          {LINE.includes("expense") && (
            <Line
              dataKey={"expense"}
              type={"monotone"}
              stroke={chartColors[3]}
              strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          <Tooltip
            labelFormatter={(label: any, payload: any) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value: any, name: any, props: any) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()}`, customName];
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

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartMonth = () => {
    const {domain, ticks, formatterY} = handleY(OBJECT_MONTH, moneyChartArray, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart
          data={OBJECT_MONTH}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
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
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={formatterY}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:12}}
            width={30}
          />
          {LINE.includes("income") && (
            <Line
              dataKey={"income"}
              type={"monotone"}
              stroke={chartColors[0]}
              strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          {LINE.includes("expense") && (
            <Line
              dataKey={"expense"}
              type={"monotone"}
              stroke={chartColors[3]}
              strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          <Tooltip
            labelFormatter={(label: any, payload: any) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value: any, name: any, props: any) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()}`, customName];
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

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleFragment = () => (
        <Div className={"d-center"}>
          <Div className={"fs-1-0rem fw-600"}>
            {translate("chartLine")}
          </Div>
        </Div>
      );
      const selectFragment1 = () => (
        <Select
          value={SECTION}
          onChange={(e: any) => {
            setSECTION(e.target.value)
          }}
        >
          <MenuItem value={"week"}>{translate("week")}</MenuItem>
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
        </Select>
      );
      const selectFragment2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={
            ["income", "expense"]?.map((key, index) => (
              <FormGroup key={index}>
                <FormControlLabel
                  label={translate(key)}
                  labelPlacement={"start"}
                  control={
                    <Switch
                      checked={LINE.includes(key)}
                      onChange={() => {
                        if (LINE.includes(key)) {
                          if(LINE.length > 1) {
                            setLINE(LINE?.filter((item: any) => item !== key));
                          }
                          else {
                            return;
                          }
                        }
                        else {
                          setLINE([...LINE, key]);
                        }
                      }}
                    />
                  }
                />
              </FormGroup>
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
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={3} className={"d-row-left"}>
              {selectFragment1()}
            </Grid>
            <Grid size={6} className={"d-row-center"}>
              {titleFragment()}
            </Grid>
            <Grid size={3} className={"d-row-right"}>
              {selectFragment2()}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i: number) => (
        <Card className={"border-1 radius-1 p-20"} key={i}>
          {chartWeek()}
        </Card>
      );
      const chartFragment2 = (i: number) => (
        <Card className={"border-1 radius-1 p-20"} key={i}>
          {chartMonth()}
        </Card>
      );
      if (SECTION === "week") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "month") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min40vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
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