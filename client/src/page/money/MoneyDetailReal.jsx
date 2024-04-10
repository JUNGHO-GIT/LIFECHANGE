// MoneyDetailReal.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import axios from "axios";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetailReal = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id.toString();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    toList:"/money/list/real",
    toSave:"/money/save/real",
    id: "",
    date: ""
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [MONEY_DEFAULT, setMONEY_DEFAULT] = useState({
    _id: "",
    money_number: 0,
    money_date: "",
    money_real : {
      money_section: [{
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: "",
      }],
    }
  });
  const [MONEY, setMONEY] = useState({
    _id: "",
    money_number: 0,
    money_date: "",
    money_real : {
      money_section: [{
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: "",
      }],
    }
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDate(location_date);
    setStrDur(`${location_date} ~ ${location_date}`);
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setMONEY((prev) => ({
      ...prev,
      money_date: strDur
    }));
  }, [strDur]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        money_dur: `${location_date} ~ ${location_date}`,
        planYn: "N",
      },
    });

    setMONEY(response.data.result ? response.data.result : MONEY_DEFAULT);

  })()}, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_MONEY}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        money_dur: strDur,
        planYn: "N",
      },
    });
    if (response.data === "success") {
      alert("delete success");
      navParam(STATE.toList);
    }
    else {
      alert(`${response.data}`);
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>항목</th>
            <th>금액</th>
            <th>내용</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
        {MONEY.money_real.money_section.map((item, index) => (
          <tr key={index}>
            {index === 0 && (
              <React.Fragment>
                <td className="fs-20 pt-20" rowSpan={MONEY.money_real.money_section?.length}>{MONEY.money_date}</td>
              </React.Fragment>
            )}
            <td className="fs-20 pt-20">{item.money_part_val}</td>
            <td className="fs-20 pt-20">{item.money_title_val}</td>
            <td className="fs-20 pt-20">{item.money_amount}</td>
            <td className="fs-20 pt-20">{item.money_content}</td>
            <td className="fs-20 pt-20">
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => flowDelete(item._id)}
              >
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
    function buttonUpdate() {
      return (
        <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
          STATE.date = strDate;
          navParam(STATE.toSave, {
            state: STATE,
          });
        }}>
          Update
        </button>
      );
    };
    function buttonRefresh () {
      return (
        <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
          navParam(STATE.refresh);
        }}>
          Refresh
        </button>
      );
    };
    function buttonList() {
      return (
        <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
          navParam(STATE.toList);
        }}>
          List
        </button>
      );
    };
    return (
      <div className="d-inline-flex">
        {buttonUpdate()}
        {buttonRefresh()}
        {buttonList()}
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Detail (Real)</h1>
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