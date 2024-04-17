// DashAvgWeek.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {BarChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Button, ButtonGroup, Table} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashAvgWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (avg-week) (${PATH})`, ["볼륨", "시간"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_VOLUME_DEFAULT = [
    {name:"", 볼륨: 0},
  ];
  const DASH_CARDIO_DEFAULT = [
    {name:"", 시간: 0},
  ];
  const [DASH_VOLUME, setDASH_VOLUME] = useState(DASH_VOLUME_DEFAULT);
  const [DASH_CARDIO, setDASH_CARDIO] = useState(DASH_CARDIO_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/dash/avg/week`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_VOLUME(response.data.result.volume || DASH_VOLUME_DEFAULT);
    setDASH_CARDIO(response.data.result.cardio || DASH_CARDIO_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.볼륨, item?.시간)));
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
  const chartNodeVolume = () => {
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

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeCardio = () => {
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
  const tableNode = () => {
    return (
      <ButtonGroup>
        <Button variant={`${LINE === "볼륨" ? "primary" : "outline-primary"}`} className={"me-5"}
          onClick={() => setLINE("볼륨")}>
          볼륨
        </Button>
        <Button variant={`${LINE === "시간" ? "primary" : "outline-primary"}`} className={"ms-5"}
          onClick={() => setLINE("시간")}>
          시간
        </Button>
      </ButtonGroup>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"row d-center"}>
      <div className={"col-9"}>
        {LINE === "볼륨" ? chartNodeVolume() : chartNodeCardio()}
      </div>
      <div className={"col-3"}>
        {tableNode()}
      </div>
    </div>
  );
};