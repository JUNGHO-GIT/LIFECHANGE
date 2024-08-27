// MoneyChartLine.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect } from "../../../import/ImportReacts.jsx";
import { useCommon } from "../../../import/ImportHooks.jsx";
import { axios } from "../../../import/ImportLibs.jsx";
import { handlerY } from "../../../import/ImportUtils.jsx";
import { Loading } from "../../../import/ImportLayouts.jsx";
import { PopUp, Div, Img, Br20 } from "../../../import/ImportComponents.jsx";
import { Paper, Card, MenuItem, TextField, Grid } from "../../../import/ImportMuis.jsx";
import { FormGroup, FormControlLabel, Switch } from "../../../import/ImportMuis.jsx";
import { Line, LineChart } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { common3_1 } from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const MoneyChartLine = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_OBJECT, sessionId, moneyChartArray, COLORS, translate, koreanDate,
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("week");
  const [LINE, setLINE] = useState(moneyChartArray);
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: koreanDate,
    dateEnd: koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_WEEK_DEF = [{
    name:"",
    date: "",
    income: "0",
    expense: "0",
  }];
  const OBJECT_MONTH_DEF = [{
    name:"",
    date: "",
    income: "0",
    expense: "0",
  }];
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
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
      resWeek.data.result.length > 0 ? resWeek.data.result : OBJECT_WEEK_DEF
    );
    setOBJECT_MONTH (
      resMonth.data.result.length > 0 ? resMonth.data.result : OBJECT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartWeek = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_WEEK, moneyChartArray, "money");
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
              stroke={COLORS[0]}
              strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          {LINE.includes("expense") && (
            <Line
              dataKey={"expense"}
              type={"monotone"}
              stroke={COLORS[3]}
              strokeWidth={2}
              activeDot={{r:8}}
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_MONTH, moneyChartArray, "money");
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
              stroke={COLORS[0]}
              strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          {LINE.includes("expense") && (
            <Line
              dataKey={"expense"}
              type={"monotone"}
              stroke={COLORS[3]}
              strokeWidth={2}
              activeDot={{r:8}}
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleSection = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("chartLine")}
        </Div>
      );
      const selectSection1 = () => (
        <Div className={"d-center"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            variant={"outlined"}
            value={SECTION}
            onChange={(e) => (
              setSECTION(e.target.value)
            )}
          >
            <MenuItem value={"week"}>{translate("week")}</MenuItem>
            <MenuItem value={"month"}>{translate("month")}</MenuItem>
          </TextField>
        </Div>
      );
      const selectSection2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
          ["income", "expense"]?.map((key, index) => (
            <FormGroup key={index}>
              <FormControlLabel
                control={<Switch checked={LINE.includes(key)}
                onChange={() => {
                  if (LINE.includes(key)) {
                    if(LINE.length > 1) {
                      setLINE(LINE?.filter((item) => (item !== key)));
                    }
                    else {
                      return;
                    }
                  }
                  else {
                    setLINE([...LINE, key]);
                  }
                }}/>} label={translate(key)} labelPlacement={"start"}>
              </FormControlLabel>
            </FormGroup>
          ))
        )}>
          {(popTrigger={}) => (
            <Img src={common3_1} className={"w-24 h-24 pointer"} onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}/>
          )}
        </PopUp>
      );
      return (
        <Grid container className={"w-100p"}>
          <Grid size={3} className={"d-left"}>
            {selectSection1()}
          </Grid>
          <Grid size={6} className={"d-center"}>
            {titleSection()}
          </Grid>
          <Grid size={3} className={"d-right"}>
            {selectSection2()}
          </Grid>
        </Grid>
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
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min40vh"}>
        <Grid container className={"w-100p"}>
          <Grid size={12} className={"d-center"}>
            {headSection()}
            <Br20 />
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