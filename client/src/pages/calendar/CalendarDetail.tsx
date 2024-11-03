// CalendarDetail.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useValidateCalendar } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importHooks";
import { Calendar } from "@importSchemas";
import { axios } from "@importLibs";
import { Loader, Footer, Dialog } from "@importLayouts";
import { PickerDay, Memo, Count, Delete, Input, Select } from "@importContainers";
import { Img, Bg } from "@importComponents";
import { Paper, MenuItem, Grid, Card } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const CalendarDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, navigate, toList, toToday, sessionId } = useCommonValue();
  const { calendarArray, calendarColors, bgColors } = useCommonValue();
  const { location_from, location_dateType } = useCommonValue();
  const { location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { ALERT, setALERT } = useStoreAlert();
  const { ERRORS, REFS, validate } = useValidateCalendar();

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
  const [FLOW, setFLOW] = useState<any>({
    exist: false,
    itsMe: false,
    itsNew: false,
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
    dateType: location_dateType || "select",
    dateStart: location_dateStart || getDayFmt(),
    dateEnd: location_dateEnd || getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.calendar_dateStart.trim()} - ${OBJECT.calendar_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.calendar_dateStart === "0000-00-00" &&
        OBJECT.calendar_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.calendar_dateEnd]);

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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    if (LOCKED === "locked") {
      setLOADING(false);
      return;
    }
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      // 기본값 설정
      setOBJECT(res.data.result || Calendar);

      // sectionCnt가 0이면 section 초기화
      if (res.data.sectionCnt <= 0) {
        setOBJECT((prev: any) => ({
          ...prev,
          calendar_section: [],
        }));
      }
      // sectionCnt가 0이 아니면 section 내부 재정렬
      else {
        setOBJECT((prev: any) => ({
          ...prev,
          calendar_section: prev.calendar_section.sort((a: any, b: any) => (
            calendarArray.findIndex((item: any) => item.calendar_part === a.calendar_part) -
            calendarArray.findIndex((item: any) => item.calendar_part === b.calendar_part)
          )),
        }));
      }

      // count 설정
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setTimeout(() => {
        setLOADING(false);
      }, 100);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      calendar_part: calendarArray[1]?.calendar_part || "",
      calendar_title: "",
      calendar_color: "",
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
  const flowSave = async (type: string) => {
    setLOADING(true);
    if (!await validate(OBJECT, COUNT, "real")) {
      setLOADING(false);
      return;
    }
    axios({
      method: type === "create" ? "post" : "put",
      url: type === "create" ? `${URL_OBJECT}/create` : `${URL_OBJECT}/update`,
      data: {
        user_id: sessionId,
        OBJECT: OBJECT,
        DATE: DATE,
        type: type,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(location_from === "today" ? toToday : toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setTimeout(() => {
        setLOADING(false);
      }, 100);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDelete = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, COUNT, "delete")) {
      setLOADING(false);
      return;
    }
    axios.delete(`${URL_OBJECT}/delete`, {
      data: {
        user_id: sessionId,
        DATE: DATE,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(location_from === "today" ? toToday : toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setTimeout(() => {
        setLOADING(false);
      }, 100);
    });
  };

  // 4-3. handle----------------------------------------------------------------------------------
  const handleDelete = (index: number) => {
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
      <Grid container={true} spacing={2} className={"border-1 radius-1 p-20"}>
        <Grid size={12}>
          <PickerDay
            DATE={DATE}
            setDATE={setDATE}
            EXIST={EXIST}
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
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT.calendar_section?.filter((f: any) => f).map((item: any, i: number) => (
            <Grid container spacing={2} className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-1 p-20`}  key={`detail-${i}`}>
              {/** row 1 **/}
              <Grid container={true} spacing={2}>
                <Grid size={6} className={"d-row-left"}>
                  <Bg
                    badgeContent={i + 1}
                    bgcolor={bgColors?.[calendarArray?.findIndex((f: any) => f.calendar_part === item?.calendar_part)]}
                  />
                </Grid>
                <Grid size={6} className={"d-row-right"}>
                  <Delete
                    index={i}
                    handleDelete={handleDelete}
                    LOCKED={LOCKED}
                  />
                </Grid>
              </Grid>
              {/** /.row 1 **/}

              {/** row 2 **/}
              <Grid container={true} spacing={2}>
                <Grid size={6}>
                  <Select
                    locked={LOCKED}
                    label={translate("part")}
                    value={item?.calendar_part || ""}
                    inputRef={REFS?.[i]?.calendar_part}
                    error={ERRORS?.[i]?.calendar_part}
                    onChange={(e: any) => {
                      let value = String(e.target.value || "");
                      setOBJECT((prev: any) => ({
                        ...prev,
                        calendar_section: prev.calendar_section?.map((section: any, idx: number) => (
                          idx === i ? {
                            ...section,
                            calendar_part: value
                          } : section
                        ))
                      }));
                    }}
                  >
                    {calendarArray?.map((part: any, idx: number) => (
                      <MenuItem
                        key={idx}
                        value={part?.calendar_part}
                        className={"fs-0-8rem"}
                      >
                        {translate(part?.calendar_part)}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid size={6}>
                  <Select
                    label={translate("color")}
                    value={item?.calendar_color || ""}
                    inputRef={REFS?.[i]?.calendar_color}
                    error={ERRORS?.[i]?.calendar_color}
                    locked={LOCKED}
                    onChange={(e: any) => {
                      let value = String(e.target.value || "");
                      setOBJECT((prev: any) => ({
                        ...prev,
                        calendar_section: prev.calendar_section?.map((section: any, idx: number) => (
                          idx === i ? {
                            ...section,
                            calendar_color: value
                          } : section
                        ))
                      }));
                    }}
                  >
                    {calendarColors.map((color: string, idx: number) => (
                      <MenuItem
                        key={idx}
                        value={color}
                        className={"fs-0-8rem"}
                      >
                        <span className={color}>●</span>
                        <span className={"ms-10"}>{color}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              {/** /.row 2 **/}

              {/** row 3 **/}
              <Grid container={true} spacing={2}>
                <Grid size={12}>
                  <Input
                    label={translate("calendarTitle")}
                    value={item?.calendar_title || ""}
                    inputRef={REFS?.[i]?.calendar_title}
                    error={ERRORS?.[i]?.calendar_title}
                    locked={LOCKED}
                    startadornment={
                      <Img
                        max={15}
                        hover={true}
                        shadow={false}
                        radius={false}
                        src={"calendar2"}
                      />
                    }
                    onChange={(e: any) => {
                      let value = String(e.target.value || "");
                      setOBJECT((prev: any) => ({
                        ...prev,
                        calendar_section: prev.calendar_section?.map((section: any, idx: number) => (
                          idx === i ? {
                            ...section,
                            calendar_title: value
                          } : section
                        ))
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              {/** /.row 3 **/}

              {/** row 4 **/}
              <Grid container={true} spacing={2}>
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
              {/** /.row 4 **/}
            </Grid>
          ))}
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {COUNT?.newSectionCnt > 0 && detailFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        {dateCountSection()}
        {LOADING ? <Loader /> : detailSection()}
      </Paper>
    );
  };

  // 8. dialog -------------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      LOCKED={LOCKED}
      setLOCKED={setLOCKED}
    />
  );

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST, FLOW,
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST, setFLOW,
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
      {dialogNode()}
      {footerNode()}
    </>
  );
};