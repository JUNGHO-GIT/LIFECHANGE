// FoodDashLine.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const array = ["칼로리", "탄수화물", "단백질", "지방"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("kcal");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_WEEK_DEF = [
    {name:"", date:"", 칼로리: 0},
  ];
  const OBJECT_NUT_WEEK_DEF = [
    {name:"", date:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const OBJECT_KCAL_MONTH_DEF = [
    {name:"", date:"", 칼로리: 0},
  ];
  const OBJECT_NUT_MONTH_DEF = [
    {name:"", date:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState(OBJECT_KCAL_WEEK_DEF);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState(OBJECT_NUT_WEEK_DEF);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEF);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resWeek = await axios.get(`${URL_OBJECT}/dash/line/week`, {
      params: {
        user_id: sessionId
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/line/month`, {
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

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartKcalWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_WEEK, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <Line dataKey={"칼로리"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
          activeDot={{r: 6}}/>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
            cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
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
             wrapperStyle={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              left: "none",
              fontSize: "0.8rem",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNutWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_WEEK, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_NUT_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <Line dataKey={"탄수화물"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Line dataKey={"단백질"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Line dataKey={"지방"} type={"monotone"} stroke={"#ffc658"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}g`)}
            cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
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
             wrapperStyle={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              left: "none",
              fontSize: "0.8rem",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartKcalMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_MONTH, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <Line dataKey={"칼로리"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
            cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
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
             wrapperStyle={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              left: "none",
              fontSize: "0.8rem",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartNutMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_MONTH, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_NUT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <Line dataKey={"탄수화물"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Line dataKey={"단백질"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Line dataKey={"지방"} type={"monotone"} stroke={"#ffc658"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}g`)}
            cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
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
             wrapperStyle={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              left: "none",
              fontSize: "0.8rem",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"d-center"}>칼로리/영양소 추이</Div>
    );
    // 7-5. dropdown
    const dropdownSection1 = () => (
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
          <MenuItem value={"week"}>주간</MenuItem>
          <MenuItem value={"month"}>월간</MenuItem>
        </TextField>
      </Div>
    );
    // 7-5. dropdown
    const dropdownSection2 = () => (
      <PopUp
        type={"dash"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
        ["kcal", "nut"]?.map((key, index) => (
          <FormGroup key={index}>
            <FormControlLabel control={<Switch checked={LINE === key} onChange={() => {
              if (LINE === key) {
                setLINE("");
              }
              else {
                setLINE(key);
              }
            }}/>} label={key} labelPlacement={"start"}>
            </FormControlLabel>
          </FormGroup>
        )))}>
        {(popTrigger={}) => (
          <Img src={common3} className={"w-24 h-24 pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    );
    // 7-7. fragment
    const dashFragment1 = (i) => (
      <Card variant={"outlined"} className={"p-10"}>
        {chartKcalWeek()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment2 = (i) => (
      <Card variant={"outlined"} className={"p-10"}>
        {chartKcalMonth()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment3 = (i) => (
      <Card variant={"outlined"} className={"p-10"}>
        {chartNutWeek()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment4 = (i) => (
      <Card variant={"outlined"} className={"p-10"}>
        {chartNutMonth()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "week" && LINE === "kcal") {
        return LOADING ? loadingNode() : dashFragment1();
      }
      else if (SECTION === "month" && LINE === "kcal") {
        return LOADING ? loadingNode() : dashFragment2();
      }
      else if (SECTION === "week" && LINE === "nut") {
        return LOADING ? loadingNode() : dashFragment3();
      }
      else if (SECTION === "month" && LINE === "nut") {
        return LOADING ? loadingNode() : dashFragment4();
      }
    }
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center mt-n10"}>
        <Div className={"ms-0"}>{dropdownSection1()}</Div>
        <Div className={"ms-auto me-auto"}>{titleSection()}</Div>
        <Div className={"ms-auto"}>{dropdownSection2()}</Div>
      </Div>
    );
    // 7-11. third
    const thirdSection = () => (
      dashSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min40vh"}>
          {firstSection()}
          <Br20/>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {dashNode()}
    </>
  );
};
