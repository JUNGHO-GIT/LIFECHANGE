// DashPieWeek.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashPieWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (bar-week) (${PATH})`, "kcal"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_KCAL_DEFAULT = [
    {name:"", value: 100}
  ];
  const DASH_NUT_DEFAULT = [
    {name:"", value: 100}
  ];
  const [DASH_KCAL, setDASH_KCAL] = useState(DASH_KCAL_DEFAULT);
  const [DASH_NUT, setDASH_NUT] = useState(DASH_NUT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/dash/pie/week`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_KCAL(response.data.result.kcal.length > 0 ? response.data.result.kcal : DASH_KCAL_DEFAULT);
    setDASH_NUT(response.data.result.nut.length > 0 ? response.data.result.nut : DASH_NUT_DEFAULT);
  })()}, [user_id]);

  // 4-1. render ---------------------------------------------------------------------------------->
  const renderKcal = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill={"black"} textAnchor={"middle"} dominantBaseline={"central"}
      fontSize={"12"}>
        {`${DASH_KCAL[index]?.name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 4-2. render ---------------------------------------------------------------------------------->
  const renderNut = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill={"black"} textAnchor={"middle"} dominantBaseline={"central"}
      fontSize={"12"}>
        {`${DASH_NUT[index]?.name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeKcal = () => {
    const COLORS_KCAL = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <PieChart>
          <Pie
            data={DASH_KCAL}
            cx={"50%"}
            cy={"50%"}
            labelLine={false}
            label={renderKcal}
            outerRadius={80}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={10}
            onMouseEnter={(data, index) => {
              data.payload.opacity = 0.5;
            }}
            onMouseLeave={(data, index) => {
              data.payload.opacity = 1.0;
            }}
          >
            {DASH_KCAL?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_KCAL[index % COLORS_KCAL.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeNut = () => {
    const COLORS_NUT = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <PieChart>
          <Pie
            data={DASH_NUT}
            cx={"50%"}
            cy={"50%"}
            labelLine={false}
            label={renderNut}
            outerRadius={80}
            fill={"#8884d8"}
            dataKey={"value"}
            minAngle={10}
            onMouseEnter={(data, index) => {
              data.payload.opacity = 0.5;
            }}
            onMouseLeave={(data, index) => {
              data.payload.opacity = 1.0;
            }}
          >
            {DASH_NUT?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_NUT[index % COLORS_NUT.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <Row className={"d-center"}>
      <Col xs={6}>
        {chartNodeKcal()}
      </Col>
      <Col xs={6}>
        {chartNodeNut()}
      </Col>
    </Row>
  );
};
