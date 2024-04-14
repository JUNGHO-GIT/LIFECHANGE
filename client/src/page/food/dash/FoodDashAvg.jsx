// FoodDashAvg.tsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const FoodDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeAvg, set:setActiveAvg} = useStorage(
    `activeAvg-avg (${PATH})`, ["탄수화물", "단백질", "지방"]
  );
  const {val:activeType, set:setActiveType} = useStorage(
    `activeType-avg (${PATH})`, "week"
  );
  const {val:activePart, set:setActivePart} = useStorage(
    `activePart-avg (${PATH})`, "kcal"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [DASH_KCAL_WEEK, setDASH_KCAL_WEEK] = useState([
    {name:"1주차", 칼로리: 0},
    {name:"2주차", 칼로리: 0},
    {name:"3주차", 칼로리: 0},
    {name:"4주차", 칼로리: 0},
    {name:"5주차", 칼로리: 0},
  ]);
  const [DASH_KCAL_MONTH, setDASH_KCAL_MONTH] = useState([
    {name:"1월", 칼로리: 0},
    {name:"2월", 칼로리: 0},
    {name:"3월", 칼로리: 0},
    {name:"4월", 칼로리: 0},
    {name:"5월", 칼로리: 0},
    {name:"6월", 칼로리: 0},
    {name:"7월", 칼로리: 0},
    {name:"8월", 칼로리: 0},
    {name:"9월", 칼로리: 0},
    {name:"10월", 칼로리: 0},
    {name:"11월", 칼로리: 0},
    {name:"12월", 칼로리: 0}
  ]);
  const [DASH_NUT_WEEK, setDASH_NUT_WEEK] = useState([
    {name:"1주차", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"2주차", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"3주차", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"4주차", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"5주차", 탄수화물: 0, 단백질: 0, 지방: 0},
  ]);
  const [DASH_NUT_MONTH, setDASH_NUT_MONTH] = useState([
    {name:"1월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"2월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"3월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"4월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"5월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"6월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"7월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"8월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"9월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"10월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"11월", 탄수화물: 0, 단백질: 0, 지방: 0},
    {name:"12월", 탄수화물: 0, 단백질: 0, 지방: 0}
  ]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseWeek = await axios.get(`${URL_FOOD}/dashAvgWeek`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_KCAL_WEEK(responseWeek.data.result.kcal);
    setDASH_NUT_WEEK(responseWeek.data.result.nut);

    const responseMonth = await axios.get(`${URL_FOOD}/dashAvgMonth`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_KCAL_MONTH(responseMonth.data.result.kcal);
    setDASH_NUT_MONTH(responseMonth.data.result.nut);

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
  const chartWeekKcal = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_KCAL_WEEK);

    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DASH_KCAL_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis
              type="number"
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            <Bar type="monotone" dataKey="칼로리" fill="#8884d8" minPointSize={1} />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartWeekNut = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_NUT_WEEK);

    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DASH_NUT_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis
              type="number"
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            {activeAvg.includes("탄수화물")
              && <Bar type="monotone" dataKey="탄수화물" fill="#ffc658" minPointSize={1} />
            }
            {activeAvg.includes("단백질")
              && <Bar type="monotone" dataKey="단백질" fill="#82ca9d" minPointSize={1} />
            }
            {activeAvg.includes("지방")
              && <Bar type="monotone" dataKey="지방" fill="#ff7300" minPointSize={1} />
            }
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartMonthKcal = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_KCAL_MONTH);

    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DASH_KCAL_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis
              type="number"
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            <Bar type="monotone" dataKey="칼로리" fill="#8884d8" minPointSize={1} />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartMonthNut = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_NUT_MONTH);

    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DASH_NUT_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis
              type="number"
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            {activeAvg.includes("탄수화물")
              && <Bar type="monotone" dataKey="탄수화물" fill="#ffc658" minPointSize={1} />
            }
            {activeAvg.includes("단백질")
              && <Bar type="monotone" dataKey="단백질" fill="#82ca9d" minPointSize={1} />
            }
            {activeAvg.includes("지방")
              && <Bar type="monotone" dataKey="지방" fill="#ff7300" minPointSize={1} />
            }
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableFoodAvg = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          <button
            className={`btn ${activeType === "week" ? "btn-primary" : "btn-outline-primary"} mt-10 me-5`}
            onClick={() => setActiveType("week")}
          >
            주간
          </button>
          <button
            className={`btn ${activeType === "month" ? "btn-primary" : "btn-outline-primary"} mt-10 ms-5`}
            onClick={() => setActiveType("month")}
          >
            월간
          </button>
          <br />
          <button
            className={`btn ${activePart === "kcal" ? "btn-primary" : "btn-outline-primary"} mt-10 me-5`}
            onClick={() => (setActivePart("kcal"))}
          >
            칼로리
          </button>
          <button
            className={`btn ${activePart === "nut" ? "btn-primary" : "btn-outline-primary"} mt-10 ms-5`}
            onClick={() => (setActivePart("nut"))}
          >
            영양소
          </button>
          <div className="mt-10 mb-10">
            {["탄수화물", "단백질", "지방"]?.map((key, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={activeAvg.includes(key)}
                  onChange={() => {
                    if (activeAvg.includes(key)) {
                      setActiveAvg(activeAvg.filter((item) => item !== key));
                    }
                    else {
                      setActiveAvg([...activeAvg, key]);
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
        {activePart === "kcal" && activeType === "week" ? chartWeekKcal() : null}
        {activePart === "nut" && activeType === "week" ? chartWeekNut() : null}
        {activePart === "kcal" && activeType === "month" ? chartMonthKcal() : null}
        {activePart === "nut" && activeType === "month" ? chartMonthNut() : null}
      </div>
      <div className="col-3">
        {tableFoodAvg()}
      </div>
    </div>
  );
};