// SleepDashLine.jsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Line, LineChart} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const SleepDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeLine, set:setActiveLine} = useStorage(
    `activeLine(${PATH})`, ["취침", "수면", "기상"]
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"월", 취침: 0, 수면: 0, 기상: 0},
    {name:"화", 취침: 0, 수면: 0, 기상: 0},
    {name:"수", 취침: 0, 수면: 0, 기상: 0},
    {name:"목", 취침: 0, 수면: 0, 기상: 0},
    {name:"금", 취침: 0, 수면: 0, 기상: 0},
    {name:"토", 취침: 0, 수면: 0, 기상: 0},
    {name:"일", 취침: 0, 수면: 0, 기상: 0}
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/dashLine`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartLine = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="name" />
          <YAxis
            type="number"
            domain={[0, 30]}
            ticks={[0, 6, 12, 18, 24, 30]}
            tickFormatter={(tick) => {
              if (tick > 24) {
                return `0${tick - 24}`;
              }
              else {
                return tick;
              }
            }}
          />
          {activeLine.includes("취침")
            && <Line type="monotone" dataKey="취침" stroke="#8884d8" activeDot={{ r: 8 }} />
          }
          {activeLine.includes("기상")
            && <Line type="monotone" dataKey="기상" stroke="#ffc658" />
          }
          {activeLine.includes("수면")
            && <Line type="monotone" dataKey="수면" stroke="#82ca9d" />
          }
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableSleepLine = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          <div className="mt-10 mb-10">
            {["취침", "수면", "기상"]?.map((key, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={activeLine.includes(key)}
                  onChange={() => {
                    if (activeLine.includes(key)) {
                      setActiveLine(activeLine?.filter((item) => item !== key));
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
        {chartLine()}
      </div>
      <div className="col-3">
        {tableSleepLine()}
      </div>
    </div>
  );
};
