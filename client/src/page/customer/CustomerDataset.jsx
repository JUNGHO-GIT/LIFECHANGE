// CustomerDataset.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {exerciseArray} from "../../assets/data/ExerciseArray.jsx";
import {foodArray} from "../../assets/data/FoodArray.jsx";
import {moneyArray} from "../../assets/data/MoneyArray.jsx";
import {Container, Table, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const CustomerDataset = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CUSTOMER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toMain: "/",
      toList: "/customer/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:idx, set:setIdx} = useStorage(
    `idx(${PATH})`, {
      partIdx: 0,
      titleIdx: 0,
    }
  );
  const {val:dataType, set:setDataType} = useStorage(
    `dataType(${PATH})`, "food"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    customer_id: customer_id,
    customer_number: 0,
    customer_dataset: {
      exercise: [{
        exercise_part: "",
        exercise_title: [""]
      }],
      food: [{
        food_part: "",
        food_title: [""]
      }],
      money: [{
        money_part: "",
        money_title: [""]
      }]
    }
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/dataset`, {
      params: {
        customer_id: customer_id
      }
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
  })()}, [customer_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      customer_id: customer_id,
      OBJECT: OBJECT
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      window.sessionStorage.setItem("dataset", JSON.stringify(response.data.result.customer_dataset));
      navParam(SEND.refresh);
    }
    else {
      alert(response.data.msg);
      window.sessionStorage.setItem("customer_id", "false");
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode1 = () => {
    return (
      <React.Fragment>
        <Table hover variant={"light"} border={2}>
          <thead className={"table-primary"}>
            <tr>
              <th>Section</th>
            </tr>
          </thead>
          <tbody>
            {["exercise", "food", "money"].map((item, index) => (
              <tr>
                <td>
                  <Row>
                    <Col xs={12} className={"fs-20 p-5"}>
                      <div className={"pointer me-2"} onClick={() => (setDataType(item))}>
                        {item}
                      </div>
                    </Col>
                  </Row>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode2 = () => {
    function addPart() {
      setOBJECT((prev) => ({
        ...prev,
        customer_dataset: {
          ...prev.customer_dataset,
          [dataType]: [
            ...prev.customer_dataset[dataType], {
              [`${dataType}_part`]: "",
              [`${dataType}_title`]: [""]
            }
          ]
        }
      }));
    };
    function renamePart(index) {
      return function() {
        const newPart = prompt("새로운 이름을 입력하세요.");
        if (newPart) {
          setOBJECT((prev) => ({
            ...prev,
            customer_dataset: {
              ...prev.customer_dataset,
              [dataType]: [
                ...prev.customer_dataset[dataType]?.slice(0, index), {
                  ...prev.customer_dataset[dataType]?.[index],
                  [`${dataType}_part`]: newPart
                },
                ...prev.customer_dataset[dataType]?.slice(index + 1)
              ]
            }
          }));
        }
      };
    };
    function rmPart(index) {
      return function() {
        setOBJECT((prev) => ({
          ...prev,
          customer_dataset: {
            ...prev.customer_dataset,
            [dataType]: [
              ...prev.customer_dataset[dataType].slice(0, index),
              ...prev.customer_dataset[dataType].slice(index + 1)
            ]
          }
        }));
      };
    };
    return (
      <React.Fragment>
        <Table hover variant={"light"} border={2}>
          <thead className={"table-primary"}>
            <tr>
              <th>Part</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.customer_dataset[dataType]?.map((item, index) => (index > 0) && (
              <tr>
                <td>
                  <Row>
                    <Col xs={7} className={"fs-20 p-5"}>
                      <div className={"pointer me-2"} onClick={() => setIdx(prev => ({
                        ...prev,
                        partIdx: index,
                        titleIdx: 0
                      }))}>
                        {item[`${dataType}_part`]}
                      </div>
                    </Col>
                    <Col xs={3} className={"fs-15 p-5"}>
                      <div className={"pointer d-center text-success"}
                      onClick={renamePart(index)}>
                        변경
                      </div>
                    </Col>
                    <Col xs={2} className={"fs-15 p-5"}>
                      <div className={"pointer d-center text-danger fw-bolder"}
                      onClick={rmPart(index)}>
                        x
                      </div>
                    </Col>
                  </Row>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className={"d-inline-flex"}>
                <div className={"pointer btn btn-outline-primary button"}  onClick={addPart}>
                  추가
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode3 = () => {
    function addTitle () {
      setOBJECT((prev) => ({
        ...prev,
        customer_dataset: {
          ...prev.customer_dataset,
          [dataType]: [
            ...prev.customer_dataset[dataType]?.slice(0, idx.partIdx), {
              ...prev.customer_dataset[dataType]?.[idx.partIdx],
              [`${dataType}_title`]: [
                ...prev.customer_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`],
                ""
              ]
            },
            ...prev.customer_dataset[dataType]?.slice(idx.partIdx + 1)
          ]
        }
      }));
    };
    function renameTitle(index) {
      return function() {
        const newTitle = prompt("새로운 이름을 입력하세요.");
        if (newTitle) {
          setOBJECT((prev) => ({
            ...prev,
            customer_dataset: {
              ...prev.customer_dataset,
              [dataType]: [
                ...prev.customer_dataset[dataType]?.slice(0, idx.partIdx), {
                  ...prev.customer_dataset[dataType]?.[idx.partIdx],
                  [`${dataType}_title`]: [
                    ...prev.customer_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                    newTitle,
                    ...prev.customer_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
                  ]
                },
                ...prev.customer_dataset[dataType]?.slice(idx.partIdx + 1)
              ]
            }
          }));
        }
      };
    };
    function rmTitle(index) {
      return function() {
        setOBJECT((prev) => ({
          ...prev,
          customer_dataset: {
            ...prev.customer_dataset,
            [dataType]: [
              ...prev.customer_dataset[dataType]?.slice(0, idx.partIdx), {
                ...prev.customer_dataset[dataType]?.[idx.partIdx],
                [`${dataType}_title`]: [
                  ...prev.customer_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                  ...prev.customer_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
                ]
              },
              ...prev.customer_dataset[dataType]?.slice(idx.partIdx + 1)
            ]
          }
        }));
      };
    };
    return (
      <React.Fragment>
        <Table hover variant={"light"} border={2}>
          <thead className={"table-primary"}>
            <tr>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.customer_dataset[dataType]?.[idx?.partIdx]?.[`${dataType}_title`]?.map((item, index) => (index > 0) && (
              <tr>
                <td>
                  <Row>
                    <Col xs={7} className={"fs-20 p-5"}>
                      <div className="pointer me-2" onClick={() => setIdx(prev => ({
                        ...prev,
                        titleIdx: index
                      }))}>
                        {item}
                      </div>
                    </Col>
                    <Col xs={3} className={"fs-15 p-5"}>
                      <div className={"pointer d-center text-success"}
                      onClick={renameTitle(index)}>
                        변경
                      </div>
                    </Col>
                    <Col xs={2} className={"fs-15 p-5"}>
                      <div className={"pointer d-center text-danger fw-bolder"}
                      onClick={rmTitle(index)}>
                        x
                      </div>
                    </Col>
                  </Row>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className={"d-inline-flex"}>
                <div className={"pointer btn btn-outline-primary button"} onClick={addTitle}>
                  추가
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 4. button ------------------------------------------------------------------------------------>
  const buttonDefault = () => {
    function confirmDefault() {
      const confirm = window.confirm("기본값으로 초기화하시겠습니까?");

      let defaultArray = [];
      if (dataType === "exercise") {
        defaultArray = exerciseArray;
      }
      else if (dataType === "food") {
        defaultArray = foodArray;
      }
      else if (dataType === "money") {
        defaultArray = moneyArray;
      }

      if (confirm) {
        setOBJECT((prev) => ({
          ...prev,
          customer_dataset: {
            ...prev.customer_dataset,
            [dataType]: defaultArray
          }
        }));
      }
    }
    return (
      <React.Fragment>
        <Button variant={"outline-primary"} size={"sm"} className={"button me-5"}
        onClick={confirmDefault}>
          기본값
        </Button>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={""} setCALENDAR={""} DATE={DATE} setDATE={setDATE}
        SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
        flowSave={flowSave} navParam={navParam} part={"customer"} plan={""} type={"save"}
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
                <h1>List</h1>
              </Col>
              <Col xs={4} className={"mb-20 text-center"}>
                {tableNode1()}
              </Col>
              <Col xs={4} className={"mb-20 text-center"}>
                {tableNode2()}
              </Col>
              <Col xs={4} className={"mb-20 text-center"}>
                {dataType !== "food" && tableNode3()}
              </Col>
              <Col xs={12} className={"mb-20 text-center"}>
                <span className={"me-5 d-inline-flex"}>{buttonDefault()}</span>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};