// CalendarDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime} from "../../import/ImportHooks.jsx";
import {Header, NavBar, Loading} from "../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopAlert, PopUp, PopDown} from "../../import/ImportComponents.jsx";
import {Div, Hr10, Br10, Paging, Filter, Btn} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, Button} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataset") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const location_category = location?.state?.category?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const colors = [
    "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
  ];

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

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
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <p className={"fs-15"}>
        달력 Detail
      </p>
    );
    // 7-2. date
    const dateSection = () => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DesktopDatePicker
          label={"날짜"}
          value={moment(DATE.startDt, "YYYY-MM-DD")}
          format={"YYYY-MM-DD"}
          timezone={"Asia/Seoul"}
          views={["day"]}
          className={"m-auto"}
          readOnly={false}
          slotProps={{
            textField: {sx: {
              width: "220px",
            }},
            layout: {sx: {
              "& .MuiPickersLayout-contentWrapper": {
                width: "220px",
                height: "280px",
              },
              "& .MuiDateCalendar-root": {
                width: "210px",
                height: "270px",
              },
              "& .MuiPickersDay-root": {
                width: "28px",
                height: "28px",
              },
            }},
          }}
          onChange={(day) => {
            setDATE((prev) => ({
              ...prev,
              startDt: moment(day).format("YYYY-MM-DD"),
              endDt: moment(day).format("YYYY-MM-DD")
            }));
          }}
        />
      </LocalizationProvider>
    );
    // 7-3. count
    const countSection = () => {
      const handlerCount = (e) => {
        const newCount = Number(e);
        const defaultSection = {
          calendar_part_idx: 0,
          calendar_part_val: "전체",
          calendar_title: "",
          calendar_color: "#000000",
          calendar_detail: ""
        };
        setCOUNT((prev) => ({
          ...prev,
          sectionCnt: newCount
        }));
        if (newCount > 0) {
          let updatedSection = Array(newCount).fill(null).map((_, idx) => (
            idx < OBJECT?.calendar_section.length ? OBJECT?.calendar_section[idx] : defaultSection
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
      return (
        <PopAlert elementId={"sectionCnt"} contents={
          <p className={"fs-15"}>0이상 10이하의 숫자만 입력하세요.</p>
        }>
          {popProps => (
            <TextField
              type={"text"}
              id={"sectionCnt"}
              label={"항목수"}
              variant={"outlined"}
              size={"small"}
              className={"w-220"}
              value={COUNT?.sectionCnt}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Adornment name={"TbTextPlus"} className={"w-18 h-18 dark"} position={"start"} />
                )
              }}
              onChange={(e) => {
                const newValInt = Number(e.target.value);
                const newValStr = String(e.target.value);
                if (newValInt < 0) {
                  popProps.openPopup(e.currentTarget);
                }
                else if (newValInt > 10) {
                  popProps.openPopup(e.currentTarget);
                }
                else if (newValStr === "") {
                  handlerCount("");
                }
                else if (isNaN(newValInt) || newValStr === "NaN") {
                  handlerCount("0");
                }
                else if (newValStr.startsWith("0")) {
                  handlerCount(newValStr.replace(/^0+/, ""));
                }
                else {
                  handlerCount(newValStr);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          )}
        </PopAlert>
      );
    };
    // 7-6. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"파트"}
            id={`calendar_part_val-${i}`}
            name={`calendar_part_val-${i}`}
            variant={"outlined"}
            className={"w-100 me-10"}
            value={OBJECT?.calendar_section[i]?.calendar_part_idx}
            InputProps={{
              readOnly: false
            }}
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
            {calendarArray.map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.calendar_part}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"색상"}
            id={`calendar_color-${i}`}
            name={`calendar_color-${i}`}
            variant={"outlined"}
            className={"w-100 ms-10"}
            value={OBJECT?.calendar_section[i]?.calendar_color}
            InputProps={{
              readOnly: false
            }}
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
            {colors.map((item, idx) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"제목"}
            id={`calendar_title-${i}`}
            name={`calendar_title-${i}`}
            variant={"outlined"}
            className={"w-220"}
            value={OBJECT?.calendar_section[i]?.calendar_title}
            InputProps={{
              readOnly: false
            }}
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
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"상세"}
            id={`calendar_detail-${i}`}
            name={`calendar_detail-${i}`}
            variant={"outlined"}
            className={"w-220"}
            value={OBJECT?.calendar_section[i]?.calendar_detail}
            InputProps={{
              readOnly: false
            }}
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
        </Div>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min500"}>
        <Div className={"d-center p-10"}>
          {titleSection()}
        </Div>
        <Hr10 className={"mb-20"} />
        <Div className={"d-column mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
        </Div>
        <Div className={"d-column"}>
          {OBJECT?.calendar_section.map((item, i) => tableFragment(i))}
        </Div>
      </Div>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn  DATE={DATE} setDATE={setDATE} SEND={SEND}  FILTER={""} setFILTER={""}
      PAGING={""} setPAGING={""} flowSave={flowSave} navParam={navParam}
      part={"calendar"} plan={""} type={"save"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </>
  );
};