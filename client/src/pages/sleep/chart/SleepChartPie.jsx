// SleepChartPie.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../../imports/ImportReacts.jsx";
import { useCommon } from "../../../imports/ImportHooks.jsx";
import { axios } from "../../../imports/ImportLibs.jsx";
import { Loading } from "../../../imports/ImportLayouts.jsx";
import { Div, Img, Br, Select } from "../../../imports/ImportComponents.jsx";
import { Paper, Card, MenuItem, Grid } from "../../../imports/ImportMuis.jsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts';
import { common3_2 } from "../../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepChartPie = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, COLORS, translate, koreanDate } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(true);
  const [radius, setRadius] = useState(120);
  const [SECTION, setSECTION] = useState("today");
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: koreanDate,
    dateEnd: koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_TODAY_DEF = [{
    name:"Empty",
    value: 100
  }];
  const OBJECT_WEEK_DEF = [{
    name:"Empty",
    value: 100
  }];
  const OBJECT_MONTH_DEF = [{
    name:"Empty",
    value: 100
  }];
  const [OBJECT_TODAY, setOBJECT_TODAY] = useState(OBJECT_TODAY_DEF);
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const params = {
      user_id: sessionId,
      DATE: DATE,
    };
    const [resToday, resWeek, resMonth] = await Promise.all([
      axios.get(`${URL_OBJECT}/chart/pie/today`, {
        params: params,
      }),
      axios.get(`${URL_OBJECT}/chart/pie/week`, {
        params: params,
      }),
      axios.get(`${URL_OBJECT}/chart/pie/month`, {
        params: params,
      }),
    ]);
    setOBJECT_TODAY(
      (resToday.data.result.length > 0)
      && (resToday.data.result[0].value !== 0)
      && (resToday.data.result[1].value !== 0)
      && (resToday.data.result[2].value !== 0)
      ? resToday.data.result
      : OBJECT_TODAY_DEF
    );
    setOBJECT_WEEK(
      (resWeek.data.result.length > 0)
      && (resWeek.data.result[0].value !== 0)
      && (resWeek.data.result[1].value !== 0)
      && (resWeek.data.result[2].value !== 0)
      ? resWeek.data.result
      : OBJECT_WEEK_DEF
    );
    setOBJECT_MONTH(
      (resMonth.data.result.length > 0)
      && (resMonth.data.result[0].value !== 0)
      && (resMonth.data.result[1].value !== 0)
      && (resMonth.data.result[2].value !== 0)
      ? resMonth.data.result
      : OBJECT_MONTH_DEF
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
  const renderToday = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // ex. wakeTime -> wake , bedTime -> bed
    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_TODAY[index]?.name)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 4-2. render -----------------------------------------------------------------------------------
  const renderWeek = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // ex. wakeTime -> wake , bedTime -> bed
    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_WEEK[index]?.name)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 4-3. render -----------------------------------------------------------------------------------
  const renderMonth = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // ex. wakeTime -> wake , bedTime -> bed
    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_MONTH[index]?.name)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartToday = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_TODAY}
          cx={"50%"}
          cy={"50%"}
          label={renderToday}
          labelLine={false}
          outerRadius={radius}
          fill={"#8884d8"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_TODAY?.map((entry, index) => (
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
  const chartWeek = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_WEEK}
          cx={"50%"}
          cy={"50%"}
          label={renderWeek}
          labelLine={false}
          outerRadius={radius}
          fill={"#8884d8"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_WEEK?.map((entry, index) => (
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
  const chartMonth = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_MONTH}
          cx={"50%"}
          cy={"50%"}
          label={renderMonth}
          labelLine={false}
          outerRadius={radius}
          fill={"#8884d8"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_MONTH?.map((entry, index) => (
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
      const titleFragment = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("chartPie")}
        </Div>
      );
      const selectFragment1 = () => (
        <Select
          value={SECTION}
          onChange={(e) => (
            setSECTION(e.target.value)
          )}
        >
          <MenuItem value={"today"}>{translate("today")}</MenuItem>
          <MenuItem value={"week"}>{translate("week")}</MenuItem>
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
        </Select>
      );
      const selectFragment2 = () => (
        <Img src={common3_2} className={"w-24 h-24"} />
      );
      return (
        <Card className={"p-0"}>
          <Grid container columnSpacing={1} rowSpacing={2}>
            <Grid size={3} className={"d-left"}>
              {selectFragment1()}
            </Grid>
            <Grid size={6} className={"d-center"}>
              {titleFragment()}
            </Grid>
            <Grid size={3} className={"d-right"}>
              {selectFragment2()}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartToday()}
        </Card>
      );
      const chartFragment2 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartWeek()}
        </Card>
      );
      const chartFragment3 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartMonth()}
        </Card>
      );
      if (SECTION === "today") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "week") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
      else if (SECTION === "month") {
        return LOADING ? <Loading /> : chartFragment3(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min40vh"}>
        <Grid container columnSpacing={1} rowSpacing={2}>
          <Grid size={12}>
            {headSection()}
          </Grid>
          <Grid size={12}>
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
