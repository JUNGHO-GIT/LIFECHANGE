// DiaryDetail.jsx

import React, {useState, useEffect} from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {Button, Col, Row, Container, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DiaryDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_DIARY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const location_category = location?.state?.category?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList: "/diary/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    customer_id: customer_id,
    diary_number: 0,
    diary_startDt: "0000-00-00",
    diary_endDt: "0000-00-00",
    diary_category: "",
    diary_color: "",
    diary_detail: ""
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        customer_id: customer_id,
        _id: location_id,
        category: location_category,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
  })()}, [location_id, customer_id, location_category, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      customer_id: customer_id,
      category: OBJECT.diary_category,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    if (response.data.status === "success") {
      alert(response.data.msg);
      navParam(SEND?.toList);
    }
    else {
      alert(response.data.msg);
      navParam(SEND?.toList);
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        customer_id: customer_id,
        _id: id,
        category: OBJECT.diary_category,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data.status === "success") {
      if (Object.keys(response.data.result).length > 0) {
        alert(response.data.msg);
        setOBJECT(response.data.result);
        navParam(SEND?.toList);
      }
      else {
        alert(response.data.msg);
        navParam(SEND?.toList);
      }
    }
    else {
      alert(response.data.msg);
      navParam(SEND?.toList);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} part={"diary"} plan={""} type={"detail"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <Row className={"text-center"}>
          <Col xs={12}>
            <InputMask
              mask={""}
              placeholder={"카테고리"}
              id={`diary_category`}
              name={`diary_category`}
              className={"form-control mb-20 p-10"}
              maskChar={null}
              value={OBJECT?.diary_category}
              onChange={(e) => (
                setOBJECT((prev) => ({
                  ...prev,
                  diary_category: e.target.value
                }))
              )}
            ></InputMask>
            <InputMask
              mask={""}
              placeholder={"내용"}
              id={`diary_detail`}
              name={`diary_detail`}
              className={"form-control mb-20 p-10"}
              maskChar={null}
              value={OBJECT?.diary_detail}
              onChange={(e) => (
                setOBJECT((prev) => ({
                  ...prev,
                  diary_detail: e.target.value
                }))
              )}
            ></InputMask>
            <InputMask
              mask={""}
              placeholder={"색상"}
              id={`diary_color`}
              name={`diary_color`}
              className={"form-control mb-20 p-10"}
              maskChar={null}
              value={OBJECT?.diary_color}
              onChange={(e) => (
                setOBJECT((prev) => ({
                  ...prev,
                  diary_color: e.target.value
                }))
              )}
            ></InputMask>
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <React.Fragment>
        <Button variant={"primary"} className={"me-10"} onClick={() => {
          flowSave();
        }}>
          저장
        </Button>
        <Button variant={"danger"} className={"ms-10"} onClick={() => {
          flowDelete(OBJECT._id);
        }}>
          삭제
        </Button>
      </React.Fragment>
    );
  }

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col xs={12} className={"mb-20 text-center"}>
                <h1 className={"text-center"}>일기 상세</h1>
              </Col>
            </Row>
            <Row className={"d-center mb-20"}>
              <Col xs={12}>
                {dateNode()}
              </Col>
            </Row>
            <Row className={"d-center mb-20"}>
              <Col xs={12}>
                {tableNode()}
              </Col>
            </Row>
            <Row className={"d-center mb-20"}>
              <Col xs={12}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
}