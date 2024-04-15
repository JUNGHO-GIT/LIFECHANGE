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
    `activeLine-line (${PATH})`, ["탄수화물", "단백질", "지방"]
  );
  const {val:activePart, set:setActivePart} = useStorage(
    `activePart-line (${PATH})`, "kcal"
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const DASH_KCAL_DEFAULT = [
    {name:"월", 칼로리: 0},
    {name:"화", 칼로리: 0},
    {name:"수", 칼로리: 0},
    {name:"목", 칼로리: 0},
    {name:"금", 칼로리: 0},
    {name:"토", 칼로리: 0},
    {name:"일", 칼로리: 0},
  ];
  const DASH_NUT_DEFAULT = [
    {name:"월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"화", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"수", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"목", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"금", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"토", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"일", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const [DASH_KCAL, setDASH_KCAL] = useState(DASH_KCAL_DEFAULT);
  const [DASH_NUT, setDASH_NUT] = useState(DASH_NUT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/dash/line`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_KCAL(response.data.result.kcal || DASH_KCAL_DEFAULT);
    setDASH_NUT(response.data.result.nut || DASH_NUT_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.칼로리, item?.탄수화물, item?.단백질, item?.지방)));
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

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartLineKcal = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_KCAL);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={DASH_KCAL} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="name" />
          <YAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          <Line type="monotone" dataKey="칼로리" stroke="#8884d8" activeDot={{r: 8}} />
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartLineNut = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_NUT);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={DASH_NUT} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="name" />
          <YAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          {activeLine.includes("탄수화물")
            && <Line type="monotone" dataKey="탄수화물" stroke="#82ca9d" activeDot={{r: 8}} />
          }
          {activeLine.includes("단백질")
            && <Line type="monotone" dataKey="단백질" stroke="#ff7300" activeDot={{r: 8}} />
          }
          {activeLine.includes("지방")
            && <Line type="monotone" dataKey="지방" stroke="#ffc658" activeDot={{r: 8}} />
          }
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableFoodLine = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          <button
            className={`btn ${activePart === "kcal" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => (setActivePart("kcal"))}
          >
            칼로리
          </button>
          <button
            className={`btn ${activePart === "nut" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => (setActivePart("nut"))}
          >
            영양소
          </button>
          <div className="mt-10 mb-10">
            {["탄수화물", "단백질", "지방"]?.map((key, index) => (
              <div key={index}>
                <input
                  type="checkbox"
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
    <div className="row d-center">
      <div className="col-9">
        {activePart === "kcal" ? chartLineKcal() : chartLineNut()}
      </div>
      <div className="col-3">
        {tableFoodLine()}
      </div>
    </div>
  );
};
