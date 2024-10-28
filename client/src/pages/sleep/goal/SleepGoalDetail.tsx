// SleepGoalDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTime, useValidateSleep } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { SleepGoal } from "@imports/ImportSchemas";
import { axios, sync } from "@imports/ImportUtils";
import { Loading, Footer, Dialog } from "@imports/ImportLayouts";
import { PickerDay, PickerTime, Count, Delete } from "@imports/ImportContainers";
import { Bg } from "@imports/ImportComponents";
import { Paper, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const SleepGoalDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, navigate, toToday, toList } = useCommonValue();
  const { location_from, location_dateType } = useCommonValue();
  const { location_dateStart, location_dateEnd } = useCommonValue();
  const { getWeekStartFmt, getWeekEndFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateSleep();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCK, setLOCK] = useState<string>("Y");
  const [OBJECT, setOBJECT] = useState<any>(SleepGoal);
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
    dateType: location_dateType || "week",
    dateStart: location_dateStart || getWeekStartFmt(),
    dateEnd: location_dateEnd || getWeekEndFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "goal");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.sleep_goal_dateStart.trim()} - ${OBJECT.sleep_goal_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.sleep_goal_dateStart === "0000-00-00" &&
        OBJECT.sleep_goal_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.sleep_goal_dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/goal/exist`, {
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
    if (LOCK === "locked") {
      setLOADING(false);
      return;
    }
    axios.get(`${URL_OBJECT}/goal/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || SleepGoal);
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
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async (type: string) => {
    setLOADING(true);
    if (!await validate(OBJECT, COUNT, "goal")) {
      setLOADING(false);
      return;
    }
    axios({
      method: type === "create" ? "post" : "put",
      url: type === "create" ? `${URL_OBJECT}/goal/create` : `${URL_OBJECT}/goal/update`,
      data: {
        user_id: sessionId,
        OBJECT: OBJECT,
        DATE: DATE,
        type: type,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        sync();
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
    axios.delete(`${URL_OBJECT}/goal/delete`, {
      data: {
        user_id: sessionId,
        DATE: DATE,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        sync();
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
      setLOADING(false);
    });
  };

  // 4-3. handle----------------------------------------------------------------------------------
  const handleDelete = (_index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      sleep_goal_bedTime: "00:00",
      sleep_goal_wakeTime: "00:00",
      sleep_goal_sleepTime: "00:00",
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
            LOCK={LOCK}
            setLOCK={setLOCK}
            limit={1}
          />
        </Grid>
      </Grid>
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = (_item: any, i: number) => (
        <Grid container spacing={2} columns={12}
        className={`${LOCK === "locked" ? "locked" : ""} border-1 radius-1 p-20`}>
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
              LOCK={LOCK}
            />
          </Grid>
          <Grid size={12}>
            <PickerTime
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              DATE={DATE}
              LOCK={LOCK}
              extra={"sleep_goal_bedTime"}
              i={i}
            />
          </Grid>
          <Grid size={12}>
            <PickerTime
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              DATE={DATE}
              LOCK={LOCK}
              extra={"sleep_goal_wakeTime"}
              i={i}
            />
          </Grid>
          <Grid size={12}>
            <PickerTime
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              DATE={DATE}
              LOCK={LOCK}
              extra={"sleep_goal_sleepTime"}
              i={i}
            />
          </Grid>
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {COUNT?.newSectionCnt > 0 && detailFragment(OBJECT, 0)}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        {dateCountSection()}
        {LOADING ? <Loading /> : detailSection()}
      </Paper>
    );
  };

  // 8. dialog -------------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      LOCK={LOCK}
      setLOCK={setLOCK}
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
