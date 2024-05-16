// ExerciseDashPie.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {Adorn, Icons, PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Grid2, Container, Card, Paper} from "../../../import/ImportMuis.jsx";
import {Badge, Menu, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import {
  calendar1, calendar2, calendar3, calendar4,
  exercise1, exercise2, exercise3, exercise4, exercise5, exercise9, exercise10,
  food1, food2, food3, food4, food5, food6, food7, food8,
  money1, money2, money3, money4,
  sleep1, sleep2, sleep3, sleep5, sleep6, sleep7, sleep8, sleep9, sleep10,
  user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12,
  setting1, setting2, setting3, setting4, setting5, setting6, setting7, setting8
} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("part");
  const [radius, setRadius] = useState(120);

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
        user_id: user_id
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/pie/month`, {
      params: {
        user_id: user_id
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
  })()}, [user_id]);

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
        <MenuItem value={"week"}>주간</MenuItem>
        <MenuItem value={"month"}>월간</MenuItem>
      </TextField>
    );
    // 7-5-2. dropdown
    const dropdownSection2 = () => (
      <PopUp
        elementId={"popover"}
        type={"dash"}
        position={"bottom"}
        direction={"left"}
        contents={({closePopup}) => (
          ["part", "title"]?.map((key, index) => (
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
          <img src={setting4} className={"w-24 h-24 pointer"} alt={"setting4"}
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
          <Div className={"ms-0"}>{dropdownSection1()}</Div>
          <Div className={"m-auto fs-1-0rem"}>부위/운동 비율</Div>
          <Div className={"ms-auto"}>{dropdownSection2()}</Div>
        </Div>
        <Div className={"d-column"}>
          {SECTION === "week" && LINE === "part" && (
            LOADING ? loadingNode() : chartPartWeek()
          )}
          {SECTION === "week" && LINE === "title" && (
            LOADING ? loadingNode() : chartTitleWeek()
          )}
          {SECTION === "month" && LINE === "part" && (
            LOADING ? loadingNode() : chartPartMonth()
          )}
          {SECTION === "month" && LINE === "title" && (
            LOADING ? loadingNode() : chartTitleMonth()
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
