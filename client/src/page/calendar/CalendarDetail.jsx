// CalendarDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adorn, Icons, PopUp, Div} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataset") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const navigate = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const location_category = location?.state?.category?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";
  const colors = [
    "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
  ];

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt || moment().format("YYYY-MM-DD"),
      endDt: location_endDt || moment().format("YYYY-MM-DD"),
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
      navigate(SEND?.toList);
    }
    else {
      alert(res.data.msg);
      navigate(SEND?.toList);
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/deletes`, {
      params: {
        user_id: user_id,
        _id: id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      if (Object.keys(res.data.result).length > 0) {
        setOBJECT(res.data.result);
      }
      else {
        navigate(SEND.toList);
      }
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
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

  // 4-2. handler --------------------------------------------------------------------------------->
  const handlerValidate = (e, popTrigger) => {
    const newValInt = Number(e.target.value);
    const newValStr = String(e.target.value);
    if (newValInt < 0) {
      popTrigger.openPopup(e.currentTarget);
    }
    else if (newValInt > 10) {
      popTrigger.openPopup(e.currentTarget);
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
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Div className={"d-column"}>
        <PopUp
          type={"calendar"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["day"]}
                className={""}
                readOnly={false}
                value={moment(DATE.startDt)}
                sx={{
                  width: "80vw",
                  height: "60vh"
                }}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    startDt: moment(date).format("YYYY-MM-DD")
                  }));
                  closePopup();
                }}
              />
            </LocalizationProvider>
          )}>
          {(popTrigger={}) => (
            <TextField
              select={false}
              label={"시작일"}
              size={"small"}
              value={DATE.startDt}
              variant={"outlined"}
              className={"w-60vw mb-20"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Adorn name={"TbCalendarEvent"} className={"w-16 h-16 icon"} position={"start"}/>
                )
              }}
            />
          )}
        </PopUp>
        <PopUp
          type={"calendar"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["day"]}
                className={""}
                readOnly={false}
                value={moment(DATE.endDt)}
                sx={{
                  width: "80vw",
                  height: "60vh"
                }}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    endDt: moment(date).format("YYYY-MM-DD")
                  }));
                  closePopup();
                }}
              />
            </LocalizationProvider>
          )}>
          {(popTrigger={}) => (
            <TextField
              select={false}
              label={"종료일"}
              size={"small"}
              value={DATE.endDt}
              variant={"outlined"}
              className={"w-60vw"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Adorn name={"TbCalendarEvent"} className={"w-16 h-16 icon"} position={"start"}/>
                )
              }}
            />
          )}
        </PopUp>
      </Div>
    );
    // 7-2. count
    const countSection = () => (
      <PopUp
        type={"alert"}
        className={"ms-n6"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>0이상 10이하의 숫자만 입력하세요</Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={"항목수"}
            variant={"outlined"}
            size={"small"}
            className={"w-60vw"}
            value={COUNT?.sectionCnt}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adorn name={"TbTextPlus"} className={"w-16 h-16 icon"} position={"start"}/>
              ),
              endAdornment: (
                null
              )
            }}
            onChange={(e) => {
              handlerValidate(e, popTrigger);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
      </PopUp>
    );
    // 7-4. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <PopUp
        key={index}
        type={"dropdown"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Icons name={"TbTrash"} className={"w-24 h-24 icon"} onClick={() => {
            flowDelete(id, sectionId);
          }}>
            <Div className={"fs-0-8rem"}>삭제</Div>
          </Icons>
        )}>
        {(popTrigger={}) => (
          <Icons name={"TbDots"} className={"w-24 h-24 icon mt-n10 me-n10"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6-2. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mb-40"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, OBJECT?.calendar_section[i]?._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"파트"}
            variant={"outlined"}
            className={"w-25vw me-10"}
            value={OBJECT?.calendar_section[i]?.calendar_part_idx}
            InputProps={{
              readOnly: false,
              startAdornment: (
                null
              ),
              endAdornment: (
                null
              )
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
            variant={"outlined"}
            className={"w-25vw ms-10"}
            value={OBJECT?.calendar_section[i]?.calendar_color}
            InputProps={{
              readOnly: false,
              startAdornment: (
                null
              ),
              endAdornment: (
                null
              )
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
                <span className={`${item}`}>●</span>
                <span className={"ms-10"}>{item}</span>
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
            variant={"outlined"}
            className={"w-60vw"}
            value={OBJECT?.calendar_section[i]?.calendar_title}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adorn name={"TbPin"} className={"w-16 h-16 icon"} position={"start"}/>
              ),
              endAdornment: (
                null
              )
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
            variant={"outlined"}
            className={"w-60vw"}
            value={OBJECT?.calendar_section[i]?.calendar_detail}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adorn name={"TbNote"} className={"w-16 h-16 icon"} position={"start"}/>
              ),
              endAdornment: (
                null
              )
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
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min68vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
        </Div>
        <Div className={"d-column"}>
          {OBJECT?.calendar_section.map((_, i) => (tableFragment(i)))}
        </Div>
      </Div>
    );
    // 7-7. return
    return (
      <Paper className={"content-wrapper"}>
        {tableSection()}
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        part: partStr,
        type: typeStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate, flowSave, flowDelete
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};