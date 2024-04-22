// DiaryList.jsx

import moment from "moment";
import Calendar from "react-calendar";
import {DiaryDetail} from "./DiaryDetail.jsx";
import React from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DiaryList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:isOpen, set:setIsOpen} = useStorage(
    `isOpen(${PATH})`, false
  );
  const {val:popupNumber, set:setPopupNumber} = useStorage(
    `popupNumber(${PATH})`, 1
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col xs={12} className={"mb-20 text-center"}>
                <Calendar
                  locale={"ko-KR"}
                  value={new Date()}
                  showNavigation={true}
                  showNeighboringMonth={true}
                  view={"month"}
                  onChange={(date) => {
                    setDATE((prev) => ({
                      ...prev,
                      startDt: moment(date?.toString()).format("YYYY-MM-DD"),
                      endDt: moment(date?.toString()).format("YYYY-MM-DD"),
                    }));
                  }}
                  tileContent={({date, view}) => (
                    <React.Fragment key={view}>
                      <div className={"d-inline-block ms-20"}>
                        <span className={"text-primary p-4"} onClick={() => {
                          setIsOpen(true);
                          setPopupNumber(1);
                        }}>
                          ●
                        </span>
                        <span className={"text-success p-4"} onClick={() => {
                          setIsOpen(true);
                          setPopupNumber(2);
                        }}>
                          ●
                        </span>
                        <span className={"text-danger p-4"} onClick={() => {
                          setIsOpen(true);
                          setPopupNumber(3);
                        }}>
                          ●
                        </span>
                      </div>
                    </React.Fragment>
                  )}
                />
                <DiaryDetail
                  popupNumber={popupNumber}
                  setPopupNumber={setPopupNumber}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  startDt={DATE.startDt}
                  endDt={DATE.endDt}
                />
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
}