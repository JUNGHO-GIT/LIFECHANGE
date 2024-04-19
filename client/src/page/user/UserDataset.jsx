// UserDataset.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {foodArray} from "../../assets/data/FoodArray.jsx";
import {moneyArray} from "../../assets/data/MoneyArray.jsx";
import {workArray} from "../../assets/data/WorkArray.jsx";
import {Container, Table, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const UserDataset = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_USER;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toDetail:"/user/detail"
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
    user_dataset: {
      food: [{
        food_part: "",
        food_title: [""]
      }],
      money: [{
        money_part: "",
        money_title: [""]
      }],
      work: [{
        work_part: "",
        work_title: [""]
      }]
    }
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/dataset`, {
      params: {
        user_id: user_id
      }
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
  })()}, [user_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
      OBJECT: OBJECT
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      window.sessionStorage.setItem("dataset", JSON.stringify(response.data.result.user_dataset));
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(response.data.msg);
      window.sessionStorage.setItem("user_id", "false");
    }
  };

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerSetDefault = () => {
    const confirm = window.confirm("기본값으로 초기화하시겠습니까?");

    let defaultArray = [];
    if (dataType === "food") {
      defaultArray = foodArray;
    }
    else if (dataType === "money") {
      defaultArray = moneyArray;
    }
    else if (dataType === "work") {
      defaultArray = workArray;
    }

    if (confirm) {
      setOBJECT((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: defaultArray
        }
      }));
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function addPart() {
      setOBJECT((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: [
            ...prev.user_dataset[dataType], {
              [`${dataType}_part`]: "",
              [`${dataType}_title`]: [""]
            }
          ]
        }
      }));
    };
    function addTitle () {
      const index = idx.partIdx;
      return function() {
        setOBJECT((prev) => ({
          ...prev,
          user_dataset: {
            ...prev.user_dataset,
            [dataType]: [
              ...prev.user_dataset[dataType]?.slice(0, index), {
                ...prev.user_dataset[dataType]?.[index],
                [`${dataType}_title`]: [
                  ...prev.user_dataset[dataType]?.[index]?.[`${dataType}_title`],
                  ""
                ]
              },
              ...prev.user_dataset[dataType]?.slice(index + 1)
            ]
          }
        }));
      };
    };
    function renamePart(index) {
      return function() {
        const newPart = prompt("새로운 이름을 입력하세요.");
        if (newPart) {
          setOBJECT((prev) => ({
            ...prev,
            user_dataset: {
              ...prev.user_dataset,
              [dataType]: [
                ...prev.user_dataset[dataType]?.slice(0, index), {
                  ...prev.user_dataset[dataType]?.[index],
                  [`${dataType}_part`]: newPart
                },
                ...prev.user_dataset[dataType]?.slice(index + 1)
              ]
            }
          }));
        }
      };
    };
    function renameTitle(index) {
      return function() {
        const newTitle = prompt("새로운 이름을 입력하세요.");
        if (newTitle) {
          setOBJECT((prev) => ({
            ...prev,
            user_dataset: {
              ...prev.user_dataset,
              [dataType]: [
                ...prev.user_dataset[dataType]?.slice(0, idx.partIdx), {
                  ...prev.user_dataset[dataType]?.[idx.partIdx],
                  [`${dataType}_title`]: [
                    ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                    newTitle,
                    ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
                  ]
                },
                ...prev.user_dataset[dataType]?.slice(idx.partIdx + 1)
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
          user_dataset: {
            ...prev.user_dataset,
            [dataType]: [
              ...prev.user_dataset[dataType].slice(0, index),
              ...prev.user_dataset[dataType].slice(index + 1)
            ]
          }
        }));
      };
    };
    function rmTitle(index) {
      return function() {
        setOBJECT((prev) => ({
          ...prev,
          user_dataset: {
            ...prev.user_dataset,
            [dataType]: [
              ...prev.user_dataset[dataType]?.slice(0, idx.partIdx), {
                ...prev.user_dataset[dataType]?.[idx.partIdx],
                [`${dataType}_title`]: [
                  ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                  ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
                ]
              },
              ...prev.user_dataset[dataType]?.slice(idx.partIdx + 1)
            ]
          }
        }));
      };
    };
    return (
      <React.Fragment>
        <Table hover responsive variant={"light"} border={1}>
          <thead className={"table-primary"}>
          <tr>
            <th colSpan={2} className={"pointer"} onClick={() => setDataType("food")}>
              food
            </th>
            <th colSpan={2} className={"pointer"} onClick={() => setDataType("money")}>
              money
            </th>
            <th colSpan={2} className={"pointer"} onClick={() => setDataType("work")}>
              work
            </th>
          </tr>
          <tr>
            <th colSpan={3}>part</th>
            <th colSpan={3}>title</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3}>
              {OBJECT?.user_dataset[dataType]?.map((item, index) => (
                (index > 0) && (
                  <React.Fragment key={index}>
                    <div className={"pointer"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        partIdx: index,
                        titleIdx: 0
                      }));
                    }}>
                      {item[`${dataType}_part`]}
                    </div>
                    <span className={"pointer"} onClick={rmPart(index)}>
                      x
                    </span>
                    <span className={"pointer"} onClick={renamePart(index)}>
                      rename
                    </span>
                  </React.Fragment>
                )
              ))}
            </td>
            <td colSpan={3}>
              {OBJECT?.user_dataset[dataType]?.[idx?.partIdx]?.[`${dataType}_title`]?.map((item, index) => (
                (index > 0) && (
                  <React.Fragment key={index}>
                    <div className={"pointer"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        titleIdx: index
                      }));
                    }}>
                      {item}
                    </div>
                    <span className={"pointer"} onClick={rmTitle(index)}>
                      x
                    </span>
                    <span className={"pointer"} onClick={renameTitle(index)}>
                      rename
                    </span>
                  </React.Fragment>
                )
              ))}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className={"pointer"} onClick={addPart}>
              추가
            </td>
            <td colSpan={3} className={"pointer"} onClick={addTitle()}>
              추가
            </td>
          </tr>
        </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
        <ButtonNode CALENDAR={""} setCALENDAR={""} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"user"} plan={""} type={"save"}
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
                <Button type={"button"} variant={"primary"} size={"sm"} className={"ms-2"}
                  onClick={() => (handlerSetDefault())}>
                    기본값
                </Button>
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
      </div>
    </React.Fragment>
  );
};