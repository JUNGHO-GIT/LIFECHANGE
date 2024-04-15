// WorkDashAvg.tsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const WorkDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeType, set:setActiveType} = useStorage(
    `activeType-avg (${PATH})`, "week"
  );
  const {val:activePart, set:setActivePart} = useStorage(
    `activePart-avg (${PATH})`, "볼륨"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [DASH_VOLUME_WEEK, setDASH_VOLUME_WEEK] = useState([
    {name:"1주차", 볼륨: 0},
    {name:"2주차", 볼륨: 0},
    {name:"3주차", 볼륨: 0},
    {name:"4주차", 볼륨: 0},
    {name:"5주차", 볼륨: 0},
  ]);
  const [DASH_VOLUME_MONTH, setDASH_VOLUME_MONTH] = useState([
    {name:"1월", 볼륨: 0},
    {name:"2월", 볼륨: 0},
    {name:"3월", 볼륨: 0},
    {name:"4월", 볼륨: 0},
    {name:"5월", 볼륨: 0},
    {name:"6월", 볼륨: 0},
    {name:"7월", 볼륨: 0},
    {name:"8월", 볼륨: 0},
    {name:"9월", 볼륨: 0},
    {name:"10월", 볼륨: 0},
    {name:"11월", 볼륨: 0},
    {name:"12월", 볼륨: 0},
  ]);
  const [DASH_CARDIO_WEEK, setDASH_CARDIO_WEEK] = useState([
    {name:"1주차", 시간: 0},
    {name:"2주차", 시간: 0},
    {name:"3주차", 시간: 0},
    {name:"4주차", 시간: 0},
    {name:"5주차", 시간: 0},
  ]);
  const [DASH_CARDIO_MONTH, setDASH_CARDIO_MONTH] = useState([
    {name:"1월", 시간: 0},
    {name:"2월", 시간: 0},
    {name:"3월", 시간: 0},
    {name:"4월", 시간: 0},
    {name:"5월", 시간: 0},
    {name:"6월", 시간: 0},
    {name:"7월", 시간: 0},
    {name:"8월", 시간: 0},
    {name:"9월", 시간: 0},
    {name:"10월", 시간: 0},
    {name:"11월", 시간: 0},
    {name:"12월", 시간: 0},
  ]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseWeek = await axios.get(`${URL_WORK}/dash/avgWeek`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_VOLUME_WEEK(responseWeek.data.result.volume);
    setDASH_CARDIO_WEEK(responseWeek.data.result.cardio);

    const responseMonth = await axios.get(`${URL_WORK}/dash/avgMonth`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_VOLUME_MONTH(responseMonth.data.result.volume);
    setDASH_CARDIO_MONTH(responseMonth.data.result.cardio);

  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.횟수, item?.볼륨, item?.시간)));
    let topValue = Math.ceil(maxValue / 10) * 10;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 10;
    if (topValue > 50) {
      tickInterval = 50;
    }
    else if (topValue > 10) {
      tickInterval = 10;
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
  const chartWeekVolume = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_VOLUME_WEEK);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH_VOLUME_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type={"category"} dataKey={"name"} />
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            <Bar type={"monotone"} dataKey={"볼륨"} fill={"#82ca9d"} minPointSize={1} />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartWeekCardio = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_CARDIO_WEEK);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH_CARDIO_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type={"category"} dataKey={"name"} />
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            <Bar type={"monotone"} dataKey={"시간"} fill={"#ffc658"} minPointSize={1} />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartMonthVolume = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_VOLUME_MONTH);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH_VOLUME_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type={"category"} dataKey={"name"} />
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            <Bar type={"monotone"} dataKey={"볼륨"} fill={"#82ca9d"} minPointSize={1} />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartMonthCardio = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_CARDIO_MONTH);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH_CARDIO_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type={"category"} dataKey={"name"} />
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            <Bar type={"monotone"} dataKey={"시간"} fill={"#ffc658"} minPointSize={1} />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableWorkAvg = () => {
    return (
      <table className={"table bg-white border"}>
        <tbody>
          <button
            className={`btn ${activeType === "week" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => setActiveType("week")}
          >
            주간
          </button>
          <button
            className={`btn ${activeType === "month" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => setActiveType("month")}
          >
            월간
          </button>
          <br />
          <button
            className={`btn ${activePart === "볼륨" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => setActivePart("볼륨")}
          >
            볼륨
          </button>
          <button
            className={`btn ${activePart === "시간" ? "btn-primary" : "btn-outline-primary"} mt-10`}
            onClick={() => setActivePart("시간")}
          >
            시간
          </button>
        </tbody>
      </table>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"row d-center"}>
      <div className={"col-9"}>
        {activeType === "week" && activePart === "볼륨" && chartWeekVolume()}
        {activeType === "week" && activePart === "시간" && chartWeekCardio()}
        {activeType === "month" && activePart === "볼륨" && chartMonthVolume()}
        {activeType === "month" && activePart === "시간" && chartMonthCardio()}
      </div>
      <div className={"col-3"}>
        {tableWorkAvg()}
      </div>
    </div>
  );
};