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
import {Container, Table, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
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
      toDetail:"/food/plan/detail"
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
  const OBJECT_DEFAULT = [{
    food_startDt: "0000-00-00",
    food_endDt: "0000-00-00",
    food_plan_startDt: "0000-00-00",
    food_plan_endDt: "0000-00-00",
    food_total_kcal: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_total_fat: 0,
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

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableSection () {
      return (
        <Table hover border={1}>
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
                    SEND.startDt = item.food_plan_startDt;
                    SEND.endDt = item.food_plan_endDt;
                    navParam(SEND.toDetail, {
                      state: SEND
                    });
                  }}>
                    {`${item.food_plan_startDt?.substring(5, 10)} ~ ${item.food_plan_endDt?.substring(5, 10)}`}
                  </td>
                </tr>
                <tr>
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
      );
    };
    return (
      <React.Fragment>
        <div className={"table-wrapper"}>
          {tableSection()}
        </div>
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
        part={"food"} plan={"plan"} type={"list"}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        part={"food"} plan={"plan"} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        flowSave={""} navParam={navParam} part={"sleep"} plan={"plan"} type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-10"}>
                {calendarNode()}
                {tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-10"}>
                {filterNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-10"}>
                {pagingNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-10"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};