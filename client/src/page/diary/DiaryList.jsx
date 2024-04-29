// DiaryList.jsx

import axios from "axios";
import moment from "moment-timezone";
import Calendar from "react-calendar";
import React, {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Container, Row, Col, Card} from "react-bootstrap";
import {useStorage} from "../../assets/hooks/useStorage.jsx";

// ------------------------------------------------------------------------------------------------>
export const DiaryList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_DIARY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      section_id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      category: "",
      toDetail: "/diary/detail"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().endOf("month").format("YYYY-MM-DD")
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [{
    customer_id: customer_id,
    diary_number: 0,
    diary_startDt: "0000-00-00",
    diary_endDt: "0000-00-00",
    diary_section: [{
      diary_part_idx: 0,
      diary_part_val: "일정",
      diary_title : "",
      diary_color: "#000000",
      diary_detail: ""
    }]
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
  })()}, [customer_id, DATE.startDt, DATE.endDt]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const formatDate = (date) => {
      return moment(date).format("YYYY-MM-DD");
    };
    const dateInRange = (date, startDt, endDt) => {
      const currDate = formatDate(date);
      return currDate >= startDt && currDate <= endDt;
    };
    const activeLine = (diaryForDates) => {
      return (
        <React.Fragment>
          {diaryForDates?.map((diary) => (
            diary.diary_section.map((section) => (
              <div key={diary._id} className={"calendar-filled"}
                style={{
                  backgroundColor: section.diary_color,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  SEND.id = diary._id;
                  SEND.section_id = section._id;
                  SEND.startDt = diary.diary_startDt;
                  SEND.endDt = diary.diary_endDt;
                  navParam(SEND.toDetail, {
                    state: SEND
                  });
                }}
              >
                <span className={"calendar-category"}>{section.diary_title}</span>
              </div>
            ))
          ))}
        </React.Fragment>
      );
    };
    const unActiveLine = (diaryForDates) => {
      return (
        <React.Fragment>
          {diaryForDates?.map((diary) => (
            diary.diary_section.map((section) => (
              <div key={diary._id} className={"calendar-unfilled"}>
                <span className={"calendar-category"}>{section.diary_title}</span>
              </div>
            ))
          ))}
        </React.Fragment>
      );
    };
    return (
      <React.Fragment>
        <Calendar
          value={new Date()}
          showNavigation={true}
          showNeighboringMonth={true}
          showDoubleView={false}
          prevLabel={<i className={"bx bxs-left-arrow"}></i>}
          nextLabel={<i className={"bx bxs-right-arrow"}></i>}
          prev2Label={null}
          next2Label={null}
          formatDay={(locale, date) => (moment(date).format("D"))}
          formatWeekday={(locale, date) => (moment(date).format("D"))}
          formatMonth={(locale, date) => (moment(date).format("MM"))}
          formatYear={(locale, date) => (moment(date).format("YYYY"))}
          formatLongDate={(locale, date) => (moment(date).format("YYYY-MM-DD"))}
          formatMonthYear={(locale, date) => (moment(date).format("YYYY-MM"))}
          // 월화수목금토일 한글로 표시
          formatShortWeekday={(locale, date) => {
            const day = moment(date).format("d");
            const week = ["일", "월", "화", "수", "목", "금", "토"];
            return week[day];
          }}
          view={"month"}
          onClickDay={(date) => {
            SEND.id = "";
            SEND.startDt = formatDate(date);
            SEND.endDt = formatDate(date);
            SEND.category = "";
            SEND.toDetail = "/diary/detail";
            navParam(SEND.toDetail, {
              state: SEND
            });
          }}
          tileClassName={({date, view}) => {
            return "calendar-tile-text";
          }}
          tileContent={({date, view}) => {
            const diaryForDates = OBJECT?.filter((diary) => (
              dateInRange(date, diary.diary_startDt, diary.diary_endDt)
            ));
            return (
              <React.Fragment>
                {diaryForDates.length > 0 ? activeLine(diaryForDates) : unActiveLine(diaryForDates)}
              </React.Fragment>
            );
          }}
        />
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
}