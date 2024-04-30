// ExerciseDashPie.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SECTION, set:setSECTION} = useStorage(
    `SECTION (pie) (${PATH})`, "week"
  );
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (pie) (${PATH})`, "part"
  );
  const {val:radius, set:setRadius} = useStorage(
    `RADIUS (pie) (${PATH})`, 120
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_PART_WEEK_DEFAULT = [
    {name:"", value: 100},
  ];
  const OBJECT_TITLE_WEEK_DEFAULT = [
    {name:"", value: 100},
  ];
  const OBJECT_PART_MONTH_DEFAULT = [
    {name:"", value: 100},
  ];
  const OBJECT_TITLE_MONTH_DEFAULT = [
    {name:"", value: 100},
  ];
  const [OBJECT_PART_WEEK, setOBJECT_PART_WEEK] = useState(OBJECT_PART_WEEK_DEFAULT);
  const [OBJECT_TITLE_WEEK, setOBJECT_TITLE_WEEK] = useState(OBJECT_TITLE_WEEK_DEFAULT);
  const [OBJECT_PART_MONTH, setOBJECT_PART_MONTH] = useState(OBJECT_PART_MONTH_DEFAULT);
  const [OBJECT_TITLE_MONTH, setOBJECT_TITLE_MONTH] = useState(OBJECT_TITLE_MONTH_DEFAULT);

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
    const responseWeek = await axios.get(`${URL_OBJECT}/dash/pie/week`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_PART_WEEK(responseWeek.data.result.part || OBJECT_PART_WEEK_DEFAULT);
    setOBJECT_TITLE_WEEK(responseWeek.data.result.title || OBJECT_TITLE_WEEK_DEFAULT);

    const responseMonth = await axios.get(`${URL_OBJECT}/dash/pie/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_PART_MONTH(responseMonth.data.result.part || OBJECT_PART_MONTH_DEFAULT);
    setOBJECT_TITLE_MONTH(responseMonth.data.result.title || OBJECT_TITLE_MONTH_DEFAULT);
  })()}, [customer_id]);

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
      className={"dash-pie-text"}>
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
      className={"dash-pie-text"}>
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
      className={"dash-pie-text"}>
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
      className={"dash-pie-text"}>
        {`${OBJECT_TITLE_MONTH[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodePartWeek = () => {
    const COLORS_PART_WEEK = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeTitleWeek = () => {
    const COLORS_TITLE_WEEK = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartNodePartMonth = () => {
    const COLORS_PART_MONTH = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartNodeTitleMonth = () => {
    const COLORS_TITLE_MONTH = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
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
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Row>
              <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
                <select className={"form-select form-select-sm"}
                  onChange={(e) => (setSECTION(e.target.value))}
                  value={SECTION}
                >
                  <option value={"week"}>주간</option>
                  <option value={"month"}>월간</option>
                </select>
              </Col>
              <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
                <span className={"dash-title"}>부위/운동 비율</span>
              </Col>
              <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
                <select className={"form-select form-select-sm"}
                  onChange={(e) => (setLINE(e.target.value))}
                  value={LINE}
                >
                  <option value={"part"}>부위</option>
                  <option value={"title"}>운동</option>
                </select>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                {SECTION === "week" && LINE === "part" && chartNodePartWeek()}
                {SECTION === "week" && LINE === "title" && chartNodeTitleWeek()}
                {SECTION === "month" && LINE === "part" && chartNodePartMonth()}
                {SECTION === "month" && LINE === "title" && chartNodeTitleMonth()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};