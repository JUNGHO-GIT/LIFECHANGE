// WorkList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {CalendarNode} from "../../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh:0,
      toDetail: "/work/detail",
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
  const WORK_DEFAULT = [{
    _id: "",
    work_number: 0,
    work_startDt: "",
    work_endDt: "",
    work_start: "",
    work_end: "",
    work_time: "",
    work_total_volume: 0,
    work_total_cardio: "",
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
      work_volume: 0,
      work_cardio: "",
    }],
  }];
  const [WORK, setWORK] = useState(WORK_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/list`, {
      params: {
        user_id: user_id,
        work_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setWORK(response.data.result || WORK_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className={"table bg-white table-hover"}>
        <thead className={"table-primary"}>
          <tr>
            <th>날짜</th>
            <th>시작</th>
            <th>종료</th>
            <th>시간</th>
            <th>볼륨</th>
            <th>유산소</th>
            <th>체중</th>
            <th>부위</th>
            <th>종목</th>
            <th>세트</th>
            <th>횟수</th>
            <th>중량</th>
            <th>휴식</th>
          </tr>
        </thead>
        <tbody>
          {WORK?.map((item, index) => (
            <React.Fragment key={item._id}>
              {item.work_section.slice(0, 3)?.map((section, sectionIndex) => (
                <React.Fragment key={`${section.work_part_val}_${section.work_title_val}`}>
                  <tr>
                    {sectionIndex === 0 && (
                      <React.Fragment>
                        <td rowSpan={item.work_section.length > 3 ? 4 : item.work_section.length}
                        className={"pointer"} onClick={() => {
                          SEND.id = item._id;
                          SEND.startDt = item.work_startDt;
                          SEND.endDt = item.work_endDt;
                          navParam(SEND.toDetail, {
                            state: SEND
                          });
                        }}>
                          {item.work_startDt}
                        </td>
                        <td rowSpan={item.work_section.length > 3 ? 4 : item.work_section.length}>
                          {item.work_start}
                        </td>
                        <td rowSpan={item.work_section.length > 3 ? 4 : item.work_section.length}>
                          {item.work_end}
                        </td>
                        <td rowSpan={item.work_section.length > 3 ? 4 : item.work_section.length}>
                          {item.work_time}
                        </td>
                        <td rowSpan={item.work_section.length > 3 ? 4 : item.work_section.length}>
                          {item.work_total_volume}
                        </td>
                        <td rowSpan={item.work_section.length > 3 ? 4 : item.work_section.length}>
                          {item.work_total_cardio}
                        </td>
                        <td rowSpan={item.work_section.length > 3 ? 4 : item.work_section.length}>
                          {item.work_body_weight}
                        </td>
                      </React.Fragment>
                    )}
                    <React.Fragment>
                      <td>{section.work_part_val}</td>
                      <td>{section.work_title_val}</td>
                    </React.Fragment>
                    {(section.work_part_val !== "유산소") ? (
                      <React.Fragment>
                        <td>{section.work_set}</td>
                        <td>{section.work_rep}</td>
                        <td>{section.work_kg}</td>
                        <td>{section.work_rest}</td>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <td colSpan={4}>{section.work_cardio}</td>
                      </React.Fragment>
                    )}
                  </tr>
                </React.Fragment>
              ))}
              {item.work_section.length > 3 && (
                <tr>
                  <td colSpan={10}>...</td>
                </tr>
              )}
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
        part={"work"} plan={""} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"work"} plan={""} type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>List</h1>
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
