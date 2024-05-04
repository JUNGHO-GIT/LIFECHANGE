// FoodSearch.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import InputMask from "react-input-mask";
import {useDate} from "../../hooks/useDate.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {PagingNode} from "../../fragments/PagingNode.jsx";
import {Container, Row, Col, Card, Table, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodSearch = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toSave:"/food/save",
  });
  const [DATE, setDATE] = useState({
    startDt: location_startDt,
    endDt: location_endDt
  });
  const [FILTER, setFILTER] = useState({
    query: "",
    page: 0,
    limit: 10,
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const [OBJECT, setOBJECT] = useState({
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "아침",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER?.query === "") {
      return;
    }
    else {
      flowSearch();
    }
  }, [FILTER?.page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSearch = async () => {
    const response = await axios.get(`${URL_OBJECT}/search`, {
      params: {
        user_id: user_id,
        FILTER: FILTER
      }
    });
    setOBJECT((prev) => ({
      ...prev,
      food_section: response.data.result
    }));
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt ? response.data.totalCnt : 0,
    }));
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const handleStorage = (param) => {
      localStorage.setItem("food_section", JSON.stringify(param));
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toSave, {
        state: SEND
      });
    };
    const tableSection = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>식품명</th>
              <th className={"table-thead"}>브랜드</th>
              <th className={"table-thead"}>1회 제공량</th>
              <th className={"table-thead"}>1회 중량</th>
              <th className={"table-thead"}>칼로리</th>
              <th className={"table-thead"}>지방</th>
              <th className={"table-thead"}>탄수화물</th>
              <th className={"table-thead"}>단백질</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.food_section?.map((item, index) => (
              <tr key={index}>
                <td className={"pointer"} onClick={() => {
                  handleStorage(item);
                }}>
                  {item.food_title}
                </td>
                <td>{item.food_brand}</td>
                <td>{item.food_count} {item.food_serv}</td>
                <td>{item.food_gram}</td>
                <td>{item.food_kcal}</td>
                <td>{item.food_fat}</td>
                <td>{item.food_carb}</td>
                <td>{item.food_protein}</td>
              </tr>
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

  // 5-2. search ---------------------------------------------------------------------------------->
  const searchNode = () => (
    <div className={"input-group"}>
      <InputMask
        mask={""}
        id={"food_content"}
        name={"food_content"}
        className={"form-control"}
        readOnly={false}
        disabled={false}
        value={FILTER?.query}
        onChange={(e) => {
          setFILTER((prev) => ({
            ...prev,
            query: e.target.value
          }));
        }}
      ></InputMask>
      <span className={"input-group-text pointer"} onClick={() => {
        setFILTER((prev) => ({
          ...prev,
          page: 0
        }));
        flowSearch();
      }}>
        <i className={"bi bi-search"}></i>
      </span>
    </div>
  );

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => (
    <PagingNode PAGING={FILTER} setPAGING={setFILTER} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"food"} plan={""} type={"search"}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {tableNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {searchNode()}
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
              {pagingNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
