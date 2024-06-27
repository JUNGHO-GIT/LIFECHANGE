// MoneyDashLine.jsx

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
import {common3_1} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const MoneyDashLine = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL + SUBFIX;
  const {translate} = useTranslate();
  const array = ["income", "expense"];

  // 2-2. useState ---------------------------------------------------------------------------------
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("week");
  const [LINE, setLINE] = useState(array);
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_WEEK_DEF = [
    {name:"", day: "", income: 0, expense: 0},
  ];
  const OBJECT_MONTH_DEF = [
    {name:"", day: "", income: 0, expense: 0},
  ];
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
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
    const {domain, ticks, formatterY} = handlerY(OBJECT_WEEK, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart
          data={OBJECT_WEEK}
          barGap={20}
          barCategoryGap={"20%"}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
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
            <Line dataKey={"income"} type={"monotone"} stroke={COLORS[0]} strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          {LINE.includes("expense") && (
            <Line dataKey={"expense"} type={"monotone"} stroke={COLORS[3]} strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
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
    const {domain, ticks, formatterY} = handlerY(OBJECT_MONTH, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart
          data={OBJECT_MONTH}
          barGap={20}
          barCategoryGap={"20%"}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
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
            <Line dataKey={"income"} type={"monotone"} stroke={COLORS[0]} strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          {LINE.includes("expense") && (
            <Line dataKey={"expense"} type={"monotone"} stroke={COLORS[3]} strokeWidth={2}
              activeDot={{r:8}}
            />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
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

  // 7. dash ---------------------------------------------------------------------------------------
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"d-center fs-0-9rem"}>
        {translate("dashLine")}
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
          <MenuItem value={"week"}>{translate("week")}</MenuItem>
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
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
        ["income", "expense"].map((key, index) => (
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

    // 7-7. fragment
    const dashFragment1 = (i) => (
      <Card className={"p-10"} key={i}>
        {chartWeek()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment2 = (i) => (
      <Card className={"p-10"} key={i}>
        {chartMonth()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "week") {
        return LOADING ? loadingFragment() : dashFragment1(0);
      }
      else if (SECTION === "month") {
        return LOADING ? loadingFragment() : dashFragment2(0);
      }
    }
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center mt-n10"}>
        <Div className={"ms-0"}>{deleteSection1()}</Div>
        <Div className={"ms-auto"}>{titleSection()}</Div>
        <Div className={"ms-auto me-0"}>{deleteSection2()}</Div>
      </Div>
    );
    // 7-9. third
    const thirdSection = () => (
      dashSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min40vh"}>
          {firstSection()}
          <Br20/>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

  // 8. loading ------------------------------------------------------------------------------------
  const loadingFragment = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dashNode()}
    </>
  );
};