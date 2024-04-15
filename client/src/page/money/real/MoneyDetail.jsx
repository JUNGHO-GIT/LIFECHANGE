// MoneyDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import axios from "axios";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toDetail: "/money/detail",
      toList: "/money/list",
      toSave: "/money/save"
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
  const MONEY_DEFAULT = {
    _id: "",
    money_number: 0,
    money_startDt: "",
    money_endDt: "",
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  };
  const [MONEY, setMONEY] = useState(MONEY_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setMONEY(response.data.result || MONEY_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_MONEY}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data === "success") {
      const updatedData = await axios.get(`${URL_MONEY}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert("삭제되었습니다.");
      setMONEY(updatedData.data.result || MONEY_DEFAULT);
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
            <th>분류</th>
            <th>항목</th>
            <th>금액</th>
            <th>내용</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {MONEY?.money_section?.map((item, index) => (
            <tr key={index}>
              {index === 0 && (
                <React.Fragment>
                  <td className="fs-20 pt-20" rowSpan={MONEY?.money_section?.length}>
                    {MONEY?.money_startDt}
                  </td>
                </React.Fragment>
              )}
              <td className="fs-20 pt-20">
                {item.money_part_val}
              </td>
              <td className="fs-20 pt-20">
                {item.money_title_val}
              </td>
              <td className="fs-20 pt-20">
                {item.money_amount}
              </td>
              <td className="fs-20 pt-20">
                {item.money_content}
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
        part={"money"} plan={""} type={"detail"}
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