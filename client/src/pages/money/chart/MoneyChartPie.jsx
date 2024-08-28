// MoneyChartPie.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../../imports/ImportReacts.jsx";
import { useCommon } from "../../../imports/ImportHooks.jsx";
import { axios } from "../../../imports/ImportLibs.jsx";
import { Loading } from "../../../imports/ImportLayouts.jsx";
import { Div, Img, Br, Select} from "../../../imports/ImportComponents.jsx";
import { PopUp } from "../../../imports/ImportContainers.jsx";
import { Paper, Card, MenuItem, Grid } from "../../../imports/ImportMuis.jsx";
import { FormGroup, FormControlLabel, Switch } from "../../../imports/ImportMuis.jsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { common3_1 } from "../../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const MoneyChartPie = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, COLORS, translate, koreanDate } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(true);
  const [radius, setRadius] = useState(120);
  const [SECTION, setSECTION] = useState("today");
  const [LINE, setLINE] = useState("income");
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: koreanDate,
    dateEnd: koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_IN_TODAY_DEF = [{
    name:"Empty",
    value: 100,
  }];
  const OBJECT_OUT_TODAY_DEF = [{
    name:"Empty",
    value: 100,
  }];
  const OBJECT_IN_WEEK_DEF = [{
    name:"Empty",
    value: 100,
  }];
  const OBJECT_OUT_WEEK_DEF = [{
    name:"Empty",
    value: 100,
  }];
  const OBJECT_IN_MONTH_DEF = [{
    name:"Empty",
    value: 100,
  }];
  const OBJECT_OUT_MONTH_DEF = [{
    name:"Empty",
    value: 100,
  }];
  const [OBJECT_IN_TODAY, setOBJECT_IN_TODAY] = useState(OBJECT_IN_TODAY_DEF);
  const [OBJECT_OUT_TODAY, setOBJECT_OUT_TODAY] = useState(OBJECT_OUT_TODAY_DEF);
  const [OBJECT_IN_WEEK, setOBJECT_IN_WEEK] = useState(OBJECT_IN_WEEK_DEF);
  const [OBJECT_OUT_WEEK, setOBJECT_OUT_WEEK] = useState(OBJECT_OUT_WEEK_DEF);
  const [OBJECT_IN_MONTH, setOBJECT_IN_MONTH] = useState(OBJECT_IN_MONTH_DEF);
  const [OBJECT_OUT_MONTH, setOBJECT_OUT_MONTH] = useState(OBJECT_OUT_MONTH_DEF);

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
    setOBJECT_IN_TODAY(
      resToday.data.result.income.length > 0 ? resToday.data.result.income : OBJECT_IN_TODAY_DEF
    );
    setOBJECT_OUT_TODAY(
      resToday.data.result.expense.length > 0 ? resToday.data.result.expense : OBJECT_OUT_TODAY_DEF
    );
    setOBJECT_IN_WEEK(
      resWeek.data.result.income.length > 0 ? resWeek.data.result.income : OBJECT_IN_WEEK_DEF
    );
    setOBJECT_OUT_WEEK(
      resWeek.data.result.expense.length > 0 ? resWeek.data.result.expense : OBJECT_OUT_WEEK_DEF
    );
    setOBJECT_IN_MONTH(
      resMonth.data.result.income.length > 0 ? resMonth.data.result.income : OBJECT_IN_MONTH_DEF
    );
    setOBJECT_OUT_MONTH(
      resMonth.data.result.expense.length > 0 ? resMonth.data.result.expense : OBJECT_OUT_MONTH_DEF
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
        {`${translate(OBJECT_IN_TODAY[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  };

  // 4-2. render -----------------------------------------------------------------------------------
  const renderExpenseToday = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_OUT_TODAY[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-3. render -----------------------------------------------------------------------------------
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
        {`${translate(OBJECT_IN_WEEK[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-4. render -----------------------------------------------------------------------------------
  const renderExpenseWeek = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_OUT_WEEK[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-5. render -----------------------------------------------------------------------------------
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
        {`${translate(OBJECT_IN_MONTH[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-6. render -----------------------------------------------------------------------------------
  const renderExpenseMonth = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_OUT_MONTH[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartIncomeToday = () => (
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}`, customName];
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
  const chartExpenseToday = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_OUT_TODAY}
          cx={"50%"}
          cy={"50%"}
          label={renderExpenseToday}
          labelLine={false}
          outerRadius={radius}
          fill={"#82ca9d"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_OUT_TODAY?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}`, customName];
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
  const chartIncomeWeek = () => (
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}`, customName];
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
  const chartExpenseWeek = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_OUT_WEEK}
          cx={"50%"}
          cy={"50%"}
          label={renderExpenseWeek}
          labelLine={false}
          outerRadius={radius}
          fill={"#82ca9d"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_OUT_WEEK?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}`, customName];
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

  // 5-5. chart ------------------------------------------------------------------------------------
  const chartIncomeMonth = () =>  (
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}`, customName];
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

  // 5-6. chart ------------------------------------------------------------------------------------
  const chartExpenseMonth = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_OUT_MONTH}
          cx={"50%"}
          cy={"50%"}
          label={renderExpenseMonth}
          labelLine={false}
          outerRadius={radius}
          fill={"#82ca9d"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_OUT_MONTH?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}`, customName];
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
        <Div className={"d-center"}>
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
        </Div>
      );
      const selectFragment2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
          ["income", "expense"]?.map((key, index) => (
            <FormGroup key={index}>
              <FormControlLabel control={<Switch checked={LINE.includes(key)} onChange={() => {
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
        <Card className={"p-0"}>
          <Grid container columnSpacing={1}>
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
          {chartIncomeToday()}
        </Card>
      );
      const chartFragment2 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartExpenseToday()}
        </Card>
      );
      const chartFragment3 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartIncomeWeek()}
        </Card>
      );
      const chartFragment4 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartExpenseWeek()}
        </Card>
      );
      const chartFragment5 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartIncomeMonth()}
        </Card>
      );
      const chartFragment6 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartExpenseMonth()}
        </Card>
      );
      if (SECTION === "today" && LINE === "income") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "today" && LINE === "expense") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
      else if (SECTION === "week" && LINE === "income") {
        return LOADING ? <Loading /> : chartFragment3(0);
      }
      else if (SECTION === "week" && LINE === "expense") {
        return LOADING ? <Loading /> : chartFragment4(0);
      }
      else if (SECTION === "month" && LINE === "income") {
        return LOADING ? <Loading /> : chartFragment5(0);
      }
      else if (SECTION === "month" && LINE === "expense") {
        return LOADING ? <Loading /> : chartFragment6(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min40vh"}>
        <Grid container columnSpacing={1}>
          <Grid size={12} className={"d-column"}>
            {headSection()}
            <Br px={20} />
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
