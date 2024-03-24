// Dash.tsx

import React, {useState} from "react";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";
import {LineChart, Line} from "recharts";
import {ComposedChart, Area} from 'recharts';

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  const barChartData = [
    {
      name: "취침 시간",
      목표: 23,
      실제: 22,
    },
    {
      name: "수면 시간",
      목표: 8,
      실제: 7,
    },
    {
      name: "기상 시간",
      목표: 7,
      실제: 6.5,
    },
  ];

  const lineChartData = [
    { day: "월요일", 취침시간: 23, 수면시간: 7, 기상시간: 7 },
    { day: "화요일", 취침시간: 22, 수면시간: 6.5, 기상시간: 6.5 },
    { day: "수요일", 취침시간: 23.5, 수면시간: 8, 기상시간: 7 },
    { day: "목요일", 취침시간: 22, 수면시간: 7, 기상시간: 6 },
    { day: "금요일", 취침시간: 24, 수면시간: 6, 기상시간: 7 },
    { day: "토요일", 취침시간: 23, 수면시간: 8, 기상시간: 8 },
    { day: "일요일", 취침시간: 22, 수면시간: 7.5, 기상시간: 7.5 },
  ];

  const avgChartData = [
    { name: "1월", 취침시간: 23, 수면시간: 7.5, 기상시간: 7.5 },
    { name: "2월", 취침시간: 21.5, 수면시간: 7, 기상시간: 6.5 },
    { name: "3월", 취침시간: 22, 수면시간: 9, 기상시간: 8 }
  ];

  //@ts-ignore
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const diff = ((payload[1].value / payload[0].value) * 100 - 100).toFixed(2);
      return (
        <div className="custom-tooltip" style={{ backgroundColor: "#ffff", padding: "5px", border: "1px solid #cccc" }}>
          <p className="label">{`${diff}%`}</p>
        </div>
      );
    }
    return null;
  };

  //@ts-ignore
  const SuccessIndicator = ({ target, actual }) => {
    const isSuccess = actual >= target;
    return (
      <div style={{ color: isSuccess ? "green" : "red" }}>
        {isSuccess ? "✔" : "✘"}
      </div>
    );
  };

  // 커스텀 레전드 컴포넌트 ----------------------------------------------------------------------->
  const [activeKeys, setActiveKeys] = useState(["취침시간", "수면시간", "기상시간"]);

  return (
    <div className="root-wrapper">
      <div className="container">
        {/** today **/}
        <div className="container-wrapper mb-10">
          <div className="row d-center">
            <div className="col-8">
              <h1 className="ms-50 mb-10 fw-7 text-start">Today Sleep Data</h1>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                  <Legend />
                  <Bar dataKey="목표" fill="#8884d8" />
                  <Bar dataKey="실제" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="col-4">
              {barChartData.map((item, index) => (
                <div key={index}>
                  {item.name} - 목표: {item.목표}, 실제: {item.실제} <SuccessIndicator target={item.목표} actual={item.실제} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/** week **/}
        <div className="container-wrapper mb-10">
          <div className="row d-center">
            <div className="col-10">
              <h1 className="ms-50 mb-10 fw-7 text-start">Weekly Sleep Data</h1>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={lineChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {activeKeys.includes("취침시간") && <Line type="monotone" dataKey="취침시간" stroke="#8884d8" activeDot={{ r: 8 }} />}
                  {activeKeys.includes("수면시간") && <Line type="monotone" dataKey="수면시간" stroke="#82ca9d" />}
                  {activeKeys.includes("기상시간") && <Line type="monotone" dataKey="기상시간" stroke="#ffc658" />}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="col-2">
              {["취침시간", "수면시간", "기상시간"].map((key, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    checked={activeKeys.includes(key)}
                    onChange={() => {
                      if (activeKeys.includes(key)) {
                        setActiveKeys(activeKeys.filter((item) => item !== key));
                      }
                      else {
                        setActiveKeys([...activeKeys, key]);
                      }
                    }}
                  />
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/** average **/}
        <div className="container-wrapper mb-10">
          <div className="row d-center">
            <h1 className="ms-50 mb-10 fw-7 text-start">Average Sleep Data</h1>
            <div className="col-12">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                  width={500}
                  height={400}
                  data={avgChartData}
                  margin={{
                    top: 20,
                    right: 80,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="name" label={{ value: 'Pages', position: 'insideBottomRight', offset: 0 }} scale="band" />
                  <YAxis label={{ value: 'Index', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="취침시간" barSize={20} fill="#413ea0" />
                  <Line type="monotone" dataKey="수면시간" stroke="#ff7300" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
