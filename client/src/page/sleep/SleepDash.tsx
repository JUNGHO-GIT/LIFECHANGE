// Dash.tsx

import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";
import {LineChart, Line} from "recharts";
import {ComposedChart} from 'recharts';
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [activeKeys, setActiveKeys] = useState(["취침시간", "수면시간", "기상시간"]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [type, setType] = useState("day");
  const [filter, setFilter] = useState({
    filterSub: "asc",
    page: 1,
    limit: 5,
  });

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST_BAR, setVal:setSLEEP_LIST_BAR} = useStorage<any>(
    `sleepListBar(${type})`, [{
      _id: "",
      sleep_day: "0000-00-00",
      sleep_night_real: "00:00",
      sleep_time_real: "00:00",
      sleep_morning_real: "00:00",
      sleep_night_plan: "00:00",
      sleep_time_plan: "00:00",
      sleep_morning_plan: "00:00",
    }]
  );
  const {val:SLEEP_LIST_LINE, setVal:setSLEEP_LIST_LINE} = useStorage<any>(
    `sleepListLine(${type})`, [{
      _id: "",
      sleep_day: "0000-00-00",
      sleep_night_real: "00:00",
      sleep_time_real: "00:00",
      sleep_morning_real: "00:00",
      sleep_night_plan: "00:00",
      sleep_time_plan: "00:00",
      sleep_morning_plan: "00:00",
    }]
  );
  const {val:SLEEP_LIST_AVG, setVal:setSLEEP_LIST_AVG} = useStorage<any>(
    `sleepListAvg(${type})`, [{
      _id: "",
      sleep_day: "0000-00-00",
      sleep_night_real: "00:00",
      sleep_time_real: "00:00",
      sleep_morning_real: "00:00",
      sleep_night_plan: "00:00",
      sleep_time_plan: "00:00",
      sleep_morning_plan: "00:00",
    }]
  );
  const {val:sleepResDur, setVal:setSleepResDur} = useStorage<string>(
    `sleepResDur(${type})`, "0000-00-00 ~ 0000-00-00"
  );
  const {val:sleepStartDay, setVal:setSleepStartDay} = useStorage<Date | undefined>(
    `sleepStartDay(${type})`, undefined
  );
  const {val:sleepEndDay, setVal:setSleepEndDay} = useStorage<Date | undefined>(
    `sleepEndDay(${type})`, undefined
  );
  const {val:sleepDay, setVal:setSleepDay} = useStorage<Date | undefined>(
    `sleepDay(${type})`, koreanDate
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/sleepDash`, {
      params: {
        user_id: user_id,
      },
    });
    setSLEEP_LIST_BAR(response.data.todayList);
    setSLEEP_LIST_LINE(response.data.weekList);
    setSLEEP_LIST_AVG(response.data.monthList);
    log("SLEEP_LIST_BAR : " + JSON.stringify(response.data.todayList));
    log("SLEEP_LIST_LINE : " + JSON.stringify(response.data.weekList));
    log("SLEEP_LIST_AVG : " + JSON.stringify(response.data.monthList));
  })()}, [user_id]);

  // 3. logic ------------------------------------------------------------------------------------->
  const successOrNot = (plan: string, real: string) => {
    const planDate = new Date(`1970-01-01T${plan}:00.000Z`);
    const realDate = new Date(`1970-01-01T${real}:00.000Z`);

    // 실제 시간이 계획된 시간보다 이전인 경우 다음 날로 처리
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
    const fmtStrToInt = (str: string) => {
      const time = str.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    };
    const data = SLEEP_LIST_BAR.map((item:any) => {
      return {
        name: "취침",
        목표: fmtStrToInt(item.sleep_night_plan),
        실제: fmtStrToInt(item.sleep_night_real),
      };
    })
    .concat(SLEEP_LIST_BAR.map((item:any) => {
      return {
        name: "수면",
        목표: fmtStrToInt(item.sleep_time_plan),
        실제: fmtStrToInt(item.sleep_time_real),
      };
    }))
    .concat(SLEEP_LIST_BAR.map((item:any) => {
      return {
        name: "기상",
        목표: fmtStrToInt(item.sleep_morning_plan),
        실제: fmtStrToInt(item.sleep_morning_real),
      };
    }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
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
          <Tooltip />
          <Legend />
          <Bar dataKey="목표" fill="#8884d8" />
          <Bar dataKey="실제" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  const tableSleepBar = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          {SLEEP_LIST_BAR.map((item:any) => (
            <React.Fragment key={item.sleep_day}>
              <tr>
                <td>취침</td>
                <td>{item.sleep_night_plan}</td>
                <td>{item.sleep_night_real}</td>
                <td>
                  <span className={successOrNot(item.sleep_night_plan, item.sleep_night_real)}>
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
              <tr>
                <td>기상</td>
                <td>{item.sleep_morning_plan}</td>
                <td>{item.sleep_morning_real}</td>
                <td>
                  <span className={successOrNot(item.sleep_morning_plan, item.sleep_morning_real)}>
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
    const lineChartData = SLEEP_LIST_LINE.map((item:any) => {
      return {
        name: item.sleep_day.substring(5, 10),
        취침시간: parseFloat(item.sleep_night_real),
        수면시간: parseFloat(item.sleep_time_real),
        기상시간: parseFloat(item.sleep_morning_real),
      };
    });
    return (
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
          <Tooltip />
          <Legend />
          {activeKeys.includes("취침시간") && <Line type="monotone" dataKey="취침시간" stroke="#8884d8" activeDot={{ r: 8 }} />}
          {activeKeys.includes("수면시간") && <Line type="monotone" dataKey="수면시간" stroke="#82ca9d" />}
          {activeKeys.includes("기상시간") && <Line type="monotone" dataKey="기상시간" stroke="#ffc658" />}
        </LineChart>
      </ResponsiveContainer>
    );
  };
  const tableSleepLine = () => {
    return (
      <table className="table bg-white border">
        <tbody>
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
        </tbody>
      </table>
    );
  };

  // 5-3. average -------------------------------------------------------------------------------->
  const avgChartData = [
    { name: "1월", 취침시간: 23, 수면시간: 7.5, 기상시간: 7.5 },
    { name: "2월", 취침시간: 21.5, 수면시간: 7, 기상시간: 6.5 },
    { name: "3월", 취침시간: 22, 수면시간: 9, 기상시간: 8 }
  ];
  const chartSleepAvg = () => {
    return (
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
    );
  }
  const tableSleepAvg = () => {
    return (
      <></>
    );
  }

  // 7. return ------------------------------------------------------------------------------------>
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
            <div className="col-12">
              {chartSleepAvg()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
