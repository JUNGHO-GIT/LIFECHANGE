// MoneyDashLine.jsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Line, LineChart} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeLine, set:setActiveLine} = useStorage(
    `activeLine-line (${PATH})`, ["수입", "지출"]
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"월", 수입: 0, 지출: 0},
    {name:"화", 수입: 0, 지출: 0},
    {name:"수", 수입: 0, 지출: 0},
    {name:"목", 수입: 0, 지출: 0},
    {name:"금", 수입: 0, 지출: 0},
    {name:"토", 수입: 0, 지출: 0},
    {name:"일", 수입: 0, 지출: 0},
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/dash/line`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.수입, item?.지출)));
    let topValue = Math.ceil(maxValue / 1000) * 1000;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 1000;
    if (topValue > 5000) {
      tickInterval = 5000;
    }
    else if (topValue > 1000) {
      tickInterval = 1000;
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

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartLine = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH);

    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type={"category"} dataKey={"name"} />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          {activeLine.includes("수입")
            && <Line type={"monotone"} dataKey={"수입"} stroke="#8884d8" activeDot={{r: 8}} />
          }
          {activeLine.includes("지출")
            && <Line type={"monotone"} dataKey={"지출"} stroke="#82ca9d" activeDot={{r: 8}} />
          }
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableMoneyLine = () => {
    return (
      <table className={"table bg-white border"}>
        <tbody>
          <div className={"mt-10 mb-10"}>
            {["수입", "지출"]?.map((key, index) => (
              <div key={index}>
                <input
                  type={"checkbox"}
                  checked={activeLine.includes(key)}
                  onChange={() => {
                    if (activeLine.includes(key)) {
                      setActiveLine(activeLine?.filter((item) => (item !== key)));
                    }
                    else {
                      setActiveLine([...activeLine, key]);
                    }
                  }}
                />
                {key}
              </div>
            ))}
          </div>
        </tbody>
      </table>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"row d-center"}>
      <div className={"col-9"}>
        {chartLine()}
      </div>
      <div className={"col-3"}>
        {tableMoneyLine()}
      </div>
    </div>
  );
};
