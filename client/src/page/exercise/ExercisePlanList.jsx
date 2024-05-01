// ExercisePlanList.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {CalendarNode} from "../../fragments/CalendarNode.jsx";
import {PagingNode} from "../../fragments/PagingNode.jsx";
import {FilterNode} from "../../fragments/FilterNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Table, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const ExercisePlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toDetail: "/exercise/plan/detail",
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt,
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
  const OBJECT_DEFAULT = [{
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
    exercise_plan_startDt: "0000-00-00",
    exercise_plan_endDt: "0000-00-00",
    exercise_total_count: 0,
    exercise_total_volume: 0,
    exercise_total_cardio: "00:00",
    exercise_body_weight: 0,
    exercise_plan_count: 0,
    exercise_plan_cardio: "00:00",
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
    exercise_diff_count: 0,
    exercise_diff_cardio: "00:00",
    exercise_diff_volume: 0,
    exercise_diff_weight: 0,
    exercise_diff_count_color: "",
    exercise_diff_cardio_color: "",
    exercise_diff_volume_color: "",
    exercise_diff_weight_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/plan/list`, {
      params: {
        customer_id: customer_id,
        FILTER: FILTER,
        PAGING: PAGING,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [customer_id, FILTER, PAGING, DATE.startDt, DATE.endDt]);

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>분류</th>
              <th className={"table-thead"}>목표</th>
              <th className={"table-thead"}>실제</th>
              <th className={"table-thead"}>비교</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.map((item, index) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td rowSpan={5} className={"pointer"} onClick={() => {
                    SEND.id = item._id;
                    SEND.startDt = item.exercise_plan_startDt;
                    SEND.endDt = item.exercise_plan_endDt;
                    navParam(SEND.toDetail, {
                      state: SEND
                    });
                  }}>
                    {`${item.exercise_plan_startDt?.substring(5, 10)} ~ ${item.exercise_plan_endDt?.substring(5, 10)}`}
                  </td>
                </tr>
                <tr>
                  <td>총 운동횟수</td>
                  <td>{`${numeral(item.exercise_plan_count).format("0,0")} 회`}</td>
                  <td>{`${numeral(item.exercise_total_count).format("0,0")} 회`}</td>
                  <td className={item.exercise_diff_count_color}>
                    {`${numeral(item.exercise_diff_count).format("0,0")} 회`}
                  </td>
                </tr>
                <tr>
                  <td>총 운동량</td>
                  <td>{`${numeral(item.exercise_plan_volume).format("0,0")} vol`}</td>
                  <td>{`${numeral(item.exercise_total_volume).format("0,0")} vol`}</td>
                  <td className={item.exercise_diff_volume_color}>
                    {`${numeral(item.exercise_diff_volume).format("0,0")} vol`}
                  </td>
                </tr>
                <tr>
                  <td>유산소 시간</td>
                  <td>{item.exercise_plan_cardio}</td>
                  <td>{item.exercise_total_cardio}</td>
                  <td className={item.exercise_diff_cardio_color}>
                    {item.exercise_diff_cardio}
                  </td>
                </tr>
                <tr>
                  <td>체중</td>
                  <td>{`${numeral(item.exercise_plan_weight).format("0,0")} kg`}</td>
                  <td>{`${numeral(item.exercise_body_weight).format("0,0")} kg`}</td>
                  <td className={item.exercise_diff_weight_color}>
                    {`${numeral(item.exercise_diff_weight).format("0,0")} kg`}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"table-wrapper"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => (
    <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
      CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
    />
  );

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => (
    <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"exercise"} plan={"plan"} type={"list"}
    />
  );

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => (
    <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      part={"exercise"} plan={"plan"} type={"list"}
    />
  );

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => (
    <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      flowSave={""} navParam={navParam} part={"sleep"} plan={"plan"} type={"list"}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {calendarNode()}
              {tableNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {filterNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {pagingNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {buttonNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};