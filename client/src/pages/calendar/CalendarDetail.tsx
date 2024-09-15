// CalendarDetail.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { useValidateCalendar } from "@imports/ImportValidates";
import { Calendar } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportLibs";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Input, Select, Img, Bg } from "@imports/ImportComponents";
import { Picker, Memo, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, MenuItem, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const CalendarDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();
  const {
    dayFmt, getMonthStartFmt, getMonthEndFmt
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, calendarArray, colors, URL_OBJECT, sessionId, toList,
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateCalendar();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(Calendar);
  const [EXIST, setEXIST] = useState<any>({
    day: [""],
    week: [""],
    month: [""],
    year: [""],
    select: [""],
  });
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });
  const [COUNT, setCOUNT] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState<any>({
    dateType: location_dateType || "",
    dateStart: location_dateStart || dayFmt,
    dateEnd: location_dateEnd || dayFmt,
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
          dateStart: getMonthStartFmt(DATE.dateStart),
          dateEnd: getMonthEndFmt(DATE.dateEnd),
        },
      },
    })
    .then((res: any) => {
      setEXIST(
        !res.data.result || res.data.result.length === 0 ? [""] : res.data.result
      );
    })
    .catch((err: any) => {
      console.error(err);
    });
  }, [sessionId, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (LOCKED === "locked") {
      return;
    }
    setLOADING(true);
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || Calendar);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      calendar_part_idx: 0,
      calendar_part_val: "all",
      calendar_title: "",
      calendar_color: "black",
      calendar_content: ""
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_item: any, idx: number) =>
      idx < OBJECT?.calendar_section.length ? OBJECT?.calendar_section[idx] : defaultSection
    );
    setOBJECT((prev: any) => ({
      ...prev,
      calendar_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT, COUNT, DATE, EXIST)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/detail`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(toList, {
          state: SEND
        });
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDelete = async () => {
    if (OBJECT?._id === "") {
      alert(translate("noData"));
      return;
    }
    axios.delete(`${URL_OBJECT}/delete`, {
      data: {
        user_id: sessionId,
        _id: OBJECT?._id,
        DATE: DATE,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(toList, {
          state: SEND
        });
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerDelete = (index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      calendar_section: prev.calendar_section.filter((_item: any, idx: number) => (idx !== index))
    }));
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius p-20"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Picker
              DATE={DATE}
              setDATE={setDATE}
              EXIST={EXIST}
              setEXIST={setEXIST}
            />
          </Grid>
          <Grid size={12}>
            <Count
              COUNT={COUNT}
              setCOUNT={setCOUNT}
              LOCKED={LOCKED}
              setLOCKED={setLOCKED}
              limit={10}
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          <Grid container spacing={2}>
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
                LOCKED={LOCKED}
              />
            </Grid>
            <Grid size={6}>
              <Select
                label={translate("part")}
                value={OBJECT?.calendar_section[i]?.calendar_part_idx}
                inputRef={REFS?.current[i]?.calendar_part_idx}
                error={ERRORS[i]?.calendar_part_idx}
                inputclass={"fs-0-8rem"}
                locked={LOCKED}
                onChange={(e: any) => {
                  const newIndex = Number(e.target.value);
                  setOBJECT((prev: any) => ({
                    ...prev,
                    calendar_section: prev.calendar_section?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        calendar_part_idx: newIndex,
                        calendar_part_val: calendarArray[newIndex]?.calendar_part
                      } : item
                    ))
                  }));
                }}
              >
                {calendarArray?.map((item: any, idx: number) => (
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
                locked={LOCKED}
                onChange={(e: any) => {
                  const newColor = e.target.value;
                  setOBJECT((prev: any) => ({
                    ...prev,
                    calendar_section: prev.calendar_section?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        calendar_color: newColor
                      } : item
                    ))
                  }));
                }}
              >
                {colors.map((item: any, idx: number) => (
                  <MenuItem key={idx} value={item} className={"fs-0-8rem"}>
                    <span className={item}>●</span>
                    <span className={"ms-10"}>{item}</span>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={12}>
              <Input
                label={translate("calendarTitle")}
                value={OBJECT?.calendar_section[i]?.calendar_title}
                inputRef={REFS?.current[i]?.calendar_title}
                error={ERRORS[i]?.calendar_title}
                locked={LOCKED}
                startadornment={
                  <Img
                  	key={"calendar2"}
                  	src={"calendar2"}
                  	className={"w-16 h-16"}
                  />
                }
                onChange={(e: any) => {
                  const newTitle = e.target.value;
                  setOBJECT((prev: any) => ({
                    ...prev,
                    calendar_section: prev.calendar_section?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        calendar_title: newTitle
                      } : item
                    ))
                  }));
                }}
              />
            </Grid>
            <Grid size={12}>
              <Memo
                OBJECT={OBJECT}
                setOBJECT={setOBJECT}
                LOCKED={LOCKED}
                extra={"calendar_content"}
                i={i}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : OBJECT?.calendar_section?.map((item: any, i: number) => (
            detailFragment(i)
          ))
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {dateCountSection()}
            {detailSection()}
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
        flowSave, flowDelete
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {detailNode()}
      {footerNode()}
    </>
  );
};