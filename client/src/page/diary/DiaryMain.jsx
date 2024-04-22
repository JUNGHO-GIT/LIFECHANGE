// DiaryMain.jsx

import React, {useState} from "react";
import axios from "axios";
import Calendar from "react-calendar";
import InputMask from "react-input-mask";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import {useDeveloperMode} from "../../assets/hooks/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const DiaryMain = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_DIARY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();
  const {log} = useDeveloperMode();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [value, setValue] = useState(new Date());
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toMain: "/diary/main",
      toList: "/diary/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
   const {val:POPUP, set:setPOPUP} = useStorage(
    `POPUP(${PATH})`, {
      popupOpen1: false,
      popupOpen2: false,
      popupOpen3: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    customer_id: customer_id,
    diary_number: 0,
    diary_startDt: "0000-00-00",
    diary_endDt: "0000-00-00",
    diary_daily_title: "",
    diary_daily_detail: ""
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      customer_id: customer_id,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      OBJECT: OBJECT
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    log(response.data.result);
    if (response.data.status === "success") {
      alert(response.data.msg);
      navParam(SEND.toMain);
    }
    else {
      alert(response.data.msg);
    }
  };

  // 5-1. popup ----------------------------------------------------------------------------------->
  const popupNode1 = () => {
    return (
      <React.Fragment>
        <div className={`popup ${POPUP.popupOpen1 ? "" : "d-none"}`}>
          <span className={"d-right fw-700 x-button"} onClick={() => (
            setPOPUP((prev) => ({
              ...prev,
              popupOpen1: false
            }))
          )}>
            X
          </span>
          <div className={"h-2"}></div>
          <InputMask
            mask={""}
            placeholder={"메모"}
            id={`diary_daily_title`}
            name={`diary_daily_title`}
            className={"form-control"}
            maskChar={null}
            value={OBJECT?.diary_daily.diary_daily_title}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                diary_daily: {
                  ...prev.diary_daily,
                  diary_daily_title: e.target.value
                }
              }))
            )}
          ></InputMask>
          <InputMask
            mask={""}
            placeholder={"내용"}
            id={`diary_daily_detail`}
            name={`diary_daily_detail`}
            className={"form-control"}
            maskChar={null}
            value={OBJECT?.diary_daily.diary_daily_detail}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                diary_daily: {
                  ...prev.diary_daily,
                  diary_daily_detail: e.target.value
                }
              }))
            )}
          ></InputMask>
          <Button
            variant={"primary"}
            onClick={() => {
              flowSave();
            }}
          >
            저장
          </Button>
        </div>
      </React.Fragment>
    );
  };

  // 5-1. popup ----------------------------------------------------------------------------------->
  const popupNode2 = () => {
    return (
      <React.Fragment>
        <div className={`popup ${POPUP.popupOpen2 ? "" : "d-none"}`}>
          <span className={"d-right fw-700 x-button"} onClick={() => (
            setPOPUP((prev) => ({
            ...prev,
              popupOpen2: false
            }))
          )}>
            X
          </span>
          <div className={"h-2"}></div>
          <div>
            222
          </div>
        </div>
      </React.Fragment>
    );
  };

  // 5-1. popup ----------------------------------------------------------------------------------->
  const popupNode3 = () => {
    return (
      <React.Fragment>
        <div className={`popup ${POPUP.popupOpen3 ? "" : "d-none"}`}>
          <span className={"d-right fw-700 x-button"} onClick={() => (
            setPOPUP((prev) => ({
            ...prev,
              popupOpen3: false
            }))
          )}>
            X
          </span>
          <div className={"h-2"}></div>
          <div>
            333
          </div>
        </div>
      </React.Fragment>
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
                {popupNode1()}
                {popupNode2()}
                {popupNode3()}
                <Calendar
                  onChange={setValue}
                  value={value}
                  showNavigation={true}
                  showNeighboringMonth={true}
                  view={"month"}
                  formatYear={(locale, date) => date.getFullYear()}
                  formatMonth={(locale, date) => date.toLocaleString(locale, {month: "long"})}
                  formatDay={(locale, date) => date.getDate()}
                  tileContent={({date, view}) => (
                    <React.Fragment>
                      <div className={"d-inline-block ms-20"}>
                        <span className={"text-primary p-4"} onClick={() => {
                          setPOPUP((prev) => ({
                            popupOpen1: !prev.popupOpen1,
                            popupOpen2: false,
                            popupOpen3: false,
                          }));
                          setDATE((prev) => ({
                            ...prev,
                            startDt: date.toLocaleDateString(),
                            endDt: date.toLocaleDateString()
                          }));
                        }}>
                          ●
                        </span>
                        <span className={"text-success p-4"} onClick={() => {
                          setPOPUP((prev) => ({
                            popupOpen1: false,
                            popupOpen2: !prev.popupOpen2,
                            popupOpen3: false,
                          }));
                          setDATE((prev) => ({
                            ...prev,
                            startDt: date.toLocaleDateString(),
                            endDt: date.toLocaleDateString()
                          }));
                        }}>
                          ●
                        </span>
                        <span className={"text-danger p-4"} onClick={() => {
                          setPOPUP((prev) => ({
                            popupOpen1: false,
                            popupOpen2: false,
                            popupOpen3: !prev.popupOpen3,
                          }));
                          setDATE((prev) => ({
                            ...prev,
                            startDt: date.toLocaleDateString(),
                            endDt: date.toLocaleDateString()
                          }));
                        }}>
                          ●
                        </span>
                      </div>
                    </React.Fragment>
                  )}
                />
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};