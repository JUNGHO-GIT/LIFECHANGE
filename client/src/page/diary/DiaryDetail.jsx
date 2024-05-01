// DiaryDetail.jsx

import React, {useState, useEffect} from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import {NumericFormat} from "react-number-format";
import {useDate} from "../../hooks/useDate.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {DateNode} from "../../fragments/DateNode.jsx";
import {Button, Col, Row, Container, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DiaryDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_DIARY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const session = sessionStorage.getItem("dataset") || "";
  const diaryArray = JSON.parse(session)?.diary || [];
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
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    customer_id: customer_id,
    diary_number: 0,
    diary_startDt: "0000-00-00",
    diary_endDt: "0000-00-00",
    diary_section: [{
      diary_part_idx: 1,
      diary_part_val: "일정",
      diary_title : "",
      diary_color: "#000000",
      diary_detail: ""
    }]
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
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [location_id, customer_id, location_category, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      customer_id: customer_id,
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
      {name: "red", value: "#ff0000"},
      {name: "orange", value: "#ffa500"},
      {name: "yellow", value: "#ffff00"},
      {name: "green", value: "#008000"},
      {name: "blue", value: "#0000ff"},
      {name: "navy", value: "#000080"},
      {name: "purple", value: "#800080"},
      {name: "black", value: "#000000"},
      {name: "gray", value: "#808080"}
    ];
    const dateSection = () => (
      <React.Fragment>
        <Row className={"d-center"}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>시작일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"diary_startDt"}
                name={"diary_startDt"}
                className={"form-control"}
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
                id={"diary_endDt"}
                name={"diary_endDt"}
                className={"form-control"}
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
        diary_part_idx: 1,
        diary_part_val: "일정",
        diary_title : "",
        diary_color: "#000000",
        diary_detail: ""
      };
      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));
      if (newCount > 0) {
        let updatedSection = Array(newCount).fill(null).map((_, idx) => (
          idx < OBJECT.diary_section.length ? OBJECT.diary_section[idx] : {...defaultSection}
        ));
        setOBJECT((prev) => ({
          ...prev,
          diary_section: updatedSection
        }));
      }
      else {
        setOBJECT((prev) => ({
          ...prev,
          diary_section: []
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
                id={`diary_part_idx-${i}`}
                name={`diary_part_idx-${i}`}
                className={"form-select"}
                value={OBJECT?.diary_section[i]?.diary_part_idx}
                onChange={(e) => {
                  const newIndex = parseInt(e.target.value);
                  setOBJECT((prev) => ({
                    ...prev,
                    diary_section: prev.diary_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        diary_part_idx: newIndex,
                        diary_part_val: diaryArray[newIndex]?.diary_part
                      } : item
                    ))
                  }));
                }}
              >
                {diaryArray?.map((item, idx) => (
                  <option key={idx} value={idx}>
                    {item.diary_part}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>색상</span>
              <select
                id={`diary_color-${i}`}
                name={`diary_color-${i}`}
                className={"form-select"}
                value={OBJECT?.diary_section[i]?.diary_color}
                style={{color: OBJECT?.diary_section[i]?.diary_color}}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    diary_section: prev.diary_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        diary_color: newColor
                      } : item
                    ))
                  }));
                }}
              >
                {colors.map((color, index) => (
                  <option key={index} value={color.value} style={{color: color.value}}>
                    ● {color.name}
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
                id={`diary_title-${i}`}
                name={`diary_title-${i}`}
                className={"form-control"}
                maskChar={null}
                value={OBJECT?.diary_section[i]?.diary_title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    diary_section: prev.diary_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        diary_title: newTitle
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
                id={`diary_detail-${i}`}
                name={`diary_detail-${i}`}
                className={"form-control"}
                maskChar={null}
                value={OBJECT?.diary_section[i]?.diary_detail}
                onChange={(e) => {
                  const newDetail = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    diary_section: prev.diary_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        diary_detail: newDetail
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
        <div className={"diary-detail-wrapper"}>
          {countNode()}
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 5. date -------------------------------------------------------------------------------------->
  const dateNode = () => (
    <DateNode DATE={DATE} setDATE={setDATE} CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      part={"diary"} plan={""} type={"detail"}
    />
  );

  // 9. button ------------------------------------------------------------------------------------>
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"card-wrapper"}>
        <Container fluid={true}>
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
        </Container>
      </Card>
    </React.Fragment>
  );
}