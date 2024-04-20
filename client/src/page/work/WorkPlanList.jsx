// WorkPlanList.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Table, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const WorkPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_WORK;
  const user_id = window.sessionStorage.getItem("user_id");
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
      toDetail: "/work/plan/detail",
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
    work_startDt: "0000-00-00",
    work_endDt: "0000-00-00",
    work_plan_startDt: "0000-00-00",
    work_plan_endDt: "0000-00-00",
    work_total_count: 0,
    work_total_volume: 0,
    work_total_cardio: "00:00",
    work_body_weight: 0,
    work_plan_count: 0,
    work_plan_cardio: "00:00",
    work_plan_volume: 0,
    work_plan_weight: 0,
    work_diff_count: 0,
    work_diff_cardio: "00:00",
    work_diff_volume: 0,
    work_diff_weight: 0,
    work_diff_count_color: "",
    work_diff_cardio_color: "",
    work_diff_volume_color: "",
    work_diff_weight_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/plan/list`, {
      params: {
        user_id: user_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableFragment () {
      return (
        <Table hover responsive variant={"light"} border={1}>
          <thead className={"table-primary"}>
            <tr>
              <th>기간</th>
              <th>분류</th>
              <th>목표</th>
              <th>실제</th>
              <th>비교</th>
            </tr>
          </thead>
          <tbody className={"text-start"}>
            {OBJECT?.map((item, index) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td rowSpan={5} className={"pointer"} onClick={() => {
                    SEND.id = item._id;
                    SEND.startDt = item.work_plan_startDt;
                    SEND.endDt = item.work_plan_endDt;
                    navParam(SEND.toDetail, {
                      state: SEND
                    });
                  }}>
                    {item.work_plan_startDt} ~ {item.work_plan_endDt}
                  </td>
                </tr>
                <tr>
                  <td>총 운동횟수</td>
                  <td>{`${numeral(item.work_plan_count).format("0,0")} 회`}</td>
                  <td>{`${numeral(item.work_total_count).format("0,0")} 회`}</td>
                  <td className={item.work_diff_count_color}>
                    {`${numeral(item.work_diff_count).format("0,0")} 회`}
                  </td>
                </tr>
                <tr>
                  <td>총 운동량</td>
                  <td>{`${numeral(item.work_plan_volume).format("0,0")} vol`}</td>
                  <td>{`${numeral(item.work_total_volume).format("0,0")} vol`}</td>
                  <td className={item.work_diff_volume_color}>
                    {`${numeral(item.work_diff_volume).format("0,0")} vol`}
                  </td>
                </tr>
                <tr>
                  <td>유산소 시간</td>
                  <td>{item.work_plan_cardio}</td>
                  <td>{item.work_total_cardio}</td>
                  <td className={item.work_diff_cardio_color}>
                    {item.work_diff_cardio}
                  </td>
                </tr>
                <tr>
                  <td>체중</td>
                  <td>{`${numeral(item.work_plan_weight).format("0,0")} kg`}</td>
                  <td>{`${numeral(item.work_body_weight).format("0,0")} kg`}</td>
                  <td className={item.work_diff_weight_color}>
                    {`${numeral(item.work_diff_weight).format("0,0")} kg`}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
      </React.Fragment>
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
        part={"work"} plan={"plan"} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} flowSave={""} navParam={navParam}
        part={"work"} plan={"plan"} type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row className={"d-center"}>
            <Col xs={12} className={"mb-20"}>
              <h1>List</h1>
            </Col>
            <Col xs={12} className={"mb-20"}>
              {calendarNode()}
              {tableNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {filterNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {pagingNode()}
            </Col>
            <Col xs={12} className={"mb-20"}>
              {buttonNode()}
            </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};