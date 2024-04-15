// WorkDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import axios from "axios";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";
// ------------------------------------------------------------------------------------------------>
export const WorkDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
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
      refresh:0,
      toList:"/work/list",
      toSave:"/work/save",
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
  const WORK_DEFAULT = {
    _id: "",
    work_number: 0,
    work_startDt: "",
    work_endDt: "",
    work_start: "",
    work_end: "",
    work_time: "",
    work_total_volume: 0,
    work_cardio_time: "",
    work_body_weight: "",
    work_section: [{
      work_part_idx: 0,
      work_part_val: "전체",
      work_title_idx: 0,
      work_title_val: "전체",
      work_set: 1,
      work_rep: 1,
      work_kg: 1,
      work_rest: 1,
    }],
  };
  const [WORK, setWORK] = useState(WORK_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });

    setWORK(response.data.result || WORK_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));

  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_WORK}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data === "success") {
      const updatedData = await axios.get(`${URL_WORK}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert("삭제되었습니다.");
      setWORK(updatedData.data.result || WORK_DEFAULT);
      updatedData.data.result === null && navParam(SEND.toList);
    }
    else {
      alert(`${response.data}`);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>시작</th>
            <th>종료</th>
            <th>시간</th>
            <th>볼륨</th>
            <th>체중</th>
            <th>부위</th>
            <th>종목</th>
            <th>세트</th>
            <th>횟수</th>
            <th>중량</th>
            <th>휴식</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {WORK?.work_section?.map((item, index) => (
            <tr key={index}>
              {index === 0 && (
                <React.Fragment>
                  <td className="fs-20 pt-20" rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_startDt}
                  </td>
                  <td className="fs-20 pt-20" rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_start}
                  </td>
                  <td className="fs-20 pt-20" rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_end}
                  </td>
                  <td className="fs-20 pt-20" rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_time}
                  </td>
                  <td className="fs-20 pt-20" rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_total_volume}
                  </td>
                  <td className="fs-20 pt-20" rowSpan={WORK?.work_section?.length}>
                    {WORK?.work_body_weight}
                  </td>
                </React.Fragment>
              )}
              <td className="fs-20 pt-20">
                {item.work_part_val}
              </td>
              <td className="fs-20 pt-20">
                {item.work_title_val}
              </td>
              <td className="fs-20 pt-20">
                {item.work_set}
              </td>
              <td className="fs-20 pt-20">
                {item.work_rep}
              </td>
              <td className="fs-20 pt-20">
                {item.work_kg}
              </td>
              <td className="fs-20 pt-20">
                {item.work_rest}
              </td>
              <td className="fs-20 pt-20">
                <button type="button" className="btn btn-sm btn-danger" onClick={() => (
                  flowDelete(item._id)
                )}>
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"work"} plan={""} type={"detail"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className={"col-12"}>
            <h1>Detail</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className={"col-12"}>
            {tableNode()}
          </div>
        </div>
        <div className={"row d-center"}>
          <div className={"col-12"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};