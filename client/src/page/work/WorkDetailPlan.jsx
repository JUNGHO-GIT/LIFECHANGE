// WorkDetailPlan.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
// ------------------------------------------------------------------------------------------------>
export const WorkDetailPlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id;
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh:0,
    toList:"/work/list/plan",
    toSave:"/work/save/plan",
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK_DEFAULT, setWORK_DEFAULT] = useState({
    _id: "",
    work_number: 0,
    work_date: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    }
  });
  const [WORK, setWORK] = useState({
    _id: location_id,
    work_number: 0,
    work_date: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    }
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        work_dur: `${location_date} ~ ${location_date}`,
        planYn: "N",
      },
    });

    setWORK(response.data.result ? response.data.result : WORK_DEFAULT);

  })()}, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_WORK}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        work_dur: strDur,
        planYn: "N",
      },
    });
    if (response.data === "success") {
      alert("delete success");
      STATE.date = strDate;
      navParam(STATE.toList);
    }
    else {
      alert(`${response.data}`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode strDate={strDate} setStrDate={setStrDate} type="detail" />
    );
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
            <th>부위</th>
            <th>종목</th>
            <th>세트 x 횟수 x 무게</th>
            <th>휴식</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fs-20 pt-20">
              {WORK.work_date}
            </td>
            <td className="fs-20 pt-20">
              {WORK.work_real.work_start}
            </td>
            <td className="fs-20 pt-20">
              {WORK.work_real.work_end}
            </td>
            <td className="fs-20 pt-20">
              {WORK.work_real.work_time}
            </td>
            <td colSpan={5}>
              {WORK.work_real.work_section.map((item, index) => (
                <div key={index} className="d-flex justify-content-between">
                  <span>{item.work_part_val}</span>
                  <span>{item.work_title_val}</span>
                  <span>{item.work_set} x {item.work_count} x {item.work_kg}</span>
                  <span>{item.work_rest}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger ms-2"
                    onClick={() => (
                      flowDelete(item._id)
                    )}
                  >
                    X
                  </button>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calendarOpen={""} setCalendarOpen={""}
        strDate={""} setStrDate={""}
        STATE={STATE} flowSave={""} navParam={navParam}
        type="detail"
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Detail (Plan)</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {dateNode()}
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {tableNode()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};