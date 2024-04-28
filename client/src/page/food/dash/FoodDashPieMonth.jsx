// FoodDashPieMonth.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodDashPieMonth = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (bar-month) (${PATH})`, "kcal"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_NUT_DEFAULT = [
    {name:"", value: 100}
  ];
  const [OBJECT_KCAL, setOBJECT_KCAL] = useState(OBJECT_KCAL_DEFAULT);
  const [OBJECT_NUT, setOBJECT_NUT] = useState(OBJECT_NUT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/dash/pie/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_KCAL(response.data.result.kcal.length > 0 ? response.data.result.kcal : OBJECT_KCAL_DEFAULT);
    setOBJECT_NUT(response.data.result.nut.length > 0 ? response.data.result.nut : OBJECT_NUT_DEFAULT);
  })()}, [customer_id]);

  // 4-1. render ---------------------------------------------------------------------------------->
  const renderKcal = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 4-2. render ---------------------------------------------------------------------------------->
  const renderNut = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeKcal = () => {
    const COLORS_KCAL = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_KCAL}
              cx={"50%"}
              cy={"50%"}
              label={renderKcal}
              labelLine={false}
              outerRadius={120}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
              onMouseEnter={(data, index) => {
                data.payload.opacity = 0.5;
              }}
              onMouseLeave={(data, index) => {
                data.payload.opacity = 1.0;
              }}
            >
              {OBJECT_KCAL?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_KCAL[index % COLORS_KCAL.length]} />
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
  const chartNodeNut = () => {
    const COLORS_NUT = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_NUT}
              cx={"50%"}
              cy={"50%"}
              label={renderNut}
              labelLine={false}
              outerRadius={120}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
              onMouseEnter={(data, index) => {
                data.payload.opacity = 0.5;
              }}
              onMouseLeave={(data, index) => {
                data.payload.opacity = 1.0;
              }}
            >
              {OBJECT_NUT?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_NUT[index % COLORS_NUT.length]} />
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
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col lg={6} md={6} sm={12} xs={12}>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <span className={"dash-title"}>월간 칼로리 비율</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    {chartNodeKcal()}
                  </Col>
                </Row>
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <span className={"dash-title"}>월간 영양소 비율</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    {chartNodeNut()}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
