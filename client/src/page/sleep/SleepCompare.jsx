// SleepCompare.jsx

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
export const SleepCompare = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    toDetail:"/sleep/detail",
    id: "",
    date: ""
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:calendarOpen, set:setCalendarOpen} = useStorage(
    `calendarOpen(${PATH})`, false
  );
  const {val:totalCount, set:setTotalCount} = useStorage(
    `totalCount(${PATH})`, 0
  );
  const {val:type, set:setType} = useStorage(
    `type(${PATH})`, "day"
  );
  const {val:filter, set:setFilter} = useStorage(
    `filter(${PATH})`, {
      order: "asc",
      type: "day",
      limit: 5
    }
  );
  const {val:paging, set:setPaging} = useStorage(
    `paging(${PATH})`, {
      page: 1,
      limit: 5
    }
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, location_date
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, location_date
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState([{
    _id: "",
    sleep_number: 0,
    sleep_date: "",
    sleep_real : {
      sleep_section: [{
        sleep_night: "",
        sleep_morning: "",
        sleep_time: "",
      }],
    },
    sleep_plan : {
      sleep_section: [{
        sleep_night: "",
        sleep_morning: "",
        sleep_time: "",
      }],
    },
  }]);
  const [SLEEP, setSLEEP] = useState([{
    _id: "",
    sleep_number: 0,
    sleep_date: "",
    sleep_real : {
      sleep_section: [{
        sleep_night: "",
        sleep_morning: "",
        sleep_time: "",
      }],
    },
    sleep_plan : {
      sleep_section: [{
        sleep_night: "",
        sleep_morning: "",
        sleep_time: "",
      }],
    },
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const response = await axios.get(`${URL_SLEEP}/list`, {
      params: {
        user_id: user_id,
        sleep_dur: strDur,
        filter: filter,
        paging: paging,
        planYn: "",
      },
    });

    setTotalCount(response.data.totalCount === 0 ? 1 : response.data.totalCount);
    setSLEEP(response.data.result ? response.data.result : SLEEP_DEFAULT);

  })()}, [strDur, filter, paging]);

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
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>목표</th>
            <th>실제</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {SLEEP.map((item) => (
            <React.Fragment key={item._id}>
              <tr>
                <td rowSpan={3} className="pointer" onClick={() => {
                  STATE.id = item._id;
                  STATE.date = item.sleep_date;
                  navParam(STATE.toDetail, {
                    state: STATE
                  });
                }}>
                  {item.sleep_date}
                </td>
                <td>취침</td>
                <td>
                  {item.sleep_plan?.sleep_section?.map((item) => item.sleep_night)}
                </td>
                <td>
                  {item.sleep_real?.sleep_section?.map((item) => item.sleep_night)}
                </td>
                <td>
                  <span className={successOrNot(
                    item.sleep_plan?.sleep_section?.map((item) => item.sleep_night),
                    item.sleep_real?.sleep_section?.map((item) => item.sleep_night)
                  )}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>기상</td>
                <td>
                  {item.sleep_plan?.sleep_section?.map((item) => item.sleep_morning)}
                </td>
                <td>
                  {item.sleep_real?.sleep_section?.map((item) => item.sleep_morning)}
                </td>
                <td>
                  <span className={successOrNot(
                    item.sleep_plan?.sleep_section?.map((item) => item.sleep_morning),
                    item.sleep_real?.sleep_section?.map((item) => item.sleep_morning)
                  )}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>수면</td>
                <td>
                  {item.sleep_plan?.sleep_section?.map((item) => item.sleep_time)}
                </td>
                <td>
                  {item.sleep_real?.sleep_section?.map((item) => item.sleep_time)}
                </td>
                <td>
                  <span className={successOrNot(
                    item.sleep_plan?.sleep_section?.map((item) => item.sleep_time),
                    item.sleep_real?.sleep_section?.map((item) => item.sleep_time)
                  )}>
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

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    return (
      <CalendarNode filter={filter} setFilter={setFilter}
        strDate={strDate} setStrDate={setStrDate}
        strStartDate={strStartDate} setStrStartDate={setStrStartDate}
        strEndDate={strEndDate} setStrEndDate={setStrEndDate}
        strDur={strDur} setStrDur={setStrDur}
        calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode paging={paging} setPaging={setPaging} totalCount={totalCount}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode filter={filter} setFilter={setFilter} paging={paging} setPaging={setPaging}
        type={"sleep"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen}
        strDate={strDate} setStrDate={setStrDate}
        STATE={STATE} flowSave={""} navParam={navParam}
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
            <h1>Compare</h1>
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
