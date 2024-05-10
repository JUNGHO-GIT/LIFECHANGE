// FoodDashPie.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts";
import {axios, moment} from "../../../import/ImportLibs";
import {Btn, Loading, PopDown} from "../../../import/ImportComponents";
import {CustomIcons} from "../../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem, TextField, Typography} from "../../../import/ImportMuis";
import {FormGroup, FormControlLabel, FormControl, Select, Switch} from "../../../import/ImportMuis";
import {IconButton, Button, Divider} from "../../../import/ImportMuis";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const FoodDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");
  const [LINE, setLINE] = useState("kcal");
  const [radius, setRadius] = useState(120);

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_TODAY_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_NUT_TODAY_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_KCAL_WEEK_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_NUT_WEEK_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_KCAL_MONTH_DEF = [
    {name:"Empty", value: 100}
  ];
  const OBJECT_NUT_MONTH_DEF = [
    {name:"Empty", value: 100}
  ];
  const [OBJECT_KCAL_TODAY, setOBJECT_KCAL_TODAY] = useState(OBJECT_KCAL_TODAY_DEF);
  const [OBJECT_NUT_TODAY, setOBJECT_NUT_TODAY] = useState(OBJECT_NUT_TODAY_DEF);
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState(OBJECT_KCAL_WEEK_DEF);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState(OBJECT_NUT_WEEK_DEF);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEF);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resToday = await axios.get(`${URL_OBJECT}/dash/pie/today`, {
      params: {
        user_id: user_id
      },
    });
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
    setOBJECT_KCAL_TODAY(
      resToday.data.result.kcal.length > 0 ? resToday.data.result.kcal : OBJECT_KCAL_TODAY_DEF
    );
    setOBJECT_NUT_TODAY(
      resToday.data.result.nut.length > 0 ? resToday.data.result.nut : OBJECT_NUT_TODAY_DEF
    );
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
  const renderKcalToday = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_KCAL_TODAY[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}kcal`}
      </text>
    );
  };

  // 4-2. render ---------------------------------------------------------------------------------->
  const renderNutToday = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_NUT_TODAY[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}g`}
      </text>
    );
  }

  // 4-3. render ---------------------------------------------------------------------------------->
  const renderKcalWeek = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_KCAL_WEEK[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}kcal`}
      </text>
    );
  }

  // 4-4. render ---------------------------------------------------------------------------------->
  const renderNutWeek = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_NUT_WEEK[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}g`}
      </text>
    );
  }

  // 4-5. render ---------------------------------------------------------------------------------->
  const renderKcalMonth = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_KCAL_MONTH[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}kcal`}
      </text>
    );
  }

  // 4-6. render ---------------------------------------------------------------------------------->
  const renderNutMonth = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_NUT_MONTH[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}g`}
      </text>
    );
  }

  // 5-1. chart ----------------------------------------------------------------------------------->
  const ChartKcalToday = () => {
    const COLORS_KCAL_TODAY = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_KCAL_TODAY}
              cx={"50%"}
              cy={"50%"}
              label={renderKcalToday}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_KCAL_TODAY?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_KCAL_TODAY[index % COLORS_KCAL_TODAY.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const ChartNutToday = () => {
    const COLORS_NUT_TODAY = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_NUT_TODAY}
              cx={"50%"}
              cy={"50%"}
              label={renderNutToday}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_NUT_TODAY?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_NUT_TODAY[index % COLORS_NUT_TODAY.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}g`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const ChartKcalWeek = () => {
    const COLORS_KCAL_WEEK = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_KCAL_WEEK}
              cx={"50%"}
              cy={"50%"}
              label={renderKcalWeek}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_KCAL_WEEK?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_KCAL_WEEK[index % COLORS_KCAL_WEEK.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const ChartNutWeek = () => {
    const COLORS_NUT_WEEK = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_NUT_WEEK}
              cx={"50%"}
              cy={"50%"}
              label={renderNutWeek}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_NUT_WEEK?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_NUT_WEEK[index % COLORS_NUT_WEEK.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}g`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-5. chart ----------------------------------------------------------------------------------->
  const ChartKcalMonth = () => {
    const COLORS_KCAL_MONTH = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_KCAL_MONTH}
              cx={"50%"}
              cy={"50%"}
              label={renderKcalMonth}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_KCAL_MONTH?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_KCAL_MONTH[index % COLORS_KCAL_MONTH.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-6. chart ----------------------------------------------------------------------------------->
  const ChartNutMonth = () => {
    const COLORS_NUT_MONTH = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_NUT_MONTH}
              cx={"50%"}
              cy={"50%"}
              label={renderNutMonth}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_NUT_MONTH?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_NUT_MONTH[index % COLORS_NUT_MONTH.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}g`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 7-1. dropdown -------------------------------------------------------------------------------->
  const DropdownSection1 = () => (
    <TextField
      select={true}
      type={"text"}
      size={"small"}
      id={"section"}
      name={"section"}
      className={"w-90"}
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

  // 7-3. dropdown -------------------------------------------------------------------------------->
  const DropdownSection3 = () => (
    <React.Fragment>
      <PopDown
        elementId={"popChild"}
        contents={
          <React.Fragment>
            {["kcal", "nut"]?.map((key, index) => (
              <FormGroup key={index} className={"p-5 pe-10"}>
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
            ))}
          </React.Fragment>
        }
      >
        {popProps => (
          <IconButton onClick={(e) => {popProps.openPopup(e.currentTarget)}} id={"popChild"}>
            <CustomIcons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark"} />
          </IconButton>
        )}
      </PopDown>
    </React.Fragment>
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const LoadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Paper className={"content-wrapper"} variant={"outlined"}>
          <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <DropdownSection1/>
            </Grid2>
            <Grid2 xl={6} lg={6} md={6} sm={6} xs={6} className={"d-center"}>
              <Typography variant={"h6"} className={"dash-title"}>칼로리/영양소 비율</Typography>
            </Grid2>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-right"}>
              <DropdownSection3/>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
              {SECTION === "today" && LINE === "kcal" && (
                LOADING ? <LoadingNode /> : <ChartKcalToday />
              )}
              {SECTION === "today" && LINE === "nut" && (
                LOADING ? <LoadingNode /> : <ChartNutToday />
              )}
              {SECTION === "week" && LINE === "kcal" && (
                LOADING ? <LoadingNode /> : <ChartKcalWeek />
              )}
              {SECTION === "week" && LINE === "nut" && (
                LOADING ? <LoadingNode /> : <ChartNutWeek />
              )}
              {SECTION === "month" && LINE === "kcal" && (
                LOADING ? <LoadingNode /> : <ChartKcalMonth />
              )}
              {SECTION === "month" && LINE === "nut" && (
                LOADING ? <LoadingNode /> : <ChartNutMonth />
              )}
            </Grid2>
            </Grid2>
          </Container>
      </Paper>
    </React.Fragment>
  );
};
