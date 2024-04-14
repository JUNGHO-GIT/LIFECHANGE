// FoodDashPie.jsx

import React, {useEffect, useState} from "react";
import axios from "axios";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const FoodDashPie = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"Empty", value: 100}
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/dashPie`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result.length > 0 ? response.data.result : DASH_DEFAULT);
  })()}, [user_id]);

  // 4. render ------------------------------------------------------------------------------------>
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize="12">
        {`${DASH[index].name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartSleepPieIn = () => {
    const COLORS_IN = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={DASH}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            minAngle={10}
            onMouseEnter={(data, index) => {
              data.payload.opacity = 0.5;
            }}
            onMouseLeave={(data, index) => {
              data.payload.opacity = 1.0;
            }}
          >
            {DASH.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_IN[index % COLORS_IN.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="row d-center">
      <div className="col-6">
        {chartSleepPieIn()}
      </div>
    </div>
  );
};
