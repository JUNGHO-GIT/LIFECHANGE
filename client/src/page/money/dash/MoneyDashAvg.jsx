// MoneyDashAvg.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img} from "../../../import/ImportComponents.jsx";
import {Paper, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const array = ["수입", "지출"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("in");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_IN_MONTH_DEF = [
    {name:"", day: "", 수입: 0},
  ];
  const OBJECT_OUT_MONTH_DEF = [
    {name:"", day: "", 지출: 0},
  ];
  const OBJECT_IN_YEAR_DEF = [
    {name:"", day: "", 수입: 0},
  ];
  const OBJECT_OUT_YEAR_DEF = [
    {name:"", day: "", 지출: 0},
  ];
  const [OBJECT_IN_MONTH, setOBJECT_IN_MONTH] = useState(OBJECT_IN_MONTH_DEF);
  const [OBJECT_OUT_MONTH, setOBJECT_OUT_MONTH] = useState(OBJECT_OUT_MONTH_DEF);
  const [OBJECT_IN_YEAR, setOBJECT_IN_YEAR] = useState(OBJECT_IN_YEAR_DEF);
  const [OBJECT_OUT_YEAR, setOBJECT_OUT_YEAR] = useState(OBJECT_OUT_YEAR_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
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
    setOBJECT_IN_MONTH(
      resMonth.data.result.in.length > 0 ? resMonth.data.result.in : OBJECT_IN_MONTH_DEF
    );
    setOBJECT_OUT_MONTH(
      resMonth.data.result.out.length > 0 ? resMonth.data.result.out : OBJECT_OUT_MONTH_DEF
    );
    setOBJECT_IN_YEAR(
      resYear.data.result.in.length > 0 ? resYear.data.result.in : OBJECT_IN_YEAR_DEF
    );
    setOBJECT_OUT_YEAR(
      resYear.data.result.out.length > 0 ? resYear.data.result.out : OBJECT_OUT_YEAR_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartInMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_IN_MONTH, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_IN_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <Bar dataKey={"수입"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
          </Bar>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartOutMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_OUT_MONTH, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_OUT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <Bar dataKey={"지출"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
          </Bar>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartInYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_IN_YEAR, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_IN_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <Bar dataKey={"수입"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
          </Bar>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartOutYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_OUT_YEAR, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_OUT_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <Bar dataKey={"지출"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={10} />
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"fs-1-5rem"}>수입/지출 평균</Div>
    );
    // 7-5. dropdown
    const dropdownSection1 = () => (
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"w-20vw"}
        variant={"outlined"}
        value={SECTION}
        onChange={(e) => (
          setSECTION(e.target.value)
        )}
      >
        <MenuItem value={"month"}>월간</MenuItem>
        <MenuItem value={"year"}>연간</MenuItem>
      </TextField>
    );
    // 7-5. dropdown
    const dropdownSection2 = () => (
      <PopUp
        type={"dash"}
        position={"bottom"}
        direction={"left"}
        contents={({closePopup}) => (
          ["in", "out"]?.map((key, index) => (
            <FormGroup key={index}>
              <FormControlLabel control={<Switch checked={LINE.includes(key)} onChange={() => {
                if (LINE === key) {
                  setLINE("");
                }
                else {
                  setLINE(key);
                }
              }}/>} label={key} labelPlacement={"start"}>
              </FormControlLabel>
            </FormGroup>
          ))
        )}>
        {(popTrigger={}) => (
          <Img src={common3} className={"w-24 h-24 pointer"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-7. fragment
    const dashFragment1 = (i) => (
      chartInMonth()
    );
    // 7-7. fragment
    const dashFragment2 = (i) => (
      chartOutMonth()
    );
    // 7-7. fragment
    const dashFragment3 = (i) => (
      chartInYear()
    );
    // 7-7. fragment
    const dashFragment4 = (i) => (
      chartOutYear()
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "month" && LINE === "in") {
        return dashFragment1();
      }
      else if (SECTION === "month" && LINE === "out") {
        return dashFragment2();
      }
      else if (SECTION === "year" && LINE === "in") {
        return dashFragment3();
      }
      else if (SECTION === "year" && LINE === "out") {
        return dashFragment4();
      }
      else {
        return dashFragment1();
      }
    };
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center"}>
        <Div className={"ms-auto ms-10"}>{dropdownSection1()}</Div>
        <Div className={"ms-auto"}>{titleSection()}</Div>
        <Div className={"ms-auto me-10"}>{dropdownSection2()}</Div>
      </Div>
    );
    // 7-11. third
    const thirdSection = () => (
      dashSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {firstSection()}
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