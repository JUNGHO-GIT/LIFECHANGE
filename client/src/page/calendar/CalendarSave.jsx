// CalendarSave.jsx

import {React, useState, useEffect, useRef, createRef} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {percent, log} from "../../import/ImportUtils.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../import/ImportComponents.jsx";
import {Img, Picker, Memo, Count, Delete} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem, TextField} from "../../import/ImportMuis.jsx";
import {calendar2} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const CalendarSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCategory") || "{}";
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
  const sessionId = sessionStorage.getItem("sessionId");
  const colors = [
    "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
  ];

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    calendar_number: 0,
    calendar_dummy: false,
    calendar_dateStart: "0000-00-00",
    calendar_dateEnd: "0000-00-00",
    calendar_section: [{
      calendar_part_idx: 0,
      calendar_part_val: "all",
      calendar_color: "black",
      calendar_title : "",
      calendar_content: ""
    }]
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-4. validate ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState(OBJECT?.calendar_section?.map(() => ({
    calendar_part_idx: false,
    calendar_color: false,
    calendar_title: false,
  })));
  const REFS = useRef(OBJECT?.calendar_section?.map(() => ({
    calendar_part_idx: createRef(),
    calendar_color: createRef(),
    calendar_title: createRef(),
  })));

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
          dateStart: moment(DATE.dateStart).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(DATE.dateEnd).endOf("month").format("YYYY-MM-DD")
        },
      },
    })
    .then((res) => {
      setEXIST(res.data.result || []);
      setLOADING(false);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: location_id,
        DATE: DATE,
      },
    })
    .then((res) => {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT((prev) => {
        if (prev.length === 1 && prev[0]?._id === "") {
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
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId, location_id, location_category, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      calendar_part_idx: 0,
      calendar_part_val: "all",
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

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    REFS.current = OBJECT?.calendar_section.map((_, idx) => ({
      calendar_part_idx: REFS?.current[idx]?.calendar_part_idx || createRef(),
      calendar_color: REFS?.current[idx]?.calendar_color || createRef(),
      calendar_title: REFS?.current[idx]?.calendar_title || createRef(),
    }));
  }, [OBJECT?.calendar_section.length]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT) => {
    let foundError = false;
    const initialErrors = OBJECT?.calendar_section?.map(() => ({
      calendar_part_idx: false,
      calendar_color: false,
      calendar_title: false,
    }));

    if (COUNT.newSectionCnt === 0) {
      alert(translate("errorCount"));
      foundError = true;
      return;
    }

    for (let idx = 0; idx < OBJECT?.calendar_section.length; idx++) {
      const section = OBJECT?.calendar_section[idx];
      const refsCurrentIdx = REFS?.current[idx];
      if (!refsCurrentIdx) {
        console.warn('Ref is undefined, skipping validation for index:', idx);
        continue;
      }
      else if (!section.calendar_part_idx || section.calendar_part_idx === 0) {
        alert(translate("errorCalendarPart"));
        refsCurrentIdx.calendar_part_idx.current &&
        refsCurrentIdx.calendar_part_idx?.current?.focus();
        initialErrors[idx].calendar_part_idx = true;
        foundError = true;
        break;
      }
      else if (!section.calendar_title || section.calendar_title === "") {
        alert(translate("errorCalendarTitle"));
        refsCurrentIdx.calendar_title.current &&
        refsCurrentIdx.calendar_title?.current?.focus();
        initialErrors[idx].calendar_title = true;
        foundError = true;
        break;
      }
      else if (!section.calendar_color || section.calendar_color === "") {
        alert(translate("errorCalendarColor"));
        refsCurrentIdx.calendar_color.current &&
        refsCurrentIdx.calendar_color?.current?.focus();
        initialErrors[idx].calendar_color = true;
        foundError = true;
        break;
      }
    }
    setERRORS(initialErrors);

    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT)) {
      return;
    }
    await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        Object.assign(SEND, {
          dateType: "",
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
    })
    .catch((err) => {
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDeletes = async () => {
    if (OBJECT?._id === "") {
      alert(translate("noData"));
      return;
    }
    await axios.post(`${URL_OBJECT}/deletes`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        Object.assign(SEND, {
          dateType: "",
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
    })
    .catch((err) => {
      console.error(err);
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
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

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius shadow-none p-20"}>
        <Picker
          DATE={DATE}
          setDATE={setDATE}
          EXIST={EXIST}
          setEXIST={setEXIST}
        />
        <Br20/>
        <Count
          COUNT={COUNT}
          setCOUNT={setCOUNT}
          limit={10}
        />
      </Card>
    );
    // 7-3. table
    const tableSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const tableFragment = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          <Div className={"d-between"}>
            <Badge
              badgeContent={i + 1}
              color={"primary"}
              showZero={true}
            />
            <Delete
              id={OBJECT?._id}
              sectionId={OBJECT?.calendar_section[i]?._id}
              index={i}
              handlerDelete={handlerDelete}
            />
          </Div>
          <Br40/>
          <Div className={"d-center"}>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              label={translate("part")}
              value={OBJECT?.calendar_section[i]?.calendar_part_idx}
              inputRef={REFS?.current[i]?.calendar_part_idx}
              error={ERRORS[i]?.calendar_part_idx}
              InputProps={{
                readOnly: false,
              }}
              onChange={(e) => {
                const newIndex = Number(e.target.value);
                setOBJECT((prev) => ({
                  ...prev,
                  calendar_section: prev.calendar_section?.map((item, idx) => (
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
                <MenuItem key={idx} value={idx}>
                  <Div className={"fs-0-8rem"}>
                    {translate(item.calendar_part)}
                  </Div>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              label={translate("color")}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              value={OBJECT?.calendar_section[i]?.calendar_color}
              inputRef={REFS?.current[i]?.calendar_color}
              error={ERRORS[i]?.calendar_color}
              InputProps={{
                readOnly: false,
              }}
              onChange={(e) => {
                const newColor = e.target.value;
                setOBJECT((prev) => ({
                  ...prev,
                  calendar_section: prev.calendar_section?.map((item, idx) => (
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
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              variant={"outlined"}
              className={"w-86vw"}
              label={translate("calendarTitle")}
              value={OBJECT?.calendar_section[i]?.calendar_title}
              inputRef={REFS?.current[i]?.calendar_title}
              error={ERRORS[i]?.calendar_title}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Img src={calendar2} className={"w-16 h-16"} />
                ),
              }}
              onChange={(e) => {
                const newTitle = e.target.value;
                setOBJECT((prev) => ({
                  ...prev,
                  calendar_section: prev.calendar_section?.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      calendar_title: newTitle
                    } : item
                  ))
                }));
              }}
            />
          </Div>
          <Br20/>
          <Div className={"d-center"}>
            <Memo
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              extra={"calendar_content"}
              i={i}
            />
          </Div>
          <Br20/>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? loadingFragment() : OBJECT?.calendar_section?.map((_, i) => (tableFragment(i)))
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min75vh"}>
          {dateCountSection()}
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT, EXIST
      }}
      functions={{
        setDATE, setSEND, setCOUNT, setEXIST
      }}
      handlers={{
        navigate, flowSave, flowDeletes
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};