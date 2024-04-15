// SleepDetail.jsx

import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import axios from "axios";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
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
      toDetail:"/sleep/detail",
      toList:"/sleep/list",
      toSave:"/sleep/save"
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
  const SLEEP_DEFAULT = {
    _id: "",
    sleep_number: 0,
    sleep_startDt: "",
    sleep_endDt: "",
    sleep_section: [{
      sleep_night: "",
      sleep_morning: "",
      sleep_time: "",
    }],
  };
  const [SLEEP, setSLEEP] = useState(SLEEP_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        sleep_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setSLEEP(response.data.result || SLEEP_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_SLEEP}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        sleep_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data === "success") {
      const updatedData = await axios.get(`${URL_SLEEP}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          sleep_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert("삭제되었습니다.");
      setSLEEP(updatedData.data.result || SLEEP_DEFAULT);
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
            <th>날짜</th>
            <th>취침시간</th>
            <th>기상시간</th>
            <th>수면시간</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fs-20 pt-20">
              {SLEEP?.sleep_startDt}
            </td>
            {SLEEP?.sleep_section?.map((item, index) => (
              <React.Fragment key={index}>
                <td className="fs-20 pt-20">
                  {item.sleep_night}
                </td>
                <td className="fs-20 pt-20">
                  {item.sleep_morning}
                </td>
                <td className="fs-20 pt-20">
                  {item.sleep_time}
                </td>
                <td className="fs-20 pt-20">
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => (
                    flowDelete(item._id)
                  )}>
                    X
                  </button>
                </td>
              </React.Fragment>
            ))}
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
        part={"sleep"} plan={""} type={"detail"}
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