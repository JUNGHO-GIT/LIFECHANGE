// MoneyPlanDetail.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Button, ButtonGroup, Table, Form} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyPlanDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY_PLAN = process.env.REACT_APP_URL_MONEY_PLAN;
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
      toDetail: "/money/plan/detail",
      toList: "/money/plan/list",
      toSave: "/money/plan/save"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
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
  const MONEY_PLAN_DEFAULT = {
    _id: "",
    money_plan_number: 0,
    money_plan_startDt: "",
    money_plan_endDt: "",
    money_plan_in: 0,
    money_plan_out: 0
  };
  const [MONEY_PLAN, setMONEY_PLAN] = useState(MONEY_PLAN_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY_PLAN}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        money_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setMONEY_PLAN(response.data.result || MONEY_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_MONEY_PLAN}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        money_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data.status === "success") {
      const updatedData = await axios.get(`${URL_MONEY_PLAN}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          money_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert(response.data.msg);
      setMONEY_PLAN(updatedData.data.result || MONEY_PLAN_DEFAULT);
      updatedData.data.result === null && navParam(SEND.toList);
    }
    else {
      alert(response.data.msg);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <Table hover responsive variant={"light"}>
        <thead className={"table-primary"}>
          <tr>
            <th>시작일</th>
            <th>종료일</th>
            <th>수입목표</th>
            <th>지출목표</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr className={"fs-20 pt-20"}>
            <td>{MONEY_PLAN?.money_plan_startDt}</td>
            <td>{MONEY_PLAN?.money_plan_endDt}</td>
            <td>{MONEY_PLAN?.money_plan_in}</td>
            <td>{MONEY_PLAN?.money_plan_out}</td>
            <td><Button variant={"danger"} size={"sm"} onClick={() => {
              flowDelete(MONEY_PLAN?._id);
            }}>X</Button></td>
          </tr>
        </tbody>
      </Table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"money"} plan={"plan"} type={"detail"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Detail</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {tableNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};