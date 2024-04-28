// MoneyDashPieToday.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashPieToday = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (pie-today) (${PATH})`, "in"
  );
  const {val:radius, set:setRadius} = useStorage(
    `RADIUS (pie-today) (${PATH})`, 120
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_IN_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_OUT_DEFAULT = [
    {name:"", value: 100}
  ];
  const [OBJECT_IN, setOBJECT_IN] = useState(OBJECT_IN_DEFAULT);
  const [OBJECT_OUT, setOBJECT_OUT] = useState(OBJECT_OUT_DEFAULT);

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
    const response = await axios.get(`${URL_OBJECT}/dash/pie/today`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_IN(response.data.result.in || OBJECT_IN_DEFAULT);
    setOBJECT_OUT(response.data.result.out || OBJECT_OUT_DEFAULT);
  })()}, [customer_id]);

  // 4-1. renderIn ------------------------------------------------------------------------------>
  const renderIn = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_IN[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  };

  // 4-2. renderOut ------------------------------------------------------------------------------->
  const renderOut = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_OUT[index]?.name.substring(0, 5)} ₩ ${Number(value).toLocaleString()}`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeIn = () => {
    const COLORS_IN = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_IN}
              cx={"50%"}
              cy={"50%"}
              label={renderIn}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_IN?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_IN[index % COLORS_IN.length]} />
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
  const chartNodeOut = () => {
    const COLORS_OUT = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_OUT}
              cx={"50%"}
              cy={"50%"}
              label={renderOut}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_OUT?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_OUT[index % COLORS_OUT.length]} />
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
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col lg={8} md={8} sm={6} xs={6}>
                <span className={"dash-title"}>오늘 수입/지출 항목별 비율</span>
              </Col>
              <Col lg={4} md={4} sm={6} xs={6}>
                <div className={"text-end"}>
                  <span className={`${LINE === "in" ? "text-primary" : "text-outline-primary"} dash-title-sub`} onClick={() => (setLINE("in"))}>
                    수입
                  </span>
                  <span className={`${LINE === "out" ? "text-danger" : "text-outline-danger"} dash-title-sub`} onClick={() => (setLINE("out"))}>
                    지출
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                {LINE === "in" ? chartNodeIn() : chartNodeOut()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
