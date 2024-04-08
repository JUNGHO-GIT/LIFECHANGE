// Dash.tsx

import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/js/useStorage.jsx";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const DashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:activeAvg, set:setActiveAvg} = useStorage(
    `activeAvg(${PATH})`, ["취침", "수면", "기상"]
  );
  const {val:activeType, set:setActiveType} = useStorage(
    `activeType(${PATH})`, "week"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [DASH_WEEK, setDASH_WEEK] = useState([
    {name:"1주차", 취침: 0, 수면: 0, 기상: 0},
    {name:"2주차", 취침: 0, 수면: 0, 기상: 0},
    {name:"3주차", 취침: 0, 수면: 0, 기상: 0},
    {name:"4주차", 취침: 0, 수면: 0, 기상: 0},
    {name:"5주차", 취침: 0, 수면: 0, 기상: 0}
  ]);
  const [DASH_MONTH, setDASH_MONTH] = useState([
    {name:"1월", 취침: 0, 수면: 0, 기상: 0},
    {name:"2월", 취침: 0, 수면: 0, 기상: 0},
    {name:"3월", 취침: 0, 수면: 0, 기상: 0},
    {name:"4월", 취침: 0, 수면: 0, 기상: 0},
    {name:"5월", 취침: 0, 수면: 0, 기상: 0},
    {name:"6월", 취침: 0, 수면: 0, 기상: 0},
    {name:"7월", 취침: 0, 수면: 0, 기상: 0},
    {name:"8월", 취침: 0, 수면: 0, 기상: 0},
    {name:"9월", 취침: 0, 수면: 0, 기상: 0},
    {name:"10월", 취침: 0, 수면: 0, 기상: 0},
    {name:"11월", 취침: 0, 수면: 0, 기상: 0},
    {name:"12월", 취침: 0, 수면: 0, 기상: 0}
  ]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const responseWeek = await axios.get(`${URL_SLEEP}/dashAvgWeek`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_WEEK(responseWeek.data.result);

    const responseMonth = await axios.get(`${URL_SLEEP}/dashAvgMonth`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_MONTH(responseMonth.data.result);

  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartSleepAvgWeek = () => {
    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DASH_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis
              type="number"
              domain={[0, 30]}
              ticks={[0, 6, 12, 18, 24, 30]}
              tickFormatter={(tick) => {
                return tick > 24 ? tick -= 24 : tick;
              }}
            />
            {activeAvg.includes("취침")
              && <Bar type="monotone" dataKey="취침" fill="#8884d8" />
            }
            {activeAvg.includes("기상")
              && <Bar type="monotone" dataKey="기상" fill="#82ca9d" />
            }
            {activeAvg.includes("수면")
              && <Bar type="monotone" dataKey="수면" fill="#ffc658" />
            }
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartSleepAvgMonth = () => {
    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={DASH_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" />
            <YAxis
              type="number"
              domain={[0, 30]}
              ticks={[0, 6, 12, 18, 24, 30]}
              tickFormatter={(tick) => {
                return tick > 24 ? tick -= 24 : tick;
              }}
            />
            {activeAvg.includes("취침")
              && <Bar type="monotone" dataKey="취침" fill="#8884d8" />
            }
            {activeAvg.includes("기상")
              && <Bar type="monotone" dataKey="기상" fill="#82ca9d" />
            }
            {activeAvg.includes("수면")
              && <Bar type="monotone" dataKey="수면" fill="#ffc658" />
            }
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableSleepAvg = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          <button
            className={`
              btn ${activeType === "week" ? "btn-primary" : "btn-outline-primary"}
              mt-10
            `}
            onClick={() => setActiveType("week")}
          >
            주간
          </button>
          &nbsp;&nbsp;
          <button
            className={`
              btn ${activeType === "month" ? "btn-primary" : "btn-outline-primary"}
              mt-10
            `}
            onClick={() => setActiveType("month")}
          >
            월간
          </button>
          <div className="mt-10 mb-10">
            {["취침", "수면", "기상"].map((key, index) => (
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
        {activeType === "week" ? chartSleepAvgWeek() : chartSleepAvgMonth()}
      </div>
      <div className="col-3">
        {tableSleepAvg()}
      </div>
    </div>
  );
};