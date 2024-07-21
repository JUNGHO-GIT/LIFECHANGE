// FoodDashAvg.tsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportUtils";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_1} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodDashAvg = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const {translate} = useTranslate();
  const array = ["kcal", "carb", "protein", "fat"];

  // 2-2. useState ---------------------------------------------------------------------------------
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("kcal");
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_KCAL_MONTH_DEF = [
    {name:"", date:"", kcal: 0},
  ];
  const OBJECT_NUT_MONTH_DEF = [
    {name:"", date:"", carb: 0, protein: 0, fat: 0},
  ];
  const OBJECT_KCAL_YEAR_DEF = [
    {name:"", date:"", kcal: 0},
  ];
  const OBJECT_NUT_YEAR_DEF = [
    {name:"", date:"", carb: 0, protein: 0, fat: 0},
  ];
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEF);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEF);
  const [OBJECT_KCAL_YEAR, setOBJECT_KCAL_YEAR] = useState(OBJECT_KCAL_YEAR_DEF);
  const [OBJECT_NUT_YEAR, setOBJECT_NUT_YEAR] = useState(OBJECT_NUT_YEAR_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const resMonth = await axios.get(`${URL_OBJECT}/dash/avg/month`, {
      params: {
        user_id: sessionId
      },
    });
    const resYear = await axios.get(`${URL_OBJECT}/dash/avg/year`, {
      params: {
        user_id: sessionId
      },
    });
    setOBJECT_KCAL_MONTH(
      resMonth.data.result.kcal.length > 0 ? resMonth.data.result.kcal : OBJECT_KCAL_MONTH_DEF
    );
    setOBJECT_NUT_MONTH(
      resMonth.data.result.nut.length > 0 ? resMonth.data.result.nut : OBJECT_NUT_MONTH_DEF
    );
    setOBJECT_KCAL_YEAR(
      resYear.data.result.kcal.length > 0 ? resYear.data.result.kcal : OBJECT_KCAL_YEAR_DEF
    );
    setOBJECT_NUT_YEAR(
      resYear.data.result.nut.length > 0 ? resYear.data.result.nut : OBJECT_NUT_YEAR_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartKcalMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_KCAL_MONTH, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_KCAL_MONTH} margin={{top: 20, right: 20, bottom: 20, left: 20}}
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
          <Bar dataKey={"kcal"} fill={COLORS[3]} radius={[10, 10, 0, 0]} minPointSize={1} />
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartNutMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_NUT_MONTH, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_NUT_MONTH} margin={{top: 20, right: 20, bottom: 20, left: 20}}
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
          <Bar dataKey={"carb"} fill={COLORS[1]} radius={[10, 10, 0, 0]} minPointSize={1} />
          <Bar dataKey={"protein"} fill={COLORS[4]} radius={[10, 10, 0, 0]} minPointSize={1} />
          <Bar dataKey={"fat"} fill={COLORS[2]} radius={[10, 10, 0, 0]} minPointSize={1} />
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartKcalYear = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_KCAL_YEAR, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_KCAL_YEAR} margin={{top: 20, right: 20, bottom: 20, left: 20}}
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
          <Bar dataKey={"kcal"} fill={COLORS[3]} radius={[10, 10, 0, 0]} minPointSize={1} />
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-4. chart ------------------------------------------------------------------------------------
  const chartNutYear = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_NUT_YEAR, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_NUT_YEAR} margin={{top: 20, right: 20, bottom: 20, left: 20}}
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
          <Bar dataKey={"carb"} fill={COLORS[1]} radius={[10, 10, 0, 0]} minPointSize={1} />
          <Bar dataKey={"protein"} fill={COLORS[4]} radius={[10, 10, 0, 0]} minPointSize={1} />
          <Bar dataKey={"fat"} fill={COLORS[2]} radius={[10, 10, 0, 0]} minPointSize={1} />
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash ---------------------------------------------------------------------------------------
  const dashNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleSection = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("dashAvg")}
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
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
          <MenuItem value={"year"}>{translate("year")}</MenuItem>
        </TextField>
        </Div>
      );
      const selectSection2 = () => (
        <PopUp
          type={"dash"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
          ["kcal", "nut"]?.map((key, index) => (
            <FormGroup key={index}>
              <FormControlLabel
                control={<Switch checked={LINE === key}
                onChange={() => {
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
        <Div className={"d-center mt-n10"}>
          <Div className={"ms-0"}>{selectSection1()}</Div>
          <Div className={"ms-auto"}>{titleSection()}</Div>
          <Div className={"ms-auto me-0"}>{selectSection2()}</Div>
        </Div>
      );
    };
    // 7-2. dash
    const dashSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const dashFragment1 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartKcalMonth()}
        </Card>
      );
      const dashFragment3 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartKcalYear()}
        </Card>
      );
      const dashFragment2 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartNutMonth()}
        </Card>
      );
      const dashFragment4 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartNutYear()}
        </Card>
      );
      if (SECTION === "month" && LINE === "kcal") {
        return LOADING ? loadingFragment() : dashFragment1(0);
      }
      else if (SECTION === "year" && LINE === "kcal") {
        return LOADING ? loadingFragment() : dashFragment3(0);
      }
      else if (SECTION === "month" && LINE === "nut") {
        return LOADING ? loadingFragment() : dashFragment2(0);
      }
      else if (SECTION === "year" && LINE === "nut") {
        return LOADING ? loadingFragment() : dashFragment4(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pb-50"}>
        <Div className={"block-wrapper h-min40vh"}>
          {headSection()}
          <Br20/>
          {dashSection()}
        </Div>
      </Paper>
    );
  };

  // 8. loading ------------------------------------------------------------------------------------
  const loadingFragment = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dashNode()}
    </>
  );
};
