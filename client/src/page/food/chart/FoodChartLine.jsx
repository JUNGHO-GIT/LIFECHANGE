// FoodChartLine.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportUtils";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField, Grid} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_1} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodChartLine = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const {translate} = useTranslate();
  const array = ["kcal", "carb", "protein", "fat"];

  // 2-2. useState ---------------------------------------------------------------------------------
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("week");
  const [LINE, setLINE] = useState("kcal");
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_KCAL_WEEK_DEF = [
    {name:"", date:"", kcal: ""},
  ];
  const OBJECT_NUT_WEEK_DEF = [
    {name:"", date:"", carb: "", protein: "", fat: ""},
  ];
  const OBJECT_KCAL_MONTH_DEF = [
    {name:"", date:"", kcal: ""},
  ];
  const OBJECT_NUT_MONTH_DEF = [
    {name:"", date:"", carb: "", protein: "", fat: ""},
  ];
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState(OBJECT_KCAL_WEEK_DEF);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState(OBJECT_NUT_WEEK_DEF);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEF);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const resWeek = await axios.get(`${URL_OBJECT}/chart/line/week`, {
      params: {
        user_id: sessionId
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/chart/line/month`, {
      params: {
        user_id: sessionId
      },
    });
    setOBJECT_KCAL_WEEK(
      resWeek.data.result.kcal.length > 0 ? resWeek.data.result.kcal : OBJECT_KCAL_WEEK_DEF
    );
    setOBJECT_NUT_WEEK(
      resWeek.data.result.nut.length > 0 ? resWeek.data.result.nut : OBJECT_NUT_WEEK_DEF
    );
    setOBJECT_KCAL_MONTH(
      resMonth.data.result.kcal.length > 0 ? resMonth.data.result.kcal : OBJECT_KCAL_MONTH_DEF
    );
    setOBJECT_NUT_MONTH(
      resMonth.data.result.nut.length > 0 ? resMonth.data.result.nut : OBJECT_NUT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartKcalWeek = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_KCAL_WEEK, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL_WEEK} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
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
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={formatterY}
          />
          <Line dataKey={"kcal"} type={"monotone"} stroke={COLORS[3]} strokeWidth={2}
          activeDot={{r: 6}}/>
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} kcal`, customName];
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

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartNutWeek = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_NUT_WEEK, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_NUT_WEEK} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
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
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={formatterY}
          />
          <Line dataKey={"carb"} type={"monotone"} stroke={COLORS[1]} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Line dataKey={"protein"} type={"monotone"} stroke={COLORS[4]} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Line dataKey={"fat"} type={"monotone"} stroke={COLORS[2]} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} g`, customName];
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
  const chartKcalMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_KCAL_MONTH, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL_MONTH} margin={{top: 20, right: 20, bottom: 20, left: 20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
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
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={formatterY}
          />
          <Line dataKey={"kcal"} type={"monotone"} stroke={COLORS[3]} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} kcal`, customName];
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

  // 5-4. chart ------------------------------------------------------------------------------------
  const chartNutMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_NUT_MONTH, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_NUT_MONTH} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
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
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={formatterY}
          />
          <Line dataKey={"carb"} type={"monotone"} stroke={COLORS[1]} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Line dataKey={"protein"} type={"monotone"} stroke={COLORS[4]} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Line dataKey={"fat"} type={"monotone"} stroke={COLORS[2]} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} g`, customName];
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
          ["kcal", "nut"]?.map((key, index) => (
            <FormGroup key={index}>
              <FormControlLabel control={<Switch checked={LINE === key} onChange={() => {
                  if (LINE === key) {
                    return;
                  }
                  else {
                    setLINE(key);
                  }
              }}/>} label={translate(key)} labelPlacement={"start"}>
              </FormControlLabel>
            </FormGroup>
          )))}>
          {(popTrigger={}) => (
            <Img src={common3_1} className={"w-24 h-24 pointer"} onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}/>
          )}
        </PopUp>
      );
      return (
        <Grid container>
          <Grid item xs={3} className={"d-left"}>
            {selectSection1()}
          </Grid>
          <Grid item xs={6} className={"d-center"}>
            {titleSection()}
          </Grid>
          <Grid item xs={3} className={"d-right"}>
            {selectSection2()}
          </Grid>
        </Grid>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartKcalWeek()}
        </Card>
      );
      const chartFragment2 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartKcalMonth()}
        </Card>
      );
      const chartFragment3 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartNutWeek()}
        </Card>
      );
      const chartFragment4 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartNutMonth()}
        </Card>
      );
      if (SECTION === "week" && LINE === "kcal") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "month" && LINE === "kcal") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
      else if (SECTION === "week" && LINE === "nut") {
        return LOADING ? <Loading /> : chartFragment3(0);
      }
      else if (SECTION === "month" && LINE === "nut") {
        return LOADING ? <Loading /> : chartFragment4(0);
      }
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min40vh"}>
          {headSection()}
          <Br20 />
          {chartSection()}
        </Div>
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
