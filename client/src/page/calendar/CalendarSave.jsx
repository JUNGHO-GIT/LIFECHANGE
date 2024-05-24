// CalendarSave.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../import/ImportReacts.jsx";
import {moment, axios} from "../../import/ImportLibs.jsx";
import {useDate, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Icons, Br20} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem} from "../../import/ImportMuis.jsx";
import {Button, TextArea} from "../../import/ImportMuis.jsx";
import {TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1, common2, common3_1, calendar2, calendar3, common5} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const CalendarSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataSet") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_id = location?.state?.id;
  const location_dateType = location?.state?.dateType;
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const location_category = location?.state?.category;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const colors = [
    "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
  ];

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [isExist, setIsExist] = useState([""]);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList: "/calendar/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType,
    dateStart: location_dateStart,
    dateEnd: location_dateEnd
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    calendar_number: 0,
    calendar_demo: false,
    calendar_dateType: "",
    calendar_dateStart: "0000-00-00",
    calendar_dateEnd: "0000-00-00",
    calendar_section: [{
      calendar_part_idx: 1,
      calendar_part_val: "일정",
      calendar_title : "",
      calendar_color: "black",
      calendar_content: ""
    }]
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: location_id,
        DATE: DATE,
      },
    });
    // 첫번째 객체를 제외하고 데이터 추가
    setOBJECT((prev) => {
      if (prev.length === 1 && prev[0]._id === "") {
        return res.data.result;
      }
      else {
        return {...prev, ...res.data.result};
      }
    });
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [sessionId, location_id, location_category, DATE.dateStart, DATE.dateEnd]);

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
      DATE: DATE,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      Object.assign(SEND, {
        dateStart: DATE.dateStart,
        dateEnd: DATE.dateEnd
      });
      navigate(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/deletes`, {
      params: {
        user_id: sessionId,
        _id: id,
        section_id: section_id,
        DATE: DATE,
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
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Div className={"d-center"}>
        <PopUp
          type={"innerCenter"}
          position={"center"}
          direction={"center"}
          contents={({closePopup}) => (
          <Div className={"d-center w-80vw"}>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["year", "day"]}
                readOnly={false}
                defaultValue={moment(DATE.dateStart)}
                className={"radius border h-60vh"}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    dateStart: moment(date).format("YYYY-MM-DD"),
                    dateEnd: moment(date).format("YYYY-MM-DD")
                  }));
                }}
              />
            </LocalizationProvider>
          </Div>
        )}>
          {(popTrigger={}) => (
            <TextField
              type={"text"}
              size={"small"}
              label={"기간"}
              variant={"outlined"}
              value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
              className={"w-86vw"}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Img src={common1} className={"w-16 h-16"} />
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
    );
    // 7-2. count
    const countSection = () => (
      <Div className={"d-center"}>
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
                startAdornment: (
                  <Img src={common2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"d-center me-n10"}>
                    <Icons
                      name={"TbMinus"}
                      className={"w-20 h-20 black"}
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
                      className={"w-20 h-20 black"}
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
      </Div>
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
          <Div className={"d-center"}>
            <Img src={common5} className={"w-16 h-16 pointer"}
              onClick={() => {
                handlerDelete(index);
                closePopup();
              }}
            />
            {translate("common-delete")}
          </Div>
        )}>
        {(popTrigger={}) => (
          <Img src={common3_1} className={"w-24 h-24 mt-n10 me-n10 pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    );
    // 7-7. fragment
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
              startAdornment: (
                <Img src={calendar2} className={"w-16 h-16"} />
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
                  startAdornment: (
                    <Img src={calendar3} className={"w-16 h-16"} />
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
    // 7-8. table
    const tableSection = () => (
      COUNT?.newSectionCnt > 0 && (OBJECT?.calendar_section.map((_, i) => (
        tableFragment(i)
      )))
    );
    // 7-9. first
    const firstSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        {dateSection()}
        <Br20/>
        {countSection()}
      </Card>
    );
    // 7-10. second (x)
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {firstSection()}
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

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
      {tableNode()}
      {footerNode()}
    </>
  );
};