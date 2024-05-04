// CalendarDetail.jsx

import React, {useState, useEffect} from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import {NumericFormat} from "react-number-format";
import {useDate} from "../../hooks/useDate.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {DateNode} from "../../fragments/DateNode.jsx";
import {LoadingNode} from "../../fragments/LoadingNode.jsx";
import {Button, Col, Row, Container, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const location_category = location?.state?.category?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList: "/calendar/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [CALENDAR, setCALENDAR] = useState({
    calStartOpen: false,
    calEndOpen: false,
    calOpen: false
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    user_id: user_id,
    calendar_number: 0,
    calendar_startDt: "0000-00-00",
    calendar_endDt: "0000-00-00",
    calendar_section: [{
      calendar_part_idx: 1,
      calendar_part_val: "일정",
      calendar_title : "",
      calendar_color: "#000000",
      calendar_detail: ""
    }]
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const response = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [location_id, user_id, location_category, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
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
        user_id: user_id,
        _id: id,
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

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const colors = [
      "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
    ];
    const dateSection = () => (
      <React.Fragment>
        <Row className={"d-center"}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>시작일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"calendar_startDt"}
                name={"calendar_startDt"}
                className={"form-control pointer"}
                maskChar={null}
                value={DATE?.startDt}
                readOnly={true}
                onClick={() => {
                  setCALENDAR((prev) => ({
                    ...prev,
                    calStartOpen: !prev.calStartOpen
                  }));
                }}
              ></InputMask>
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>종료일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"calendar_endDt"}
                name={"calendar_endDt"}
                className={"form-control pointer"}
                maskChar={null}
                value={DATE?.endDt}
                readOnly={true}
                onClick={() => {
                  setCALENDAR((prev) => ({
                    ...prev,
                    calEndOpen: !prev.calEndOpen
                  }));
                }}
              ></InputMask>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
    const handlerCount = (e) => {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        calendar_part_idx: 1,
        calendar_part_val: "일정",
        calendar_title : "",
        calendar_color: "#000000",
        calendar_detail: ""
      };
      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));
      if (newCount > 0) {
        let updatedSection = Array(newCount).fill(null).map((_, idx) => (
          idx < OBJECT.calendar_section.length ? OBJECT.calendar_section[idx] : {...defaultSection}
        ));
        setOBJECT((prev) => ({
          ...prev,
          calendar_section: updatedSection
        }));
      }
      else {
        setOBJECT((prev) => ({
          ...prev,
          calendar_section: []
        }));
      }
    };
    const countNode = () => (
      <React.Fragment>
        <div className={"input-group"}>
          <span className={"input-group-text"}>섹션 갯수</span>
          <NumericFormat
            min={0}
            max={10}
            minLength={1}
            maxLength={2}
            datatype={"number"}
            displayType={"input"}
            id={"sectionCnt"}
            name={"sectionCnt"}
            className={"form-control"}
            disabled={false}
            thousandSeparator={false}
            fixedDecimalScale={true}
            value={Math.min(10, COUNT?.sectionCnt)}
            onValueChange={(values) => {
              const limitedValue = Math.min(10, parseInt(values?.value));
              handlerCount(limitedValue.toString());
            }}
          ></NumericFormat>
        </div>
      </React.Fragment>
    );
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>파트</span>
              <select
                id={`calendar_part_idx-${i}`}
                name={`calendar_part_idx-${i}`}
                className={"form-select"}
                value={OBJECT?.calendar_section[i]?.calendar_part_idx}
                onChange={(e) => {
                  const newIndex = parseInt(e.target.value);
                  setOBJECT((prev) => ({
                    ...prev,
                    calendar_section: prev.calendar_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        calendar_part_idx: newIndex,
                        calendar_part_val: calendarArray[newIndex]?.calendar_part
                      } : item
                    ))
                  }));
                }}
              >
                {calendarArray?.map((item, idx) => (
                  <option key={idx} value={idx}>
                    {item.calendar_part}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>색상</span>
              <select
                id={`calendar_color-${i}`}
                name={`calendar_color-${i}`}
                className={"form-select"}
                value={OBJECT?.calendar_section[i]?.calendar_color}
                style={{color: OBJECT?.calendar_section[i]?.calendar_color}}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    calendar_section: prev.calendar_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        calendar_color: newColor
                      } : item
                    ))
                  }));
                }}
              >
                {colors.map((color, index) => (
                  <option key={index} value={color} style={{color: color}}>
                    ● {color}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        </Row>
        <Row className={"text-center"}>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>제목</span>
              <InputMask
                mask={""}
                placeholder={"제목"}
                id={`calendar_title-${i}`}
                name={`calendar_title-${i}`}
                className={"form-control"}
                maskChar={null}
                value={OBJECT?.calendar_section[i]?.calendar_title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    calendar_section: prev.calendar_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        calendar_title: newTitle
                      } : item
                    ))
                  }));
                }}
              ></InputMask>
            </div>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>내용</span>
              <InputMask
                mask={""}
                placeholder={"내용"}
                id={`calendar_detail-${i}`}
                name={`calendar_detail-${i}`}
                className={"form-control"}
                maskChar={null}
                value={OBJECT?.calendar_section[i]?.calendar_detail}
                onChange={(e) => {
                  const newDetail = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    calendar_section: prev.calendar_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        calendar_detail: newDetail
                      } : item
                    ))
                  }));
                }}
              ></InputMask>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
    const tableSection = () => (
      <React.Fragment>
        {Array.from({ length: COUNT.sectionCnt }, (_, i) => tableFragment(i))}
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"date-wrapper"}>
          {dateSection()}
        </div>
        <div className={"calendar-detail-wrapper"}>
          {countNode()}
          {tableSection()}
        </div>
      </React.Fragment>
    )
  };

  // 6. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <LoadingNode LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 7. date -------------------------------------------------------------------------------------->
  const dateNode = () => (
    <DateNode DATE={DATE} setDATE={setDATE} CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      part={"calendar"} plan={""} type={"detail"}
    />
  );

  // 11. button ----------------------------------------------------------------------------------->
  const buttonNode = () => (
    <React.Fragment>
      <Button size={"sm"} className={"primary-btn"} onClick={() => {
        flowSave();
      }}>
        저장
      </Button>
      <Button size={"sm"} className={"danger-btn"} onClick={() => {
        flowDelete(OBJECT._id);
      }}>
        삭제
      </Button>
    </React.Fragment>
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
          {LOADING && (
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {loadingNode()}
              </Col>
            </Row>
          )}
          {!LOADING && (
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {dateNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {buttonNode()}
              </Col>
            </Row>
          )}
        </Container>
      </Card>
    </React.Fragment>
  );
}