// WorkList.jsx

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
export const WorkList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:STATE, set:setSTATE} = useStorage(
    `STATE(${PATH})`, {
      id: "",
      date: "",
      refresh:0,
      toDetail:"/work/detail",
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      strDur: `${location_date} ~ ${location_date}`,
      strStartDt: location_date,
      strEndDt: location_date,
      strDt: location_date
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      limit: 5
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK_DEFAULT, setWORK_DEFAULT] = useState([{
    _id: "",
    work_number: 0,
    work_date: "",
    work_start: "",
    work_end: "",
    work_time: "",
    work_section: [{
      work_part_idx: 0,
      work_part_val: "전체",
      work_title_idx: 0,
      work_title_val: "전체",
      work_set: 0,
      work_rep: 0,
      work_kg: 0,
      work_rest: 0,
    }],
  }]);
  const [WORK, setWORK] = useState([{
    _id: "",
    work_number: 0,
    work_date: "",
    work_start: "",
    work_end: "",
    work_time: "",
    work_section: [{
      work_part_idx: 0,
      work_part_val: "전체",
      work_title_idx: 0,
      work_title_val: "전체",
      work_set: 0,
      work_rep: 0,
      work_kg: 0,
      work_rest: 0,
    }],
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/list`, {
      params: {
        user_id: user_id,
        work_dur: DATE.strDur,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setWORK(response.data.result ? response.data.result : WORK_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt ? response.data.totalCnt : 0,
    }));
  })()}, [user_id, DATE.strDur, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover table-responsive">
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
          </tr>
        </thead>
        <tbody>
          {WORK.map((item) => (
            <React.Fragment key={item.work_date}>
              <tr>
                <td rowSpan={6} className="pointer" onClick={() => {
                  STATE.id = item._id;
                  STATE.date = item.work_date;
                  navParam(STATE.toDetail, {
                    state: STATE
                  });
                }}>
                  {item.work_date}
                </td>
                <td>시작</td>
                <td>{item.work_start}</td>
                <td>{item.work_end}</td>
                <td>{item.work_time}</td>
                <td colSpan={5}>
                  {item.work_section.map((section, index) => (
                    <div key={index} className="d-flex justify-content-between">
                      <span>{section.work_part_val}</span>
                      <span>{section.work_title_val}</span>
                      <span>{section.work_set} x {section.work_rep} x {section.work_kg}</span>
                      <span>{section.work_rest}</span>
                    </div>
                  ))}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
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
        type={"work"} compare={""}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        STATE={STATE} setSTATE={setSTATE} flowSave={""} navParam={navParam}
        type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>List</h1>
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {calendarNode()}
            {tableNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {filterNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {pagingNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};
