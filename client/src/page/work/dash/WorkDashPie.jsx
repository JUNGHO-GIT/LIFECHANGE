// WorkDashPie.jsx

import React, {useEffect, useState} from "react";
import axios from "axios";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const WorkDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_PART_DEFAULT = [
    {name:"Empty", value: 100}
  ];
  const DASH_TITLE_DEFAULT = [
    {name:"Empty", value: 100}
  ];
  const [DASH_PART, setDASH_PART] = useState(DASH_PART_DEFAULT);
  const [DASH_TITLE, setDASH_TITLE] = useState(DASH_TITLE_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/dash/pie`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_PART(response.data.result.part.length > 0 ? response.data.result.part : DASH_PART_DEFAULT);
    setDASH_TITLE(response.data.result.title.length > 0 ? response.data.result.title : DASH_TITLE_DEFAULT);
  })()}, [user_id]);

  // 4-1. renderIn -------------------------------------------------------------------------------->
  const renderIn = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill={"black"} textAnchor={"middle"} dominantBaseline={"central"}
      fontSize={"12"}>
        {`${DASH_PART[index].name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 4-2. renderOut ------------------------------------------------------------------------------->
  const renderOut = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill={"black"} textAnchor={"middle"} dominantBaseline={"central"}
      fontSize={"12"}>
        {`${DASH_TITLE[index].name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartPieIn = () => {
    const COLORS_PART = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <PieChart>
          <Pie
            data={DASH_PART}
            cx={"50%"}
            cy={"50%"}
            labelLine={false}
            label={renderIn}
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
            {DASH_PART?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_PART[index % COLORS_PART.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartPieOut = () => {
    const COLORS_TITLE = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <PieChart>
          <Pie
            data={DASH_TITLE}
            cx={"50%"}
            cy={"50%"}
            labelLine={false}
            label={renderOut}
            outerRadius={80}
            fill={"#8884d8"}
            dataKey={"value"}
            onMouseEnter={(data, index) => {
              data.payload.opacity = 0.5;
            }}
            onMouseLeave={(data, index) => {
              data.payload.opacity = 1.0;
            }}
          >
            {DASH_TITLE?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_TITLE[index % COLORS_TITLE.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"row d-center"}>
      <div className={"col-6"}>
        {chartPieIn()}
      </div>
      <div className={"col-6"}>
        {chartPieOut()}
      </div>
    </div>
  );
};