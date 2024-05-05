// FoodPlanList.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {CalendarNode} from "../../fragments/CalendarNode.jsx";
import {PagingNode} from "../../fragments/PagingNode.jsx";
import {FilterNode} from "../../fragments/FilterNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {LoadingNode} from "../../fragments/LoadingNode.jsx";
import {Container, Table, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail:"/food/plan/detail"
  });
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 5
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [CALENDAR, setCALENDAR] = useState({
    calStartOpen: false,
    calEndOpen: false,
    calOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
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
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [{
    food_startDt: "0000-00-00",
    food_endDt: "0000-00-00",
    food_total_kcal: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_total_fat: 0,
    food_plan_startDt: "0000-00-00",
    food_plan_endDt: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
    food_diff_kcal: 0,
    food_diff_carb: 0,
    food_diff_protein: 0,
    food_diff_fat: 0,
    food_diff_kcal_color: "",
    food_diff_carb_color: "",
    food_diff_protein_color: "",
    food_diff_fat_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/plan/list`, {
      params: {
        user_id: user_id,
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
    setLOADING(false);
  })()}, [
    user_id,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    DATE.startDt, DATE.endDt
  ]);

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
                  <td rowSpan={4} className={"pointer"} onClick={() => {
                    SEND.id = item._id;
                    SEND.startDt = item.food_plan_startDt;
                    SEND.endDt = item.food_plan_endDt;
                    navParam(SEND.toDetail, {
                      state: SEND
                    });
                  }}>
                    {`${item.food_plan_startDt?.substring(5, 10)} ~ ${item.food_plan_endDt?.substring(5, 10)}`}
                  </td>
                  <td>칼로리</td>
                  <td>{`${numeral(item.food_plan_kcal).format('0,0')} kcal`}</td>
                  <td>{`${numeral(item.food_total_kcal).format('0,0')} kcal`}</td>
                  <td className={item.food_diff_kcal_color}>{`${numeral(item.food_diff_kcal).format('0,0')} kcal`}</td>
                </tr>
                <tr>
                  <td>탄수화물</td>
                  <td>{`${numeral(item.food_plan_carb).format('0,0')} g`}</td>
                  <td>{`${numeral(item.food_total_carb).format('0,0')} g`}</td>
                  <td className={item.food_diff_carb_color}>{`${numeral(item.food_diff_carb).format('0,0')} g`}</td>
                </tr>
                <tr>
                  <td>단백질</td>
                  <td>{`${numeral(item.food_plan_protein).format('0,0')} g`}</td>
                  <td>{`${numeral(item.food_total_protein).format('0,0')} g`}</td>
                  <td className={item.food_diff_protein_color}>{`${numeral(item.food_diff_protein).format('0,0')} g`}</td>
                </tr>
                <tr>
                  <td>지방</td>
                  <td>{`${numeral(item.food_plan_fat).format('0,0')} g`}</td>
                  <td>{`${numeral(item.food_total_fat).format('0,0')} g`}</td>
                  <td className={item.food_diff_fat_color}>{`${numeral(item.food_diff_fat).format('0,0')} g`}</td>
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

  // 6. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <LoadingNode LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 8. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => (
    <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
      CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
    />
  );

  // 10. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"food"} plan={"plan"} type={"list"}
    />
  );

  // 9. filter ------------------------------------------------------------------------------------>
  const filterNode = () => (
    <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      part={"food"} plan={"plan"} type={"list"}
    />
  );

  // 11. button ----------------------------------------------------------------------------------->
  const buttonNode = () => (
    <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      flowSave={""} navParam={navParam} part={"sleep"} plan={"plan"} type={"list"}
    />
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {LOADING ? "" : calendarNode()}
                {LOADING ? loadingNode() : tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {LOADING ? "" : filterNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {LOADING ? "" : pagingNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {LOADING ? "" : buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};