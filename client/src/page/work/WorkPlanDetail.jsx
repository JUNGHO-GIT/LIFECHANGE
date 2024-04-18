// WorkPlanDetail.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, FormGroup, FormLabel, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const WorkPlanDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK_PLAN = process.env.REACT_APP_URL_WORK_PLAN;
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
      toDetail: "/work/plan/detail",
      toList: "/work/plan/list",
      toSave: "/work/plan/save"
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
  const WORK_PLAN_DEFAULT = {
    _id: "",
    work_plan_number: 0,
    work_plan_startDt: "",
    work_plan_endDt: "",
    work_plan_count: 0,
    work_plan_volume: 0,
    work_plan_cardio: "",
    work_plan_weight: 0,
  };
  const [WORK_PLAN, setWORK_PLAN] = useState(WORK_PLAN_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK_PLAN}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        work_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setWORK_PLAN(response.data.result || WORK_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_WORK_PLAN}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        work_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data.status === "success") {
      const updatedData = await axios.get(`${URL_WORK_PLAN}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          work_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert(response.data.msg);
      setWORK_PLAN(updatedData.data.result || WORK_PLAN_DEFAULT);
      !updatedData.data.result && navParam(SEND.toList);
    }
    else {
      alert(response.data.msg);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <Table striped hover responsive variant={"light"}>
          <thead className={"table-primary"}>
          <tr>
            <th>시작일</th>
            <th>종료일</th>
            <th>목표 운동 횟수</th>
            <th>목표 볼륨</th>
            <th>목표 유산소 시간</th>
            <th>목표 체중</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{WORK_PLAN?.work_plan_startDt}</td>
            <td>{WORK_PLAN?.work_plan_endDt}</td>
            <td>{WORK_PLAN?.work_plan_count}</td>
            <td>{WORK_PLAN?.work_plan_volume}</td>
            <td>{WORK_PLAN?.work_plan_cardio}</td>
            <td>{WORK_PLAN?.work_plan_weight}</td>
            <td><Button variant={"danger"} size={"sm"}
            onClick={() => (flowDelete(WORK_PLAN?._id))}>X</Button></td>
          </tr>
        </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"work"} plan={"plan"} type={"detail"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <CardGroup className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row className={"d-center"}>
            <Col xs={12} className={"mb-20"}>
              <h1>Detail</h1>
            </Col>
            <Col xs={12} className={"mb-20"}>
              {tableNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {buttonNode()}
            </Col>
            </Row>
          </Container>
        </Card>
      </CardGroup>
    </React.Fragment>
  );
};
