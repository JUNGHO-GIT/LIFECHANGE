// WorkDashScatter.jsx

import React, {useEffect, useState} from "react";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Scatter, ComposedChart} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const WorkDashScatter = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"체중", 목표: 0, 실제: 0},
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/dash/scatter`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.목표, item?.실제)));
    let topValue = Math.ceil(maxValue / 100) * 100;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 100;
    if (topValue > 500) {
      tickInterval = 500;
    }
    else if (topValue > 100) {
      tickInterval = 100;
    }
    for (let i = 0; i <= topValue; i += tickInterval) {
      ticks.push(i);
    }
    return {
      domain: [0, topValue],
      ticks: ticks,
      tickFormatter: (tick) => (`${Number((tick).toFixed(1))}`)
    };
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartBar = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH);

    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <ComposedChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={"name"} />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          <Scatter name={"목표"} dataKey={"목표"} fill={"#8884d8"} />
          <Scatter name={"실제"} dataKey={"실제"} fill={"#82ca9d"} />
          <Tooltip />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"row d-center"}>
      <div className={"col-12"}>
        {chartBar()}
      </div>
    </div>
  );
};
