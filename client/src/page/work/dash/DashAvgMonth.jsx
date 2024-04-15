// DashAvgWeek.tsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const DashAvgWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activePart, set:setActivePart} = useStorage(
    `activePart-avg (${PATH})`, "볼륨"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_VOLUME_DEFAULT = [
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
  ];
  const DASH_CARDIO_DEFAULT = [
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
  ];
  const [DASH_VOLUME, setDASH_VOLUME] = useState(DASH_VOLUME_DEFAULT);
  const [DASH_CARDIO, setDASH_CARDIO] = useState(DASH_CARDIO_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/dash/avg/month`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_VOLUME(response.data.result.volume);
    setDASH_CARDIO(response.data.result.cardio);
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

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartVolume = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_VOLUME);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH_VOLUME} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
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
  const chartCardio = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_CARDIO);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH_CARDIO} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
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
        {activePart === "볼륨" ? chartVolume() : chartCardio()}
      </div>
      <div className={"col-3"}>
        {tableWorkAvg()}
      </div>
    </div>
  );
};