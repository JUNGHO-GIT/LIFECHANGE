// CalendarSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem} from "../../import/ImportMuis.jsx";
import {Button, TextArea} from "../../import/ImportMuis.jsx";
import {TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1, common2, common4, common3, calendar2, calendar3, common5} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const CalendarSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const session = sessionStorage.getItem("dataSet") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const location_category = location?.state?.category?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
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
  const [sessionId, setSessionId] = useState(sessionStorage.getItem("sessionId") || "{}");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList: "/calendar/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    user_id: sessionId,
    calendar_number: 0,
    calendar_startDt: "0000-00-00",
    calendar_endDt: "0000-00-00",
    calendar_section: [{
      calendar_part_idx: 1,
      calendar_part_val: "일정",
      calendar_title : "",
      calendar_color: "#000000",
      calendar_content: ""
    }]
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [sessionId, location_id, location_category, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const defaultSection = {
      calendar_part_idx: 0,
      calendar_part_val: "전체",
      calendar_title: "",
      calendar_color: "black",
      calendar_content: ""
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.calendar_section.length ? OBJECT?.calendar_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      calendar_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
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
        user_id: sessionId,
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

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      calendar_section: prev.calendar_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: prev.sectionCnt - 1,
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Div className={"d-row"}>
        <PopUp
          type={"calendar"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["day"]}
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
              label={translate("common-startDt")}
              size={"small"}
              value={DATE.startDt}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
              className: "fw-bold",
              startAdornment: (
                  <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
                ),
                endAdornment: null
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
              label={translate("common-endDt")}
              size={"small"}
              value={DATE.endDt}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                className: "fw-bold",
                startAdornment: (
                  <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
                ),
                endAdornment: null
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
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>
            {`${COUNT.sectionCnt}개 이상 10개 이하로 입력해주세요.`}
          </Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={translate("common-count")}
            variant={"outlined"}
            size={"small"}
            className={"w-86vw"}
            value={COUNT.newSectionCnt}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={common2} className={"w-16 h-16 me-10"} alt={"common2"}/>
              ),
              endAdornment: (
                <Div className={"d-center me-n10"}>
                  <Icons
                    name={"TbMinus"}
                    className={"w-14 h-14 black"}
                    onClick={(e) => {
                      COUNT.newSectionCnt > COUNT.sectionCnt ? (
                        setCOUNT((prev) => ({
                          ...prev,
                          newSectionCnt: prev.newSectionCnt - 1
                        }))
                      ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    }}
                  />
                  <Icons
                    name={"TbPlus"}
                    className={"w-14 h-14 black"}
                    onClick={(e) => {
                      COUNT.newSectionCnt < 10 ? (
                        setCOUNT((prev) => ({
                          ...prev,
                          newSectionCnt: prev.newSectionCnt + 1
                        }))
                      ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    }}
                  />
                </Div>
              )
            }}
          />
        )}
      </PopUp>
    );
    // 7-3. total (x)
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
          <Div className={"d-row"}>
            <img src={common5} className={"w-16 h-16 icon pointer"} alt={"common5"}
              onClick={() => {
                handlerDelete(index);
                closePopup();
              }}
            />
            <Div className={"fs-0-8rem"}>{translate("common-delete")}</Div>
          </Div>
        )}>
        {(popTrigger={}) => (
          <img src={common3} className={"w-24 h-24 mt-n10 me-n10 pointer"} alt={"common3"}
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
            className={"w-40vw me-3vw"}
            value={OBJECT?.calendar_section[i]?.calendar_part_idx}
            InputProps={{
              readOnly: false,
              startAdornment: null,
              endAdornment: null
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
            className={"w-40vw ms-3vw"}
            value={OBJECT?.calendar_section[i]?.calendar_color}
            InputProps={{
              readOnly: false,
              startAdornment: null,
              endAdornment: null
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
            className={"w-86vw"}
            value={OBJECT?.calendar_section[i]?.calendar_title}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={calendar2} className={"w-16 h-16 me-10"} alt={"calendar2"}/>
              ),
              endAdornment: null
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
          <PopUp
            key={i}
            type={"innerCenter"}
            position={"top"}
            direction={"center"}
            contents={({closePopup}) => (
              <Div className={"d-column"}>
                <Div className={"d-center mb-20"}>
                  <TextArea
                    readOnly={false}
                    className={"w-70vw h-55vh border p-10"}
                    value={OBJECT?.calendar_section[i]?.calendar_content}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      setOBJECT((prev) => ({
                        ...prev,
                        calendar_section: prev.calendar_section.map((item, idx) => (
                          idx === i ? {
                            ...item,
                            calendar_content: newContent
                          } : item
                        ))
                      }));
                    }}
                  />
                </Div>
                <Div className={"d-center"}>
                  <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
                    className={"primary-btn me-5"} onClick={() => {
                      closePopup();
                    }}>
                    저장
                  </Button>
                </Div>
              </Div>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={"메모"}
                size={"small"}
                variant={"outlined"}
                className={"w-86vw pointer"}
                value={OBJECT?.calendar_section[i]?.calendar_content}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={calendar3} className={"w-16 h-16 me-10"} alt={"calendar3"}/>
                  ),
                  endAdornment: null
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget);
                }}
              />
            )}
          </PopUp>
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min67vh"}>
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
        first: firstStr,
        second: secondStr,
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