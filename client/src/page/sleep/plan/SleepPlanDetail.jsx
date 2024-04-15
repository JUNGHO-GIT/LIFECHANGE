// SleepPlanDetail.jsx

import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import axios from "axios";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP_PLAN = process.env.REACT_APP_URL_SLEEP_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
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
      toList:"/sleep/plan/list",
      toSave:"/sleep/plan/save"
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
  const SLEEP_PLAN_DEFAULT = {
    _id: "",
    sleep_plan_number: 0,
    sleep_plan_startDt: "",
    sleep_plan_endDt: "",
    sleep_plan_night: "",
    sleep_plan_morning: "",
    sleep_plan_time: "",
  };
  const [SLEEP_PLAN, setSLEEP_PLAN] = useState(SLEEP_PLAN_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP_PLAN}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        sleep_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setSLEEP_PLAN(response.data.result || SLEEP_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_SLEEP_PLAN}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        sleep_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data === "success") {
      const updatedData = await axios.get(`${URL_SLEEP_PLAN}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          sleep_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      setSLEEP_PLAN(updatedData.data.result || SLEEP_PLAN_DEFAULT);
      alert("삭제되었습니다.");
      updatedData.data.result === null && navParam(SEND.toList);
    }
    else {
      alert(`${response.data}`);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className={"table bg-white table-hover"}>
        <thead className={"table-primary"}>
          <tr>
            <th>시작일</th>
            <th>종료일</th>
            <th>취침시간</th>
            <th>기상시간</th>
            <th>수면시간</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fs-20 pt-20">
              {SLEEP_PLAN?.sleep_plan_startDt}
            </td>
            <td className="fs-20 pt-20">
              {SLEEP_PLAN?.sleep_plan_endDt}
            </td>
            <td className="fs-20 pt-20">
              {SLEEP_PLAN?.sleep_plan_night}
            </td>
            <td className="fs-20 pt-20">
              {SLEEP_PLAN?.sleep_plan_morning}
            </td>
            <td className="fs-20 pt-20">
              {SLEEP_PLAN?.sleep_plan_time}
            </td>
            <td className="fs-20 pt-20">
              <button type="button" className="btn btn-sm btn-danger" onClick={() => (
                flowDelete(SLEEP_PLAN?._id)
              )}>
                X
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"sleep"} plan={"plan"} type={"detail"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row"}>
          <div className={"col-12 mb-20 d-center"}>
            <h1>Detail</h1>
          </div>
          <div className={"col-12 mb-20 d-center"}>
            {tableNode()}
          </div>
          <div className={"col-12 mb-20 d-center"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};