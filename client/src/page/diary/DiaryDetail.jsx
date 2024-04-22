// DiaryDetail.jsx

import React, {useState, useEffect} from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import Draggable from "react-draggable";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Button, Col, Row} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DiaryDetail = ({ popupNumber, setPopupNumber, isOpen, setIsOpen, startDt, endDt }) => {

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
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList: "/diary/list",
      toDetail: "/diary/detail"
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
    diary_title: "",
    diary_detail: ""
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(startDt, endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {
    if (popupNumber > 0 && isOpen) {(async () => {
      const response = await axios.get(`${URL_OBJECT}/detail`, {
        params: {
          _id: location_id,
          customer_id: customer_id,
          category: popupNumber,
          duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      setOBJECT(response.data.result || OBJECT_DEFAULT);
      setOBJECT((prev) => ({
        ...prev,
        diary_category: String(popupNumber)
      }));
    })()}
  }, [popupNumber, isOpen, location_id, customer_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      customer_id: customer_id,
      category: popupNumber,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    if (response.data.status === "success") {
      alert(response.data.msg);
      setIsOpen(false);
    }
    else {
      alert(response.data.msg);
      setIsOpen(false);
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        _id: id,
        customer_id: customer_id,
        category: popupNumber,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      if (Object.keys(response.data.result).length > 0) {
        setOBJECT(response.data.result);
        setIsOpen(false);
      }
      else {
        navParam(SEND.toList);
        setIsOpen(false);
      }
    }
    else {
      alert(response.data.msg);
      setIsOpen(false);
    }
  };

  // 5-1. popup ----------------------------------------------------------------------------------->
  const popupNode = () => {
    return (
      <React.Fragment>
        <Draggable>
          <div className={`popup ${isOpen ? "" : "d-none"}`}>
            <span className={"d-right fw-700 x-button"} onClick={() => (
              setIsOpen(false),
              setPopupNumber(0)
            )}>
              X
            </span>
            <Row className={"d-center mt-30 mb-20"}>
              <Col xs={12}>
                <h3>{startDt}</h3>
              </Col>
            </Row>
            <Row className={"d-center mb-20"}>
              <Col xs={12}>
                <InputMask
                  mask={""}
                  placeholder={"카테고리"}
                  id={`diary_category`}
                  name={`diary_category`}
                  className={"form-control d-inline-flex mb-20 p-10"}
                  maskChar={null}
                  value={popupNumber}
                  disabled={true}
                  onChange={(e) => (
                    setOBJECT((prev) => ({
                      ...prev,
                      diary_category: e.target.value
                    }))
                  )}
                ></InputMask>
                <InputMask
                  mask={""}
                  placeholder={"제목"}
                  id={`diary_title`}
                  name={`diary_title`}
                  className={"form-control d-inline-flex mb-20 p-10"}
                  maskChar={null}
                  value={OBJECT?.diary_title}
                  onChange={(e) => (
                    setOBJECT((prev) => ({
                      ...prev,
                      diary_title: e.target.value
                    }))
                  )}
                ></InputMask>
                <InputMask
                  mask={""}
                  placeholder={"내용"}
                  id={`diary_detail`}
                  name={`diary_detail`}
                  className={"form-control d-inline-flex mb-20 p-10"}
                  maskChar={null}
                  value={OBJECT?.diary_detail}
                  onChange={(e) => (
                    setOBJECT((prev) => ({
                      ...prev,
                      diary_detail: e.target.value
                    }))
                  )}
                ></InputMask>
              </Col>
            </Row>
            <Row className={"d-center mb-20"}>
              <Col xs={12}>
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
              </Col>
            </Row>
          </div>
        </Draggable>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {popupNode()}
    </React.Fragment>
  );
};