// FoodDashLine.jsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Line, LineChart} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const FoodDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeLine, set:setActiveLine} = useStorage(
    `activeLine(${PATH})`, ["칼로리", "탄수화물", "단백질", "지방"]
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"월", 칼로리: 0, 단백질: 0, 지방: 0, 탄수화물: 0},
    {name:"화", 칼로리: 0, 단백질: 0, 지방: 0, 탄수화물: 0},
    {name:"수", 칼로리: 0, 단백질: 0, 지방: 0, 탄수화물: 0},
    {name:"목", 칼로리: 0, 단백질: 0, 지방: 0, 탄수화물: 0},
    {name:"금", 칼로리: 0, 단백질: 0, 지방: 0, 탄수화물: 0},
    {name:"토", 칼로리: 0, 단백질: 0, 지방: 0, 탄수화물: 0},
    {name:"일", 칼로리: 0, 단백질: 0, 지방: 0, 탄수화물: 0},
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/dashLine`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item.수입, item.지출)));
    let topValue = Math.ceil(maxValue / 100000) * 100000;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 100000;
    if (topValue > 5000000) {
      tickInterval = 1000000;
    }
    else if (topValue > 1000000) {
      tickInterval = 500000;
    }
    for (let i = 0; i <= topValue; i += tickInterval) {
      ticks.push(i);
    }
    return {
      domain: [0, topValue],
      ticks: ticks,
      tickFormatter: (tick) => (`${Number((tick / 1000000).toFixed(1))}M`)
    };
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartFoodLine = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="name" />
          <YAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          {activeLine.includes("칼로리")
            && <Line type="monotone" dataKey="칼로리" stroke="#8884d8" activeDot={{r: 8}} />
          }
          {activeLine.includes("탄수화물")
            && <Line type="monotone" dataKey="탄수화물" stroke="#82ca9d" activeDot={{r: 8}} />
          }
          {activeLine.includes("단백질")
            && <Line type="monotone" dataKey="단백질" stroke="#ff7300" activeDot={{r: 8}} />
          }
          {activeLine.includes("지방")
            && <Line type="monotone" dataKey="지방" stroke="#ff7300" activeDot={{r: 8}} />
          }
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableFoodLine = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          <div className="mt-10 mb-10">
            {["칼로리", "탄수화물", "단백질", "지방"].map((key, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={activeLine.includes(key)}
                  onChange={() => {
                    if (activeLine.includes(key)) {
                      setActiveLine(activeLine.filter((item) => (item !== key)));
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
    <div className="row d-center">
      <div className="col-9">
        {chartFoodLine()}
      </div>
      <div className="col-3">
        {tableFoodLine()}
      </div>
    </div>
  );
};
