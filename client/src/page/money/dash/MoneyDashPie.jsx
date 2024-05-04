// MoneyDashPie.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from "recharts";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["수입", "지출"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const [SECTION, setSECTION] = useState("today");
  const [LINE, setLINE] = useState("in");
  const [radius, setRadius] = useState(120);

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_IN_TODAY_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_OUT_TODAY_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_IN_WEEK_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_OUT_WEEK_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_IN_MONTH_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_OUT_MONTH_DEFAULT = [
    {name:"", value: 100}
  ];
  const [OBJECT_IN_TODAY, setOBJECT_IN_TODAY] = useState(OBJECT_IN_TODAY_DEFAULT);
  const [OBJECT_OUT_TODAY, setOBJECT_OUT_TODAY] = useState(OBJECT_OUT_TODAY_DEFAULT);
  const [OBJECT_IN_WEEK, setOBJECT_IN_WEEK] = useState(OBJECT_IN_WEEK_DEFAULT);
  const [OBJECT_OUT_WEEK, setOBJECT_OUT_WEEK] = useState(OBJECT_OUT_WEEK_DEFAULT);
  const [OBJECT_IN_MONTH, setOBJECT_IN_MONTH] = useState(OBJECT_IN_MONTH_DEFAULT);
  const [OBJECT_OUT_MONTH, setOBJECT_OUT_MONTH] = useState(OBJECT_OUT_MONTH_DEFAULT);

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
        user_id: user_id
      },
    });
    setOBJECT_IN_TODAY(responseToday.data.result.in || OBJECT_IN_TODAY_DEFAULT);
    setOBJECT_OUT_TODAY(responseToday.data.result.out || OBJECT_OUT_TODAY_DEFAULT);

    const responseWeek = await axios.get(`${URL_OBJECT}/dash/pie/week`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_IN_WEEK(responseWeek.data.result.in || OBJECT_IN_WEEK_DEFAULT);
    setOBJECT_OUT_WEEK(responseWeek.data.result.out || OBJECT_OUT_WEEK_DEFAULT);

    const responseMonth = await axios.get(`${URL_OBJECT}/dash/pie/month`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_IN_MONTH(responseMonth.data.result.in || OBJECT_IN_MONTH_DEFAULT);
    setOBJECT_OUT_MONTH(responseMonth.data.result.out || OBJECT_OUT_MONTH_DEFAULT);
  })()}, [user_id]);

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
      className={"dash-pie-text"}>
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
      className={"dash-pie-text"}>
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
      className={"dash-pie-text"}>
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
      className={"dash-pie-text"}>
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
      className={"dash-pie-text"}>
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
      className={"dash-pie-text"}>
        {`${OBJECT_OUT_MONTH[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartInToday = () => {
    const COLORS_IN_TODAY = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartOutToday = () => {
    const COLORS_OUT_TODAY = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartInWeek = () => {
    const COLORS_IN_WEEK = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartOutWeek = () => {
    const COLORS_OUT_WEEK = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-5. chart ----------------------------------------------------------------------------------->
  const chartInMonth = () => {
    const COLORS_IN_MONTH = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-6. chart ----------------------------------------------------------------------------------->
  const chartOutMonth = () => {
    const COLORS_OUT_MONTH = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
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
        <Container fluid={true}>
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
              <span className={"dash-title"}>수입/지출 비율</span>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setLINE(e.target.value))}
                value={LINE}
              >
                <option value={"in"}>수입</option>
                <option value={"out"}>지출</option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              {SECTION === "today" && LINE === "in" && chartInToday()}
              {SECTION === "today" && LINE === "out" && chartOutToday()}
              {SECTION === "week" && LINE === "in" && chartInWeek()}
              {SECTION === "week" && LINE === "out" && chartOutWeek()}
              {SECTION === "month" && LINE === "in" && chartInMonth()}
              {SECTION === "month" && LINE === "out" && chartOutMonth()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
