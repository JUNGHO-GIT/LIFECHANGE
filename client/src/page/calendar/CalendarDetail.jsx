// CalendarDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {axios, NumericFormat, InputMask} from "../../import/ImportLibs";
import {useDate, useStorage, useTime} from "../../import/ImportHooks";
import {Header, NavBar} from "../../import/ImportLayouts";
import {DaySave, Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
import {Popover, bindPopover} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const location_category = location?.state?.category?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList: "/calendar/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false
  });

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
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
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [location_id, user_id, location_category, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    if (res.data.status === "success") {
      alert(res.data.msg);
      navParam(SEND?.toList);
    }
    else {
      alert(res.data.msg);
      navParam(SEND?.toList);
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const res = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
        _id: id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      if (Object.keys(res.data.result).length > 0) {
        alert(res.data.msg);
        setOBJECT(res.data.result);
        navParam(SEND?.toList);
      }
      else {
        alert(res.data.msg);
        navParam(SEND?.toList);
      }
    }
    else {
      alert(res.data.msg);
      navParam(SEND?.toList);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const TableNode = () => {
    const colors = [
      "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
    ];
    const handlerCount = (e) => {
    const newCount = Number(e);
      const defaultSection = {
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
          idx < OBJECT?.calendar_section.length ? OBJECT?.calendar_section[idx] : {...defaultSection}
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
        <Box className={"input-group"}>
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
          />
        </Box>
      </React.Fragment>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>파트</span>
              <select
                id={`calendar_part_idx-${i}`}
                name={`calendar_part_idx-${i}`}
                className={"form-select"}
                value={OBJECT?.calendar_section[i]?.calendar_part_idx}
                onChange={(e) => {
                  const newIndex = Number(e.target.value);
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
            </Box>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
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
            </Box>
          </Grid2>
        </Grid2>
        <Grid2 container spacing={3}>
          <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
            <Box className={"input-group"}>
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
              />
            </Box>
          </Grid2>
          <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
            <Box className={"input-group"}>
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
              />
            </Box>
          </Grid2>
        </Grid2>
      </React.Fragment>
    );
    // 7-7. table
    const tableSection = () => (
      <React.Fragment>
        {Array.from({ length: COUNT.sectionCnt }, (_, i) => tableFragment(i))}
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {countNode()}
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

  // 13. btn -------------------------------------------------------------------------------------->
  const BtnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"calendar"} plan={""} type={"save"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const LoadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Header />
      <NavBar />
      {LOADING ? <LoadingNode /> : <TableNode />}
      <BtnNode />
    </React.Fragment>
  );
};