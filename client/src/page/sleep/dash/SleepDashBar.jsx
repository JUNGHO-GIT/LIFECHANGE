// SleepDashBar.jsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Bar, Line, ComposedChart} from 'recharts';

// ------------------------------------------------------------------------------------------------>
export const SleepDashBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"취침", 목표: 0, 실제: 0},
    {name:"수면", 목표: 0, 실제: 0},
    {name:"기상", 목표: 0, 실제: 0}
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/dashBar`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartBar = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            type="number"
            domain={[0, 30]}
            ticks={[0, 6, 12, 18, 24, 30]}
            tickFormatter={(tick) => {
              return tick > 24 ? tick -= 24 : tick;
            }}
          />
          <Line dataKey="목표" type="monotone" stroke="#ff7300" />
          <Bar dataKey="실제" type="monotone" fill="#8884d8" barSize={30} />
          <Tooltip />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="row d-center">
      <div className="col-12">
        {chartBar()}
      </div>
    </div>
  );
};
