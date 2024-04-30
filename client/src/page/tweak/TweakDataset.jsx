// TweakDataset.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {diaryArray} from "../../assets/array/diaryArray.js";
import {exerciseArray} from "../../assets/array/exerciseArray.js";
import {foodArray} from "../../assets/array/foodArray.js";
import {moneyArray} from "../../assets/array/moneyArray.js";
import {sleepArray} from "../../assets/array/sleepArray.js";
import {Container, Table, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const TweakDataset = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_TWEAK || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const datasetArray = ["diary", "exercise", "food", "money", "sleep"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toDataset: "/customer/dataset",
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
      sectionIdx: 0,
      partIdx: 1,
      titleIdx: 1,
    }
  );
  const {val:selectedIdx, set:setSelectedIdx} = useStorage(
    `selectedIdx(${PATH})`, {
      sectionIdx: 0,
      partIdx: 1,
      titleIdx: 1,
    }
  );
  const {val:dataType, set:setDataType} = useStorage(
    `dataType(${PATH})`, "diary"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    customer_id: customer_id,
    customer_number: 0,
    customer_dataset: {
      diary: [{
        diary_part: ""
      }],
      exercise: [{
        exercise_part: "",
        exercise_title: [""]
      }],
      food: [{
        food_part: ""
      }],
      money: [{
        money_part: "",
        money_title: [""]
      }],
      sleep: [{
        sleep_part: ""
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
      sessionStorage.setItem("dataset", JSON.stringify(response.data.result.customer_dataset));
      navParam(SEND.toDataset);
    }
    else {
      alert(response.data.msg);
      sessionStorage.setItem("customer_id", "false");
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
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
    function tableSection1 () {
      return (
        <React.Fragment>
          <Table hover border={1}>
              <thead>
              <tr>
                <th className={"table-thead"}>Section</th>
              </tr>
            </thead>
            <tbody>
              {datasetArray.map((item, index) => (
                <tr
                  key={index}
                  className={selectedIdx.sectionIdx === index ? "table-secondary" : ""}
                  style={{border: "1px solid #dee2e6"}}
                  onClick={() => {
                    setDataType(item);
                    setSelectedIdx((prev) => ({
                      ...prev,
                      sectionIdx: index,
                      partIdx: 1,
                      titleIdx: 1
                    }));
                    setIdx((prev) => ({
                      ...prev,
                      partIdx: 1,
                      titleIdx: 1
                    }));
                  }}
                >
                  <td>
                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12} className={"p-5"}>
                        <div className={"pointer me-2"}>
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
    function tableSection2 () {
      return (
        <React.Fragment>
          <Table hover border={1}>
              <thead>
                <tr>
                  <th className={"table-thead"}>Part</th>
                </tr>
              </thead>
              <tbody>
                {OBJECT?.customer_dataset[dataType]?.map((item, index) => (index > 0) && (
                  <tr key={index}
                    className={selectedIdx.partIdx === index ? "table-secondary" : ""}
                    style={{border: "1px solid #dee2e6"}}
                    onClick={() => {
                      setSelectedIdx((prev) => ({
                        ...prev,
                        partIdx: index
                      }));
                    }}
                  >
                    <td>
                      <Row>
                        <Col xs={7} className={"p-5"}>
                          <div className={"pointer me-2"} onClick={() => setIdx((prev) => ({
                            ...prev,
                            partIdx: index
                          }))}>
                            {item[`${dataType}_part`]}
                          </div>
                        </Col>
                        <Col xs={3} className={"p-5"}>
                          <div className={"pointer d-center text-success"}
                          onClick={renamePart(index)}>
                            변경
                          </div>
                        </Col>
                        <Col xs={2} className={"p-5"}>
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
                    <div className={"text-center pointer btn btn-sm btn-outline-primary button"} onClick={addPart}>
                      Add
                    </div>
                  </td>
                </tr>
              </tbody>
          </Table>
        </React.Fragment>
      );
    };
    function tableSection3 () {
      return (
        <React.Fragment>
          <Table hover border={1}>
              <thead>
              <tr>
                <th className={"table-thead"}>Title</th>
              </tr>
            </thead>
            <tbody>
              {OBJECT?.customer_dataset[dataType]?.[idx?.partIdx]?.[`${dataType}_title`]?.map((item, index) => (index > 0) && (
                <tr
                  key={index}
                  className={selectedIdx.titleIdx === index ? "table-secondary" : ""}
                  style={{border: "1px solid #dee2e6"}}
                  onClick={() => {
                    setSelectedIdx((prev) => ({
                      ...prev,
                      titleIdx: index
                    }));
                  }}
                >
                  <td>
                    <Row>
                      <Col xs={7} className={"p-5"}>
                        <div className={"pointer me-2"} onClick={() => (setIdx((prev) => ({
                          ...prev,
                          titleIdx: index
                        })))}>
                          {item}
                        </div>
                      </Col>
                      <Col xs={3} className={"p-5"}>
                        <div className={"pointer d-center text-success"}
                        onClick={renameTitle(index)}>
                          변경
                        </div>
                      </Col>
                      <Col xs={2} className={"p-5"}>
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
                  <p className={"pointer btn btn-sm btn-outline-primary button"} onClick={addTitle}>
                    Add
                  </p>
                </td>
              </tr>
            </tbody>
          </Table>
        </React.Fragment>
      );
    };
    return (
      <React.Fragment>
        <div className={"dataset-wrapper"}>
          <Row>
            <Col lg={4} md={4} sm={4} xs={4} className={"pe-0"}>
              {tableSection1()}
            </Col>
            <Col lg={4} md={4} sm={4} xs={4} className={"ps-0 pe-0"}>
              {tableSection2()}
            </Col>
            <Col lg={4} md={4} sm={4} xs={4} className={"ps-0"}>
              {(dataType !== "diary") && (dataType !== "food") && (dataType !== "sleep") && (tableSection3())}
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  };

  // 4. button ------------------------------------------------------------------------------------>
  const buttonDefault = () => {
    function confirmDefault() {
      const confirm = window.confirm("기본값으로 초기화하시겠습니까?");

      let defaultArray = [];
      if (dataType === "diary") {
        defaultArray = diaryArray;
      }
      else if (dataType === "exercise") {
        defaultArray = exerciseArray;
      }
      else if (dataType === "food") {
        defaultArray = foodArray;
      }
      else if (dataType === "money") {
        defaultArray = moneyArray;
      }
      else if (dataType === "sleep") {
        defaultArray = sleepArray;
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
        <Button variant={"danger"} size={"sm"} className={"danger-btn"}
        onClick={confirmDefault}>
          기본값
        </Button>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => (
    <ButtonNode CALENDAR={""} setCALENDAR={""} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"customer"} plan={""} type={"save"}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-10"}>
                {tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-10"}>
                {buttonNode()}
                <span className={"me-1 d-inline-flex"}>{buttonDefault()}</span>
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};