// CalendarSave.jsx
// Node -> Section -> Fragment

import { useState, useEffect, useRef, createRef } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { moment, axios } from "../../imports/ImportLibs.jsx";
import { Loading, Footer } from "../../imports/ImportLayouts.jsx";
import { Div, Br, Input, Select, Img, Bg } from "../../imports/ImportComponents.jsx";
import { Picker, Memo, Count, Delete } from "../../imports/ImportContainers.jsx";
import { Card, Paper, MenuItem, Grid } from "../../imports/ImportMuis.jsx";
import { calendar2 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const CalendarSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location_id, location_category, location_dateType, location_dateStart, location_dateEnd, calendarArray, colors, URL_OBJECT, sessionId, translate, koreanDate }
  = useCommon();

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
    dateStart: location_dateStart || koreanDate,
    dateEnd: location_dateEnd || koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    calendar_number: 0,
    calendar_dummy: "N",
    calendar_dateType: "",
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
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/exist`, {
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
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/detail`, {
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
          return {
            ...prev,
            ...res.data.result
          };
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
  }, [sessionId, location_id, location_category, DATE.dateStart, DATE.dateEnd]);

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
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
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
        alert(translate(res.data.msg));
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
    axios.post(`${URL_OBJECT}/deletes`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
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
        alert(translate(res.data.msg));
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

  // 7. save ---------------------------------------------------------------------------------------
  const saveNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius p-20"}>
        <Picker
          DATE={DATE}
          setDATE={setDATE}
          EXIST={EXIST}
          setEXIST={setEXIST}
        />
        <Br px={20} />
        <Count
          COUNT={COUNT}
          setCOUNT={setCOUNT}
          limit={10}
        />
      </Card>
    );
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"border radius p-20"} key={i}>
          <Grid container columnSpacing={1}>
            <Grid size={6} className={"d-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 0 ? '#1976d2' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 1 ? '#4CAF50' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 2 ? '#FFC107' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 3 ? '#FF5722' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 4 ? '#673AB7' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 5 ? '#3F51B5' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 6 ? '#2196F3' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 7 ? '#009688' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 8 ? '#CDDC39' :
                  OBJECT?.calendar_section[i]?.calendar_part_idx === 9 ? '#FFEB3B' :
                  '#9E9E9E'
                }
              />
            </Grid>
            <Grid size={6} className={"d-right"}>
              <Delete
                index={i}
                handlerDelete={handlerDelete}
              />
            </Grid>
            <Br px={20} />
            <Grid size={6}>
              <Select
                label={translate("part")}
                value={OBJECT?.calendar_section[i]?.calendar_part_idx}
                inputRef={REFS?.current[i]?.calendar_part_idx}
                error={ERRORS[i]?.calendar_part_idx}
                inputclass={"fs-0-8rem"}
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
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(item.calendar_part)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={6}>
              <Select
                label={translate("color")}
                value={OBJECT?.calendar_section[i]?.calendar_color}
                inputRef={REFS?.current[i]?.calendar_color}
                error={ERRORS[i]?.calendar_color}
                inputclass={"fs-0-8rem"}
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
                  <MenuItem key={idx} value={item} className={"fs-0-8rem"}>
                    <span className={`${item}`}>●</span>
                    <span className={"ms-10"}>{item}</span>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Br px={20} />
            <Grid size={12}>
              <Input
                label={translate("calendarTitle")}
                value={OBJECT?.calendar_section[i]?.calendar_title}
                inputRef={REFS?.current[i]?.calendar_title}
                error={ERRORS[i]?.calendar_title}
                startadornment={
                  <Img src={calendar2} className={"w-16 h-16"} />
                }
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
            </Grid>
            <Br px={20} />
            <Grid size={12}>
              <Memo
                OBJECT={OBJECT}
                setOBJECT={setOBJECT}
                extra={"calendar_content"}
                i={i}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : OBJECT?.calendar_section?.map((_, i) => (cardFragment(i)))
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            {dateCountSection()}
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST
      }}
      flow={{
        navigate, flowSave, flowDeletes
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {saveNode()}
      {footerNode()}
    </>
  );
};