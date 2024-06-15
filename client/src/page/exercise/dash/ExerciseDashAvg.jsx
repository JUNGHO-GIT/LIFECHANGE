// ExerciseDashAvg.tsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_1} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL + SUBFIX;
  const {translate} = useTranslate();
  const array = ["volume", "cardio"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("volume");
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_VOLUME_MONTH_DEF = [
    {name:"", date:"", volume: 0},
  ];
  const OBJECT_CARDIO_MONTH_DEF = [
    {name:"", date:"", 시간: 0},
  ];
  const OBJECT_VOLUME_YEAR_DEF = [
    {name:"", date:"", volume: 0},
  ];
  const OBJECT_CARDIO_YEAR_DEF = [
    {name:"", date:"", 시간: 0},
  ];
  const [OBJECT_VOLUME_MONTH, setOBJECT_VOLUME_MONTH] = useState(OBJECT_VOLUME_MONTH_DEF);
  const [OBJECT_CARDIO_MONTH, setOBJECT_CARDIO_MONTH] = useState(OBJECT_CARDIO_MONTH_DEF);
  const [OBJECT_VOLUME_YEAR, setOBJECT_VOLUME_YEAR] = useState(OBJECT_VOLUME_YEAR_DEF);
  const [OBJECT_CARDIO_YEAR, setOBJECT_CARDIO_YEAR] = useState(OBJECT_CARDIO_YEAR_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
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
    setOBJECT_VOLUME_MONTH(
      resMonth.data.result.volume.length > 0 ? resMonth.data.result.volume : OBJECT_VOLUME_MONTH_DEF
    );
    setOBJECT_CARDIO_MONTH(
      resMonth.data.result.cardio.length > 0 ? resMonth.data.result.cardio : OBJECT_CARDIO_MONTH_DEF
    );
    setOBJECT_VOLUME_YEAR(
      resYear.data.result.volume.length > 0 ? resYear.data.result.volume : OBJECT_VOLUME_YEAR_DEF
    );
    setOBJECT_CARDIO_YEAR(
      resYear.data.result.cardio.length > 0 ? resYear.data.result.cardio : OBJECT_CARDIO_YEAR_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartVolumeMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_VOLUME_MONTH, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_VOLUME_MONTH} barGap={8} barCategoryGap={"20%"}
        margin={{top: 20, right: 20, bottom: 20, left: 20}}>
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
          <Bar dataKey={"volume"} fill={COLORS[1]} radius={[10, 10, 0, 0]} minPointSize={1}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} vol`, customName];
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

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartCardioMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_CARDIO_MONTH, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_CARDIO_MONTH} barGap={8} barCategoryGap={"20%"}
        margin={{top: 20, right: 20, bottom: 20, left: 20}}>
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
          <Bar dataKey={"cardio"} fill={COLORS[3]} radius={[10, 10, 0, 0]} minPointSize={1} />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} hr`, customName];
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

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartVolumeYear = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_VOLUME_YEAR, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_VOLUME_YEAR} barGap={8} barCategoryGap={"20%"}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
        >
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
          <Bar dataKey={"volume"} fill={COLORS[1]} radius={[10, 10, 0, 0]} minPointSize={1} />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} vol`, customName];
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

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartCardioYear = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_CARDIO_YEAR, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_CARDIO_YEAR} barGap={8} barCategoryGap={"20%"}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}>
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
          <Bar dataKey={"cardio"} fill={COLORS[3]} radius={[10, 10, 0, 0]} minPointSize={1} />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} hr`, customName];
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

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"d-center fs-0-9rem"}>
        {translate("dashAvg")}
      </Div>
    );
    // 7-4. delete
    const deleteSection1 = () => (
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
    // 7-4. delete
    const deleteSection2 = () => (
      <PopUp
        type={"dash"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
        ["volume", "cardio"].map((key, index) => (
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
    // 7-7. fragment
    const dashFragment1 = (i) => (
      <Card className={"p-10"} key={i}>
        {chartVolumeMonth()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment2 = (i) => (
      <Card className={"p-10"} key={i}>
        {chartCardioMonth()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment3 = (i) => (
      <Card className={"p-10"} key={i}>
        {chartVolumeYear()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment4 = (i) => (
      <Card className={"p-10"} key={i}>
        {chartCardioYear()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "month" && LINE === "volume") {
        return LOADING ? loadingNode() : dashFragment1(0);
      }
      else if (SECTION === "year" && LINE === "volume") {
        return LOADING ? loadingNode() : dashFragment3(0);
      }
      else if (SECTION === "month" && LINE === "cardio") {
        return LOADING ? loadingNode() : dashFragment2(0);
      }
      else if (SECTION === "year" && LINE === "cardio") {
        return LOADING ? loadingNode() : dashFragment4(0);
      }
    }
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center mt-n10"}>
        <Div className={"ms-0"}>{deleteSection1()}</Div>
        <Div className={"ms-auto me-auto"}>{titleSection()}</Div>
        <Div className={"ms-auto me-0"}>{deleteSection2()}</Div>
      </Div>
    );
    // 7-9. third
    const thirdSection = () => (
      dashSection()
    );
    // 7-10. return
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
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {dashNode()}
    </>
  );
};