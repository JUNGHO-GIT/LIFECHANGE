// MoneyDashAvg.tsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeAvg, set:setActiveAvg} = useStorage(
    `activeAvg(${PATH})`, ["수입", "지출"]
  );
  const {val:activeType, set:setActiveType} = useStorage(
    `activeType(${PATH})`, "week"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [DASH_WEEK, setDASH_WEEK] = useState([
    {name:"1주차", 수입: 0, 지출: 0},
    {name:"2주차", 수입: 0, 지출: 0},
    {name:"3주차", 수입: 0, 지출: 0},
    {name:"4주차", 수입: 0, 지출: 0},
    {name:"5주차", 수입: 0, 지출: 0}
  ]);
  const [DASH_MONTH, setDASH_MONTH] = useState([
    {name:"1월", 수입: 0, 지출: 0},
    {name:"2월", 수입: 0, 지출: 0},
    {name:"3월", 수입: 0, 지출: 0},
    {name:"4월", 수입: 0, 지출: 0},
    {name:"5월", 수입: 0, 지출: 0},
    {name:"6월", 수입: 0, 지출: 0},
    {name:"7월", 수입: 0, 지출: 0},
    {name:"8월", 수입: 0, 지출: 0},
    {name:"9월", 수입: 0, 지출: 0},
    {name:"10월", 수입: 0, 지출: 0},
    {name:"11월", 수입: 0, 지출: 0},
    {name:"12월", 수입: 0, 지출: 0}
  ]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const responseWeek = await axios.get(`${URL_MONEY}/dashAvgWeek`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_WEEK(responseWeek.data.result);

    const responseMonth = await axios.get(`${URL_MONEY}/dashAvgMonth`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_MONTH(responseMonth.data.result);

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

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartAvgWeek = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_WEEK);

    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DASH_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis
              type="number"
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            {activeAvg.includes("수입")
              && <Bar type="monotone" dataKey="수입" fill="#8884d8" minPointSize={1} />
            }
            {activeAvg.includes("지출")
              && <Bar type="monotone" dataKey="지출" fill="#ffc658" minPointSize={1} />
            }
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartAvgMonth = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_MONTH);

    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DASH_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis
              type="number"
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            {activeAvg.includes("수입")
              && <Bar type="monotone" dataKey="수입" fill="#8884d8" minPointSize={1} />
            }
            {activeAvg.includes("지출")
              && <Bar type="monotone" dataKey="지출" fill="#ffc658" minPointSize={1} />
            }
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableMoneyAvg = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          <button
            className={`btn ${activeType === "week" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => setActiveType("week")}
          >
            주간
          </button>
          &nbsp;&nbsp;
          <button
            className={`btn ${activeType === "month" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => setActiveType("month")}
          >
            월간
          </button>
          <div className="mt-10 mb-10">
            {["수입", "지출"]?.map((key, index) => (
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
        {activeType === "week" ? chartAvgWeek() : chartAvgMonth()}
      </div>
      <div className="col-3">
        {tableMoneyAvg()}
      </div>
    </div>
  );
};