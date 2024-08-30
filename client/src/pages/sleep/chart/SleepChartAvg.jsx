// SleepChartAvg.tsx

import { useState, useEffect } from "../../../imports/ImportReacts.jsx";
import { useCommon } from "../../../imports/ImportHooks.jsx";
import { axios } from "../../../imports/ImportLibs.jsx";
import { handlerY } from "../../../imports/ImportUtils.jsx";
import { Loading } from "../../../imports/ImportLayouts.jsx";
import { Div, Img, Select } from "../../../imports/ImportComponents.jsx";
import { PopUp } from "../../../imports/ImportContainers.jsx";
import { Paper, Card, Grid, MenuItem } from "../../../imports/ImportMuis.jsx";
import { FormGroup, FormControlLabel, Switch } from "../../../imports/ImportMuis.jsx";
import { ComposedChart, Bar } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { common3_1 } from "../../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepChartAvg = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, sleepChartArray, COLORS, translate, koreanDate } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [PART, setPART] = useState(sleepChartArray);
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: koreanDate,
    dateEnd: koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_MONTH_DEF = [{
    name:"",
    date: "",
    bedTime: "0",
    wakeTime: "0",
    sleepTime: "0",
  }];
  const OBJECT_YEAR_DEF = [{
    name:"",
    date: "",
    bedTime: "0",
    wakeTime: "0",
    sleepTime: "0"
  }];
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);
  const [OBJECT_YEAR, setOBJECT_YEAR] = useState(OBJECT_YEAR_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const params = {
      user_id: sessionId,
      DATE: DATE,
    };
    const [resWeek, resMonth] = await Promise.all([
      axios.get(`${URL_OBJECT}/chart/avg/week`, {
        params: params,
      }),
      axios.get(`${URL_OBJECT}/chart/avg/month`, {
        params: params,
      }),
    ]);
    setOBJECT_MONTH(
      resWeek.data.result.length > 0 ? resWeek.data.result : OBJECT_MONTH_DEF
    );
    setOBJECT_YEAR(
      resMonth.data.result.length > 0 ? resMonth.data.result : OBJECT_YEAR_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartWeek = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_MONTH, sleepChartArray, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart
          data={OBJECT_MONTH}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
          barGap={8}
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
          {PART.includes("bedTime") && (
            <Bar
            dataKey={"bedTime"} fill={COLORS[4]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          {PART.includes("wakeTime") && (
            <Bar
            dataKey={"wakeTime"} fill={COLORS[1]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          {PART.includes("sleepTime") && (
            <Bar
            dataKey={"sleepTime"} fill={COLORS[2]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_YEAR, sleepChartArray, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart
          data={OBJECT_YEAR}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
          barGap={8}
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
          {PART.includes("bedTime") && (
            <Bar
            dataKey={"bedTime"} fill={COLORS[4]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          {PART.includes("wakeTime") && (
            <Bar
            dataKey={"wakeTime"} fill={COLORS[1]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          {PART.includes("sleepTime") && (
            <Bar
            dataKey={"sleepTime"} fill={COLORS[2]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
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
              fontSize: "0.8rem"
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleFragment = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("chartAvg")}
        </Div>
      );
      const selectFragment1 = () => (
        <Select
          value={SECTION}
          onChange={(e) => (
            setSECTION(e.target.value)
          )}
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
          contents={({closePopup}) => (
            ["bedTime", "wakeTime", "sleepTime"]?.map((key, index) => (
              <FormGroup key={index}>
                <FormControlLabel
                  label={translate(key)}
                  labelPlacement={"start"}
                  control={
                    <Switch
                      checked={PART.includes(key)}
                      onChange={() => {
                        if (PART.includes(key)) {
                          if (PART.length > 1) {
                            setPART(PART?.filter((item) => (item !== key)));
                          }
                          else {
                            return;
                          }
                        }
                        else {
                          setPART([...PART, key]);
                        }
                      }}
                    />
                  }
                />
              </FormGroup>
            ))
          )}
        >
          {(popTrigger) => (
            <Img
              src={common3_1}
              className={"w-24 h-24 pointer"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          )}
        </PopUp>
      );
      return (
        <Card className={"p-0"}>
          <Grid container columnSpacing={1} rowSpacing={2}>
            <Grid size={3} className={"d-left"}>
              {selectFragment1()}
            </Grid>
            <Grid size={6} className={"d-center"}>
              {titleFragment()}
            </Grid>
            <Grid size={3} className={"d-right"}>
              {selectFragment2()}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartWeek()}
        </Card>
      );
      const chartFragment2 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartMonth()}
        </Card>
      );
      if (SECTION === "week") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "month") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min40vh"}>
        <Grid container columnSpacing={1} rowSpacing={2}>
          <Grid size={12}>
            {headSection()}
          </Grid>
          <Grid size={12}>
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