// ExerciseChartPie.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect } from "../../../import/ImportReacts.jsx";
import { useCommon } from "../../../import/ImportHooks.jsx";
import { axios } from "../../../import/ImportLibs.jsx";
import { Loading } from "../../../import/ImportLayouts.jsx";
import { PopUp, Div, Img, Br20 } from "../../../import/ImportComponents.jsx";
import { Paper, Card, MenuItem, TextField, Grid } from "../../../import/ImportMuis.jsx";
import { FormGroup, FormControlLabel, Switch } from "../../../import/ImportMuis.jsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { common3_1 } from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseChartPie = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_OBJECT, sessionId, COLORS, translate, koreanDate,
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(true);
  const [radius, setRadius] = useState(120);
  const [SECTION, setSECTION] = useState("week");
  const [LINE, setLINE] = useState("part");
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: koreanDate,
    dateEnd: koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_PART_WEEK_DEF = [{
    name:"Empty",
    value: 100
  }];
  const OBJECT_TITLE_WEEK_DEF = [{
    name:"Empty",
    value: 100
  }];
  const OBJECT_PART_MONTH_DEF = [{
    name:"Empty",
    value: 100
  }];
  const OBJECT_TITLE_MONTH_DEF = [{
    name:"Empty",
    value: 100
  }];
  const [OBJECT_PART_WEEK, setOBJECT_PART_WEEK] = useState(OBJECT_PART_WEEK_DEF);
  const [OBJECT_TITLE_WEEK, setOBJECT_TITLE_WEEK] = useState(OBJECT_TITLE_WEEK_DEF);
  const [OBJECT_PART_MONTH, setOBJECT_PART_MONTH] = useState(OBJECT_PART_MONTH_DEF);
  const [OBJECT_TITLE_MONTH, setOBJECT_TITLE_MONTH] = useState(OBJECT_TITLE_MONTH_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const params = {
      user_id: sessionId,
      DATE: DATE,
    };
    const [resWeek, resMonth] = await Promise.all([
      axios.get(`${URL_OBJECT}/chart/pie/week`, {
        params: params,
      }),
      axios.get(`${URL_OBJECT}/chart/pie/month`, {
        params: params,
      }),
    ]);
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

  // 2-3. useEffect --------------------------------------------------------------------------------
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

  // 4-1. render -----------------------------------------------------------------------------------
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
        {`${translate(OBJECT_PART_WEEK[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 4-2. render -----------------------------------------------------------------------------------
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
        {`${translate(OBJECT_TITLE_WEEK[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  }

  // 4-3. render -----------------------------------------------------------------------------------
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
        {`${translate(OBJECT_PART_MONTH[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  }

  // 4-4. render -----------------------------------------------------------------------------------
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
        {`${translate(OBJECT_TITLE_MONTH[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartPartWeek = () => (
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}%`, customName];
          }}
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
          formatter={(value) => {
            return translate(value);
          }}
          wrapperStyle={{
            lineHeight:"40px",
            paddingTop:"10px",
            fontSize:"12px"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartTitleWeek = () => (
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}%`, customName];
          }}
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
          formatter={(value) => {
            return translate(value);
          }}
          wrapperStyle={{
            lineHeight:"40px",
            paddingTop:"10px",
            fontSize:"12px"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartPartMonth = () => (
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}%`, customName];
          }}
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
          formatter={(value) => {
            return translate(value);
          }}
          wrapperStyle={{
            lineHeight:"40px",
            paddingTop:"10px",
            fontSize:"12px"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  // 5-4. chart ------------------------------------------------------------------------------------
  const chartTitleMonth = () => (
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}%`, customName];
          }}
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
          formatter={(value) => {
            return translate(value);
          }}
          wrapperStyle={{
            lineHeight:"40px",
            paddingTop:"10px",
            fontSize:"12px"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleSection = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("chartPie")}
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
          <MenuItem value={"week"}>{translate("week")}</MenuItem>
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
        </TextField>
        </Div>
      );
      const selectSection2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
          ["part", "title"].map((key, index) => (
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
      return (
        <Grid container className={"w-100p"}>
          <Grid size={3} className={"d-left"}>
            {selectSection1()}
          </Grid>
          <Grid size={6} className={"d-center"}>
            {titleSection()}
          </Grid>
          <Grid size={3} className={"d-right"}>
            {selectSection2()}
          </Grid>
        </Grid>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartPartWeek()}
        </Card>
      );
      const chartFragment2 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartPartMonth()}
        </Card>
      );
      const chartFragment3 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartTitleWeek()}
        </Card>
      );
      const chartFragment4 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartTitleMonth()}
        </Card>
      );
      if (SECTION === "week" && LINE === "part") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "month" && LINE === "title") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
      else if (SECTION === "week" && LINE === "title") {
        return LOADING ? <Loading /> : chartFragment3(0);
      }
      else if (SECTION === "month" && LINE === "part") {
        return LOADING ? <Loading /> : chartFragment4(0);
      }
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min40vh"}>
        <Grid container className={"w-100p"}>
          <Grid size={12} className={"d-center"}>
            {headSection()}
            <Br20 />
            {chartSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
};
