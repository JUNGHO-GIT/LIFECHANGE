// ExerciseDashPie.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from "recharts";
import {common3} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL + SUBFIX;

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [radius, setRadius] = useState(120);
  const [LINE, setLINE] = useState("부위");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_PART_WEEK_DEF = [
    {name:"Empty", value: 100},
  ];
  const OBJECT_TITLE_WEEK_DEF = [
    {name:"Empty", value: 100},
  ];
  const OBJECT_PART_MONTH_DEF = [
    {name:"Empty", value: 100},
  ];
  const OBJECT_TITLE_MONTH_DEF = [
    {name:"Empty", value: 100},
  ];
  const [OBJECT_PART_WEEK, setOBJECT_PART_WEEK] = useState(OBJECT_PART_WEEK_DEF);
  const [OBJECT_TITLE_WEEK, setOBJECT_TITLE_WEEK] = useState(OBJECT_TITLE_WEEK_DEF);
  const [OBJECT_PART_MONTH, setOBJECT_PART_MONTH] = useState(OBJECT_PART_MONTH_DEF);
  const [OBJECT_TITLE_MONTH, setOBJECT_TITLE_MONTH] = useState(OBJECT_TITLE_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resWeek = await axios.get(`${URL_OBJECT}/dash/pie/week`, {
      params: {
        user_id: sessionId
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/pie/month`, {
      params: {
        user_id: sessionId
      },
    });
    setOBJECT_PART_WEEK(
      resWeek.data.result.part.length > 0 ? resWeek.data.result.part : OBJECT_PART_WEEK_DEF
    );
    setOBJECT_TITLE_WEEK(
      resWeek.data.result.title.length > 0 ? resWeek.data.result.title : OBJECT_TITLE_WEEK_DEF
    );
    setOBJECT_PART_MONTH(
      resMonth.data.result.part.length > 0 ? resMonth.data.result.part : OBJECT_PART_MONTH_DEF
    );
    setOBJECT_TITLE_MONTH(
      resMonth.data.result.title.length > 0 ? resMonth.data.result.title : OBJECT_TITLE_MONTH_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const updateRadius = () => {
      // lg
      if (window.innerWidth >= 1200) {
        setRadius(120);
      }
      // md
      else if (window.innerWidth >= 992) {
        setRadius(110);
      }
      // sm
      else if (window.innerWidth >= 768) {
        setRadius(100);
      }
      // xs
      else {
        setRadius(90);
      }
    };

    window.addEventListener('resize', updateRadius);
    updateRadius();

    return () => {
      window.removeEventListener('resize', updateRadius);
    }
  }, []);

  // 4-1. render ---------------------------------------------------------------------------------->
  const renderPartWeek = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_PART_WEEK[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}%`}
      </text>
    );
  };

  // 4-2. render ---------------------------------------------------------------------------------->
  const renderTitleWeek = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_TITLE_WEEK[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}%`}
      </text>
    );
  }

  // 4-3. render ---------------------------------------------------------------------------------->
  const renderPartMonth = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_PART_MONTH[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}%`}
      </text>
    );
  }

  // 4-4. render ---------------------------------------------------------------------------------->
  const renderTitleMonth = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_TITLE_MONTH[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartPartWeek = () => {
    const COLORS_PART_WEEK = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_PART_WEEK}
            cx={"50%"}
            cy={"50%"}
            label={renderPartWeek}
            labelLine={false}
            outerRadius={radius}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_PART_WEEK?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_PART_WEEK[index % COLORS_PART_WEEK.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}%`)}
            contentStyle={{
              backgroundColor:"rgba(255, 255, 255, 0.8)",
              border:"none",
              borderRadius:"10px"
            }}
          />
          <Legend
            iconType={"circle"}
            verticalAlign={"bottom"}
            align={"center"}
            wrapperStyle={{
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartTitleWeek = () => {
    const COLORS_TITLE_WEEK = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_TITLE_WEEK}
            cx={"50%"}
            cy={"50%"}
            label={renderTitleWeek}
            labelLine={false}
            outerRadius={radius}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_TITLE_WEEK?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_TITLE_WEEK[index % COLORS_TITLE_WEEK.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}%`)}
            contentStyle={{
              backgroundColor:"rgba(255, 255, 255, 0.8)",
              border:"none",
              borderRadius:"10px"
            }}
          />
          <Legend
            iconType={"circle"}
            verticalAlign={"bottom"}
            align={"center"}
            wrapperStyle={{
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartPartMonth = () => {
    const COLORS_PART_MONTH = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_PART_MONTH}
            cx={"50%"}
            cy={"50%"}
            label={renderPartMonth}
            labelLine={false}
            outerRadius={radius}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_PART_MONTH?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_PART_MONTH[index % COLORS_PART_MONTH.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}%`)}
            contentStyle={{
              backgroundColor:"rgba(255, 255, 255, 0.8)",
              border:"none",
              borderRadius:"10px"
            }}
          />
          <Legend
            iconType={"circle"}
            verticalAlign={"bottom"}
            align={"center"}
            wrapperStyle={{
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartTitleMonth = () => {
    const COLORS_TITLE_MONTH = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_TITLE_MONTH}
            cx={"50%"}
            cy={"50%"}
            label={renderTitleMonth}
            labelLine={false}
            outerRadius={radius}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_TITLE_MONTH?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_TITLE_MONTH[index % COLORS_TITLE_MONTH.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}%`)}
            contentStyle={{
              backgroundColor:"rgba(255, 255, 255, 0.8)",
              border:"none",
              borderRadius:"10px"
            }}
          />
          <Legend
            iconType={"circle"}
            verticalAlign={"bottom"}
            align={"center"}
            wrapperStyle={{
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"d-center"}>부위/운동 비율</Div>
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
        ["부위", "운동"].map((key, index) => (
          <FormGroup key={index}>
            <FormControlLabel control={<Switch checked={LINE === key} onChange={() => {
              if (LINE === key) {
                return;
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
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartPartWeek()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment2 = (i) => (
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartPartMonth()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment3 = (i) => (
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartTitleWeek()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment4 = (i) => (
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartTitleMonth()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "week" && LINE === "부위") {
        return LOADING ? loadingNode() : dashFragment1(0);
      }
      else if (SECTION === "month" && LINE === "부위") {
        return LOADING ? loadingNode() : dashFragment2(0);
      }
      else if (SECTION === "week" && LINE === "운동") {
        return LOADING ? loadingNode() : dashFragment3(0);
      }
      else if (SECTION === "month" && LINE === "운동") {
        return LOADING ? loadingNode() : dashFragment4(0);
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
