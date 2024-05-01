// FoodDashPie.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SECTION, set:setSECTION} = useStorage(
    `SECTION (pie) (${PATH})`, "today"
  );
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (pie) (${PATH})`, "kcal"
  );
  const {val:radius, set:setRadius} = useStorage(
    `RADIUS (pie) (${PATH})`, 120
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_TODAY_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_NUT_TODAY_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_KCAL_WEEK_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_NUT_WEEK_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_KCAL_MONTH_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_NUT_MONTH_DEFAULT = [
    {name:"", value: 100}
  ];
  const [OBJECT_KCAL_TODAY, setOBJECT_KCAL_TODAY] = useState(OBJECT_KCAL_TODAY_DEFAULT);
  const [OBJECT_NUT_TODAY, setOBJECT_NUT_TODAY] = useState(OBJECT_NUT_TODAY_DEFAULT);
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState(OBJECT_KCAL_WEEK_DEFAULT);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState(OBJECT_NUT_WEEK_DEFAULT);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEFAULT);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEFAULT);

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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseToday = await axios.get(`${URL_OBJECT}/dash/pie/today`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_KCAL_TODAY(responseToday.data.result.kcal || OBJECT_KCAL_TODAY_DEFAULT);
    setOBJECT_NUT_TODAY(responseToday.data.result.nut || OBJECT_NUT_TODAY_DEFAULT);

    const responseWeek = await axios.get(`${URL_OBJECT}/dash/pie/week`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_KCAL_WEEK(responseWeek.data.result.kcal || OBJECT_KCAL_WEEK_DEFAULT);
    setOBJECT_NUT_WEEK(responseWeek.data.result.nut || OBJECT_NUT_WEEK_DEFAULT);

    const responseMonth = await axios.get(`${URL_OBJECT}/dash/pie/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_KCAL_MONTH(responseMonth.data.result.kcal || OBJECT_KCAL_MONTH_DEFAULT);
    setOBJECT_NUT_MONTH(responseMonth.data.result.nut || OBJECT_NUT_MONTH_DEFAULT);
  })()}, [customer_id]);

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
  const chartNodeKcalToday = () => {
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeNutToday = () => {
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartNodeKcalWeek = () => {
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartNodeNutWeek = () => {
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-5. chart ----------------------------------------------------------------------------------->
  const chartNodeKcalMonth = () => {
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-6. chart ----------------------------------------------------------------------------------->
  const chartNodeNutMonth = () => {
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"border-0 border-bottom ms-2vw"}>
        <Container fluid>
          <Row>
            <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setSECTION(e.target.value))}
                value={SECTION}
              >
                <option value={"today"}>오늘</option>
                <option value={"week"}>주간</option>
                <option value={"month"}>월간</option>
              </select>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
              <span className={"dash-title"}>칼로리/영양소 비율</span>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setLINE(e.target.value))}
                value={LINE}
              >
                <option value={"kcal"}>칼로리</option>
                <option value={"nut"}>영양소</option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              {SECTION === "today" && LINE === "kcal" && chartNodeKcalToday()}
              {SECTION === "today" && LINE === "nut" && chartNodeNutToday()}
              {SECTION === "week" && LINE === "kcal" && chartNodeKcalWeek()}
              {SECTION === "week" && LINE === "nut" && chartNodeNutWeek()}
              {SECTION === "month" && LINE === "kcal" && chartNodeKcalMonth()}
              {SECTION === "month" && LINE === "nut" && chartNodeNutMonth()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
