// MoneyDashPie.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Paper} from "../../../import/ImportMuis.jsx";
import {MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts';
import {common3} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || "{}");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");
  const [LINE, setLINE] = useState("in");
  const [radius, setRadius] = useState(120);

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_IN_TODAY_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_OUT_TODAY_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_IN_WEEK_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_OUT_WEEK_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_IN_MONTH_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_OUT_MONTH_DEF = [
    {name:"Empty", value: 100}
  ];
  const [OBJECT_IN_TODAY, setOBJECT_IN_TODAY] = useState(OBJECT_IN_TODAY_DEF);
  const [OBJECT_OUT_TODAY, setOBJECT_OUT_TODAY] = useState(OBJECT_OUT_TODAY_DEF);
  const [OBJECT_IN_WEEK, setOBJECT_IN_WEEK] = useState(OBJECT_IN_WEEK_DEF);
  const [OBJECT_OUT_WEEK, setOBJECT_OUT_WEEK] = useState(OBJECT_OUT_WEEK_DEF);
  const [OBJECT_IN_MONTH, setOBJECT_IN_MONTH] = useState(OBJECT_IN_MONTH_DEF);
  const [OBJECT_OUT_MONTH, setOBJECT_OUT_MONTH] = useState(OBJECT_OUT_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resToday = await axios.get(`${URL_OBJECT}/dash/pie/today`, {
      params: {
        user_id: userId
      },
    });
    const resWeek = await axios.get(`${URL_OBJECT}/dash/pie/week`, {
      params: {
        user_id: userId
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/pie/month`, {
      params: {
        user_id: userId
      },
    });
    setOBJECT_IN_TODAY(
      resToday.data.result.in.length > 0 ? resToday.data.result.in : OBJECT_IN_TODAY_DEF
    );
    setOBJECT_OUT_TODAY(
      resToday.data.result.out.length > 0 ? resToday.data.result.out : OBJECT_OUT_TODAY_DEF
    );
    setOBJECT_IN_WEEK(
      resWeek.data.result.in.length > 0 ? resWeek.data.result.in : OBJECT_IN_WEEK_DEF
    );
    setOBJECT_OUT_WEEK(
      resWeek.data.result.out.length > 0 ? resWeek.data.result.out : OBJECT_OUT_WEEK_DEF
    );
    setOBJECT_IN_MONTH(
      resMonth.data.result.in.length > 0 ? resMonth.data.result.in : OBJECT_IN_MONTH_DEF
    );
    setOBJECT_OUT_MONTH(
      resMonth.data.result.out.length > 0 ? resMonth.data.result.out : OBJECT_OUT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [userId]);

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
  const renderInToday = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_IN_TODAY[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  };

  // 4-2. render ---------------------------------------------------------------------------------->
  const renderOutToday = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_OUT_TODAY[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-3. render ---------------------------------------------------------------------------------->
  const renderInWeek = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_IN_WEEK[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-4. render ---------------------------------------------------------------------------------->
  const renderOutWeek = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_OUT_WEEK[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-5. render ---------------------------------------------------------------------------------->
  const renderInMonth = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_IN_MONTH[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-6. render ---------------------------------------------------------------------------------->
  const renderOutMonth = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${OBJECT_OUT_MONTH[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartInToday = () => {
    const COLORS_IN_TODAY = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_IN_TODAY}
            cx={"50%"}
            cy={"50%"}
            label={renderInToday}
            labelLine={false}
            outerRadius={radius}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_IN_TODAY?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_IN_TODAY[index % COLORS_IN_TODAY.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
  const chartOutToday = () => {
    const COLORS_OUT_TODAY = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_OUT_TODAY}
            cx={"50%"}
            cy={"50%"}
            label={renderOutToday}
            labelLine={false}
            outerRadius={radius}
            fill={"#82ca9d"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_OUT_TODAY?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_OUT_TODAY[index % COLORS_OUT_TODAY.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
  const chartInWeek = () => {
    const COLORS_IN_WEEK = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_IN_WEEK}
            cx={"50%"}
            cy={"50%"}
            label={renderInWeek}
            labelLine={false}
            outerRadius={radius}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_IN_WEEK?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_IN_WEEK[index % COLORS_IN_WEEK.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
  const chartOutWeek = () => {
    const COLORS_OUT_WEEK = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_OUT_WEEK}
            cx={"50%"}
            cy={"50%"}
            label={renderOutWeek}
            labelLine={false}
            outerRadius={radius}
            fill={"#82ca9d"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_OUT_WEEK?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_OUT_WEEK[index % COLORS_OUT_WEEK.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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

  // 5-5. chart ----------------------------------------------------------------------------------->
  const chartInMonth = () => {
    const COLORS_IN_MONTH = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_IN_MONTH}
            cx={"50%"}
            cy={"50%"}
            label={renderInMonth}
            labelLine={false}
            outerRadius={radius}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_IN_MONTH?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_IN_MONTH[index % COLORS_IN_MONTH.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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

  // 5-6. chart ----------------------------------------------------------------------------------->
  const chartOutMonth = () => {
    const COLORS_OUT_MONTH = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Pie
            data={OBJECT_OUT_MONTH}
            cx={"50%"}
            cy={"50%"}
            label={renderOutMonth}
            labelLine={false}
            outerRadius={radius}
            fill={"#82ca9d"}
            dataKey={"value"}
            minAngle={15}
          >
            {OBJECT_OUT_MONTH?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_OUT_MONTH[index % COLORS_OUT_MONTH.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
        <MenuItem value={"week"}>주간</MenuItem>
        <MenuItem value={"month"}>월간</MenuItem>
      </TextField>
    );
    // 7-5-2. dropdown
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
          <Div className={"d-center m-auto fs-1-0rem"}>수입/지출 비율</Div>
          <Div className={"d-center ms-auto me-10"}>{dropdownSection2()}</Div>
        </Div>
        <Div className={"d-column"}>
          {SECTION === "today" && LINE === "in" && (
            LOADING ? loadingNode() : chartInToday()
          )}
          {SECTION === "today" && LINE === "out" && (
            LOADING ? loadingNode() : chartOutToday()
          )}
          {SECTION === "week" && LINE === "in" && (
            LOADING ? loadingNode() : chartInWeek()
          )}
          {SECTION === "week" && LINE === "out" && (
            LOADING ? loadingNode() : chartOutWeek()
          )}
          {SECTION === "month" && LINE === "in" && (
            LOADING ? loadingNode() : chartInMonth()
          )}
          {SECTION === "month" && LINE === "out" && (
            LOADING ? loadingNode() : chartOutMonth()
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
