// DiaryList.jsx

import moment from "moment";
import axios from "axios";
import Calendar from "react-calendar";
import {DiaryDetail} from "./DiaryDetail.jsx";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DiaryList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_DIARY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().endOf("month").format("YYYY-MM-DD"),
    }
  );
  const {val:isOpen, set:setIsOpen} = useStorage(
    `isOpen(${PATH})`, false
  );
  const {val:id_param, set:setId_param} = useStorage(
    `id_param(${PATH})`, ""
  );
  const {val:category_param, set:setCategory_param} = useStorage(
    `category_param(${PATH})`, ""
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [{
    customer_id: customer_id,
    diary_number: 0,
    diary_startDt: "0000-00-00",
    diary_endDt: "0000-00-00",
    diary_category: "",
    diary_color: "",
    diary_detail: ""
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        customer_id: customer_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
  })()}, [location_id, customer_id, DATE.startDt, DATE.endDt]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const dateInRange = (date, startDt, endDt) => {
      const currDate = moment(date).format("YYYY-MM-DD");
      return currDate >= startDt && currDate <= endDt;
    };
    return (
      <React.Fragment>
        <Calendar
          locale={"ko-KR"}
          value={new Date()}
          showNavigation={true}
          showNeighboringMonth={true}
          view={"month"}
          tileContent={({ date, view }) => {
            const diaryForDates = OBJECT.filter((diary) =>
              dateInRange(date, diary.diary_startDt, diary.diary_endDt)
            );
            return diaryForDates.length > 0 ? (
              diaryForDates.map(diary => (
                <div key={diary._id}>
                  <p className="calendar-filled"
                    style={{ backgroundColor: diary.diary_color }}
                    onClick={() => {
                      setIsOpen(true);
                      setId_param(diary._id);
                      setCategory_param(diary.diary_category);
                      setDATE({
                        startDt: diary.diary_startDt,
                        endDt: diary.diary_endDt,
                      });
                    }}>
                  </p>
                </div>
              ))
            ) : (
              <div key={date.toISOString()}>
                <p className="calendar-unfilled"></p>
              </div>
            );
          }}
        ></Calendar>
        <DiaryDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          id_param={id_param}
          category_param={category_param}
          startDt={DATE.startDt}
          endDt={DATE.endDt}
        ></DiaryDetail>
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
                {tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
}