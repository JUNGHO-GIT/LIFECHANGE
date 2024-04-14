// FoodDashBar.jsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Bar, Line, ComposedChart} from 'recharts';

// ------------------------------------------------------------------------------------------------>
export const FoodDashBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activePart, set:setActivePart} = useStorage(
    `activePart-bar (${PATH})`, "kcal"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_KCAL_DEFAULT = [
    {name:"칼로리", 목표: 0, 실제: 0},
  ];
  const DASH_NUT_DEFAULT = ([
    {name:"탄수화물", 목표: 0, 실제: 0},
    {name:"단백질", 목표: 0, 실제: 0},
    {name:"지방", 목표: 0, 실제: 0},
  ]);
  const [DASH_KCAL, setDASH_KCAL] = useState(DASH_KCAL_DEFAULT);
  const [DASH_NUT, setDASH_NUT] = useState(DASH_NUT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/dashBar`, {
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
    const maxValue = Math.max(...value?.map((item) => Math.max(item.목표, item.실제)));
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
  const chartBarKcal = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_KCAL);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={DASH_KCAL} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          <Line dataKey="목표" type="monotone" stroke="#ff7300" />
          <Bar dataKey="실제" type="monotone" fill="#8884d8" barSize={30} minPointSize={1} />
          <Tooltip />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartBarNut = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_NUT);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={DASH_NUT} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          <Line dataKey="목표" type="monotone" stroke="#ff7300" />
          <Bar dataKey="실제" type="monotone" fill="#8884d8" barSize={30} minPointSize={1} />
          <Tooltip />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableFoodAvg = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          <button
            className={`btn ${activePart === "kcal" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => (setActivePart("kcal"))}
          >
            칼로리
          </button>
          &nbsp;&nbsp;
          <button
            className={`btn ${activePart === "nut" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => (setActivePart("nut"))}
          >
            영양소
          </button>
        </tbody>
      </table>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="row d-center">
      <div className="col-9">
        {activePart === "kcal" ? chartBarKcal() : chartBarNut()}
      </div>
      <div className="col-3">
        {tableFoodAvg()}
      </div>
    </div>
  );
};
