// FoodDashBar.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Paper} from "../../../import/ImportMuis.jsx";
import {MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {Bar, Line, ComposedChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDashBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const array = ["목표", "실제"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");
  const [LINE, setLINE] = useState("kcal");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_TODAY_DEF = [
    {name:"", 목표: 0, 실제: 0},
  ];
  const OBJECT_NUT_TODAY_DEF = [
    {name:"", 목표: 0, 실제: 0},
  ];
  const [OBJECT_KCAL_TODAY, setOBJECT_KCAL_TODAY] = useState(OBJECT_KCAL_TODAY_DEF);
  const [OBJECT_NUT_TODAY, setOBJECT_NUT_TODAY] = useState(OBJECT_NUT_TODAY_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resToday = await axios.get(`${URL_OBJECT}/dash/bar/today`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_KCAL_TODAY(
      resToday.data.result.kcal.length > 0 ? resToday.data.result.kcal : OBJECT_KCAL_TODAY_DEF
    );
    setOBJECT_NUT_TODAY(
      resToday.data.result.nut.length > 0 ? resToday.data.result.nut : OBJECT_NUT_TODAY_DEF
    );
    setLOADING(false);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartKcalToday = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_TODAY, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_KCAL_TODAY} margin={{top: 60, right: 20, bottom: 20, left: -20}} barGap={80} barCategoryGap={"20%"}>
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
          <Bar dataKey={"목표"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}
            barSize={20}>
          </Bar>
          <Bar dataKey={"실제"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
            barSize={20}>
          </Bar>
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNutToday = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_TODAY, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_NUT_TODAY} margin={{top: 60, right: 20, bottom: 20, left: -20}}
        barGap={20} barCategoryGap={"20%"}>
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
          <Line dataKey={"목표"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Bar dataKey={"실제"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
            barSize={20}/>
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5-1. dropdown
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
        <MenuItem value={"today"}>오늘</MenuItem>
      </TextField>
    );
    // 7-5-2. dropdown
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
          ))
        )}>
        {(popTrigger={}) => (
          <img src={common3} className={"w-24 h-24 pointer"} alt={"common3"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6. dash
    const dashSection = () => (
      <Div className={"block-wrapper h-min40vh h-max-60vh p-0"}>
        <Div className={"d-center"}>
          <Div className={"d-center ms-10"}>{dropdownSection1()}</Div>
          <Div className={"d-center m-auto fs-1-0rem"}>칼로리/영양소 목표</Div>
          <Div className={"d-center ms-auto me-10"}>{dropdownSection2()}</Div>
        </Div>
        <Div className={"d-column"}>
          {SECTION === "today" && LINE === "kcal" && (
            LOADING ? loadingNode() : chartKcalToday()
          )}
          {SECTION === "today" && LINE === "nut" && (
            LOADING ? loadingNode() : chartNutToday()
          )}
        </Div>
      </Div>
    );
    // 7-7 return
    return (
      <Paper className={"content-wrapper border-bottom"}>
        {dashSection()}
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
