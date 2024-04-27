// FoodSearch.jsx

import axios from "axios";
import React, {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import InputMask from "react-input-mask";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {Container, Row, Col, Card, Table, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodSearch = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
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
      toSave:"/food/save",
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
      query: "",
      page: 0,
      limit: 10,
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
  const {val:OBJECT, set:setOBJECT} = useStorage(
    `OBJECT(${PATH})`, {
      food_total_kcal: 0,
      food_total_fat: 0,
      food_total_carb: 0,
      food_total_protein: 0,
      food_section: [{
        food_part_val: "아침",
        food_title_val: "기타",
        food_count: 0,
        food_serv: "회",
        food_gram:  0,
        food_kcal: 0,
        food_fat: 0,
        food_carb: 0,
        food_protein: 0,
      }],
    },
  );

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER.query === "") {
      return;
    }
    else {
      flowSearch();
    }
  }, [FILTER.page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSearch = async () => {
    const response = await axios.get(`${URL_OBJECT}/search`, {
      params: {
        customer_id: customer_id,
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

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function handleStorage (param) {
      localStorage.setItem("food_section", JSON.stringify(param));
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toSave, {
        state: SEND
      });
    };
    return (
      <React.Fragment>
        <Table hover responsive variant={"light"} border={1}>
          <thead className={"table-primary"}>
          <tr>
            <th>Title</th>
            <th>Brand</th>
            <th>Serving</th>
            <th>Gram</th>
            <th>Kcal</th>
            <th>Fat</th>
            <th>Carbohydrate</th>
            <th>Protein</th>
          </tr>
        </thead>
        <tbody>
          {OBJECT?.food_section?.map((item, index) => (
            <tr key={index}>
              <td className={"pointer"} onClick={() => {
                handleStorage(item);
              }}>
                {item.food_title_val}
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
  };

  // 5-2. search ---------------------------------------------------------------------------------->
  const searchNode = () => {
    return (
      <div className={"d-inline-flex"}>
        <InputMask
          mask={""}
          id={"food_content"}
          name={"food_content"}
          className={"form-control"}
          readOnly={false}
          disabled={false}
          value={FILTER.query}
          onChange={(e) => {
            setFILTER((prev) => ({
              ...prev,
              query: e.target.value
            }));
          }}
        ></InputMask>
        <Button variant={"secondary"} className={"ms-2"} size={"sm"} onClick={() => {
          setFILTER((prev) => ({
            ...prev,
            page: 0
          }));
          flowSearch();
        }}>
          Search
        </Button>
      </div>
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
    <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col xs={12} className={"mb-20 text-center"}>
                {tableNode()}
              </Col>
              <Col xs={12} className={"mb-20 text-center"}>
                {searchNode()}
              </Col>
              <Col xs={12} className={"mb-20 text-center"}>
                {pagingNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
