// SleepDetail.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useTime, useValidateSleep } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { Sleep } from "@importSchemas";
import { axios } from "@importLibs";
import { sync } from "@importScripts";
import { Footer, Dialog } from "@importLayouts";
import { PickerDay, PickerTime, Count, Delete } from "@importContainers";
import { Bg, Paper, Grid, Card } from "@importComponents";

// -------------------------------------------------------------------------------------------------
export const SleepDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, navigate, toToday, toList } = useCommonValue();
  const { location_from, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();
  const { ERRORS, REFS, validate } = useValidateSleep();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(Sleep);
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
    dateType: "day",
    dateStart: location_dateStart || getDayFmt(),
    dateEnd: location_dateEnd || getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.sleep_dateStart.trim()} - ${OBJECT.sleep_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.sleep_dateStart === "0000-00-00" &&
        OBJECT.sleep_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.sleep_dateEnd]);

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
        !res.data.result || res.data.result?.length === 0 ? [""] : res.data.result
      );
    })
    .catch((err: any) => {
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
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
      setLOADING(false);
      setOBJECT(res.data.result || Sleep);

      // sectionCnt가 0이면 section 초기화
      if (res.data.sectionCnt <= 0) {
        setOBJECT((prev: any) => ({
          ...prev,
          sleep_section: []
        }));
      }
      // sectionCnt가 0이 아니면 section 내부 part 값에 따라 재정렬
      else {
        setOBJECT((prev: any) => ({
          ...prev,
          sleep_section: prev.sleep_section?.sort((a: any, b: any) => (
            a.sleep_part - b.sleep_part
          ))
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
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      sleep_bedTime: "00:00",
      sleep_wakeTime: "00:00",
      sleep_sleepTime: "00:00",
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_item: any, idx: number) =>
      idx < OBJECT?.sleep_section?.length ? OBJECT?.sleep_section[idx] : defaultSection
    );
    setOBJECT((prev: any) => ({
      ...prev,
      sleep_section: updatedSection
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
        setLOADING(false);
        setALERT({
          open: true,
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
        sync();
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
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
        setLOADING(false);
        setALERT({
          open: true,
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
        sync();
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4-3. handle----------------------------------------------------------------------------------
  const handleDelete = (index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      sleep_section: prev.sleep_section?.filter((_item: any, idx: number) => (idx !== index))
    }));
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. save --------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Grid container={true} spacing={2} className={"border-1 radius-2 p-20px"}>
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
            limit={1}
          />
        </Grid>
      </Grid>
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT.sleep_section?.filter((f: any) => f).map((_: any, i: number) => (
            <Grid container spacing={2} className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-2 p-20px`}  key={`detail-${i}`}>
              {/** row 1 **/}
              <Grid container={true} spacing={2}>
                <Grid size={6} className={"d-row-left"}>
                  <Bg
                    badgeContent={i + 1}
                    bgcolor={"#1976d2"}
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
                <Grid size={12}>
                  <PickerTime
                    OBJECT={OBJECT}
                    setOBJECT={setOBJECT}
                    REFS={REFS}
                    ERRORS={ERRORS}
                    DATE={DATE}
                    LOCKED={LOCKED}
                    extra={"sleep_bedTime"}
                    i={i}
                  />
                </Grid>
              </Grid>
              {/** /.row 2 **/}

              {/** row 3 **/}
              <Grid container={true} spacing={2}>
                <Grid size={12}>
                  <PickerTime
                    OBJECT={OBJECT}
                    setOBJECT={setOBJECT}
                    REFS={REFS}
                    ERRORS={ERRORS}
                    DATE={DATE}
                    LOCKED={LOCKED}
                    extra={"sleep_wakeTime"}
                    i={i}
                  />
                </Grid>
              </Grid>
              {/** /.row 3 **/}

              {/** row 4 **/}
              <Grid container={true} spacing={2}>
                <Grid size={12}>
                  <PickerTime
                    OBJECT={OBJECT}
                    setOBJECT={setOBJECT}
                    REFS={REFS}
                    ERRORS={ERRORS}
                    DATE={DATE}
                    LOCKED={LOCKED}
                    extra={"sleep_sleepTime"}
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
        <Card className={"d-col-center border-0 shadow-0 radius-0"}>
          {COUNT?.newSectionCnt > 0 && detailFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-75vh"}>
        {dateCountSection()}
        {detailSection()}
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
