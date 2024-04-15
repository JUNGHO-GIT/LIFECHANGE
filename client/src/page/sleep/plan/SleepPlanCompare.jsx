// SleepPlanCompare.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {CalendarNode} from "../../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanCompare = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP_PLAN = process.env.REACT_APP_URL_SLEEP_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toDetail:"/sleep/detail"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const SLEEP_COMPARE_DEFAULT = [{
    sleep_startDt: "",
    sleep_endDt: "",
    sleep_plan_startDt: "",
    sleep_plan_endDt: "",
    sleep_night: "",
    sleep_morning: "",
    sleep_time: "",
    sleep_plan_night: "",
    sleep_plan_morning: "",
    sleep_plan_time: "",
  }];
  const [SLEEP_COMPARE, setSLEEP_COMPARE] = useState(SLEEP_COMPARE_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP_PLAN}/compare`, {
      params: {
        user_id: user_id,
        sleep_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        sleep_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setSLEEP_COMPARE(response.data.result || SLEEP_COMPARE_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function successOrNot (plan, real) {
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
    function tableFragment () {
      return (
        <table className={"table bg-white table-hover"}>
          <thead className={"table-primary"}>
            <tr>
              <th>날짜</th>
              <th>분류</th>
              <th>목표</th>
              <th>실제</th>
              <th>비교</th>
            </tr>
          </thead>
          <tbody>
            {SLEEP_COMPARE?.map((item, index) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td rowSpan={4}>
                    {item.sleep_plan_startDt}
                  </td>
                </tr>
                <tr>
                  <td>취침</td>
                  <td>{item.sleep_plan_night}</td>
                  <td>{item.sleep_night}</td>
                  <td className={successOrNot(item.sleep_night, item.sleep_plan_night)}>
                    ●
                  </td>
                </tr>
                <tr>
                  <td>기상</td>
                  <td>{item.sleep_plan_morning}</td>
                  <td>{item.sleep_morning}</td>
                  <td className={successOrNot(item.sleep_morning, item.sleep_plan_morning)}>
                    ●
                  </td>
                </tr>
                <tr>
                  <td>수면</td>
                  <td>{item.sleep_plan_time}</td>
                  <td>{item.sleep_time}</td>
                  <td className={successOrNot(item.sleep_time, item.sleep_plan_time)}>
                    ●
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      );
    };
    return (
      <div className={"d-flex"}>
        {tableFragment()}
      </div>
    );
  };

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    return (
      <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
        CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        part={"sleep"} plan={"plan"} type={"compare"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"sleep"} plan={"plan"} type={"compare"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Compare</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {calendarNode()}
            {tableNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {filterNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {pagingNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};