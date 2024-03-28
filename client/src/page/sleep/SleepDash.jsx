// Dash.jsx

import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";
import {LineChart, Line} from "recharts";
import {ComposedChart} from 'recharts';
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [activeLine, setActiveLine] = useState(["취침", "수면", "기상"]);
  const [activeAvg, setActiveAvg] = useState(["취침", "수면", "기상"]);
  const [avgChartData, setAvgChartData] = useState("real");
  const [type, setType] = useState("day");

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST_BAR, setVal:setSLEEP_LIST_BAR} = useStorage(
    `sleepListBar(${type})`, [{
      _id: "",
      sleep_day: "0000-00-00",
      sleep_start_real: "00:00",
      sleep_end_real: "00:00",
      sleep_time_real: "00:00",
      sleep_start_plan: "00:00",
      sleep_end_plan: "00:00",
      sleep_time_plan: "00:00",
    }]
  );
  const {val:SLEEP_LIST_LINE, setVal:setSLEEP_LIST_LINE} = useStorage(
    `sleepListLine(${type})`, [{
      _id: "",
      sleep_day: "0000-00-00",
      sleep_start_real: "00:00",
      sleep_end_real: "00:00",
      sleep_time_real: "00:00",
      sleep_start_plan: "00:00",
      sleep_end_plan: "00:00",
      sleep_time_plan: "00:00",
    }]
  );
  const {val:SLEEP_LIST_AVG, setVal:setSLEEP_LIST_AVG} = useStorage(
    `sleepListAvg(${type})`, {
      name: "",
      avg_start_real: "00:00",
      avg_end_real: "00:00",
      avg_time_real: "00:00",
      avg_start_plan: "00:00",
      avg_end_plan: "00:00",
      avg_time_plan: "00:00",
    }
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/sleepDash`, {
      params: {
        user_id: user_id,
      },
    });
    setSLEEP_LIST_BAR(response.data.listArray.todayList);
    setSLEEP_LIST_LINE(response.data.listArray.weekList);
    setSLEEP_LIST_AVG(response.data.avgArray.weekAvg);
    log("SLEEP_LIST_BAR : " + JSON.stringify(response.data.listArray.todayList));
    log("SLEEP_LIST_LINE : " + JSON.stringify(response.data.listArray.weekList));
    log("SLEEP_LIST_AVG : " + JSON.stringify(response.data.avgArray.weekAvg));
  })()}, [user_id]);

  // 3. logic ------------------------------------------------------------------------------------->
  const successOrNot = (plan, real) => {
    const planDate = new Date(`1970-01-01T${plan}:00.000Z`);
    const realDate = new Date(`1970-01-01T${real}:00.000Z`);
    if (realDate < planDate) {
      realDate.setHours(realDate.getHours() + 24);
    }
    const diff = Math.abs(realDate.getTime() - planDate.getTime());
    const diffMinutes = Math.floor(diff / 60000);

    let textColor = "text-muted";
    if (0 <= diffMinutes && diffMinutes <= 10) {
      textColor = "text-primary";
    }
    if (10 < diffMinutes && diffMinutes <= 20) {
      textColor = "text-success";
    }
    if (20 < diffMinutes && diffMinutes <= 30) {
      textColor = "text-warning";
    }
    if (30 < diffMinutes) {
      textColor = "text-danger";
    }
    return textColor;
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5-1. bar ------------------------------------------------------------------------------------->
  const chartSleepBar = () => {
    const fmtStrToInt = (str) => {
      const time = str.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    };
    const data = SLEEP_LIST_BAR.map((item) => {
      return {
        name: "취침",
        목표: fmtStrToInt(item.sleep_start_plan),
        실제: fmtStrToInt(item.sleep_start_real),
      };
    })
    .concat(SLEEP_LIST_BAR.map((item) => {
      return {
        name: "기상",
        목표: fmtStrToInt(item.sleep_end_plan),
        실제: fmtStrToInt(item.sleep_end_real),
      };
    }))
    .concat(SLEEP_LIST_BAR.map((item) => {
      return {
        name: "수면",
        목표: fmtStrToInt(item.sleep_time_plan),
        실제: fmtStrToInt(item.sleep_time_real),
      };
    }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{
            top: 60,
            right: 60,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            type="number"
            domain={[0, 30]}
            ticks={[0, 6, 12, 18, 24, 30]}
            tickFormatter={(tick) => {
              if (tick > 24) {
                return `0${tick - 24}`;
              }
              return tick;
            }}
          />
          <Line
            dataKey="목표"
            type="monotone"
            stroke="#ff7300"
          />
          <Bar
            dataKey="실제"
            type="monotone"
            fill="#8884d8"
            barSize={30}
          />
          <Tooltip />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };
  const tableSleepBar = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          {SLEEP_LIST_BAR.map((item) => (
            <React.Fragment key={item.sleep_day}>
              <tr>
                <td>취침</td>
                <td>{item.sleep_start_plan}</td>
                <td>{item.sleep_start_real}</td>
                <td>
                  <span className={successOrNot(item.sleep_start_plan, item.sleep_start_real)}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>기상</td>
                <td>{item.sleep_end_plan}</td>
                <td>{item.sleep_end_real}</td>
                <td>
                  <span className={successOrNot(item.sleep_end_plan, item.sleep_end_real)}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>수면</td>
                <td>{item.sleep_time_plan}</td>
                <td>{item.sleep_time_real}</td>
                <td>
                  <span className={successOrNot(item.sleep_time_plan, item.sleep_time_real)}>
                    ●
                  </span>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. line ------------------------------------------------------------------------------------>
  const chartSleepLine = () => {
    const lineChartData = SLEEP_LIST_LINE.map((item) => {
      return {
        name: item.sleep_day.substring(5, 10),
        취침: parseFloat(item.sleep_start_real),
        기상: parseFloat(item.sleep_end_real),
        수면: parseFloat(item.sleep_time_real),
      };
    });
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={lineChartData}
          margin={{
            top: 60,
            right: 60,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="category"
            dataKey="name"
          />
          <YAxis
            type="number"
            domain={[0, 30]}
            ticks={[0, 6, 12, 18, 24, 30]}
            tickFormatter={(tick) => {
              if (tick > 24) {
                return `0${tick - 24}`;
              }
              return tick;
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
  const tableSleepLine = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          {["취침", "기상", "수면"].map((key, index) => (
            <div key={index}>
              <input
                type="checkbox"
                checked={activeLine.includes(key)}
                onChange={() => {
                  if (activeLine.includes(key)) {
                    setActiveLine(activeLine.filter((item) => item !== key));
                  }
                  else {
                    setActiveLine([...activeLine, key]);
                  }
                }}
              />
              {key}
            </div>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-3. average -------------------------------------------------------------------------------->
  const chartSleepAvg = () => {
    const chartDataReal = SLEEP_LIST_AVG.map((item) => ({
      name: item.name,
      "취침": parseFloat(item.avg_start_real),
      "기상": parseFloat(item.avg_end_real),
      "수면": parseFloat(item.avg_time_real),
    }));

    const chartDataPlan = SLEEP_LIST_AVG.map((item) => ({
      name: item.name,
      "취침": parseFloat(item.avg_start_plan),
      "기상": parseFloat(item.avg_end_plan),
      "수면": parseFloat(item.avg_time_plan),
    }));

    let chartData = avgChartData === "real" ? chartDataReal : chartDataPlan;

    return (
      <React.Fragment>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 60,
              right: 60,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />
            <XAxis
              type="category"
              dataKey="name"
            />
            <YAxis
              type="number"
              domain={[0, 30]}
              ticks={[0, 6, 12, 18, 24, 30]}
              tickFormatter={(tick) => {
                if (tick > 24) {
                  return `0${tick - 24}`;
                }
                return tick;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "1px solid #dddddd",
                borderRadius: "7px",
                padding: "10px"
              }}
            />
            <Legend
              verticalAlign="bottom"
            />
            {activeAvg.includes("취침") && (
              <Bar type="monotone" dataKey="취침" barSize={20} fill="#413ea0" />
            )}
            {activeAvg.includes("기상") && (
              <Bar type="monotone" dataKey="기상" barSize={20} fill="#8884d8" />
            )}
            {activeAvg.includes("수면") && (
              <Bar type="monotone" dataKey="수면" barSize={20} fill="#ff7300" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
  const tableSleepAvg = () => {
    return (
      <table className="table bg-white border">
        <div className="m-10">
          <button
            type="button"
            className={`
              btn btn-secondary btn-sm ${avgChartData === "real" ? "active" : ""}
              me-10
            `}
            id="real"
            onClick={() => {
              setAvgChartData("real");
            }}
          >
            실제
          </button>
          <button
            type="button"
            className={`
              btn btn-secondary btn-sm ${avgChartData === "plan" ? "active" : ""}
              me-10
            `}
            id="plan"
            onClick={() => {
              setAvgChartData("plan");
            }}
          >
            계획
          </button>
        </div>
        <tbody>
          {["취침", "기상", "수면"].map((key, index) => (
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
        </tbody>
      </table>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container">
        <div className="container-wrapper mb-10">
          <div className="row d-center">
            <div className="col-8">
              {chartSleepBar()}
            </div>
            <div className="col-4">
              {tableSleepBar()}
            </div>
          </div>
        </div>
        <div className="container-wrapper mb-10">
          <div className="row d-center">
            <div className="col-10">
              {chartSleepLine()}
            </div>
            <div className="col-2">
              {tableSleepLine()}
            </div>
          </div>
        </div>
        <div className="container-wrapper mb-10">
          <div className="row d-center">
            <div className="col-10">
              {chartSleepAvg()}
            </div>
            <div className="col-2">
              {tableSleepAvg()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
