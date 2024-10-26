// ExerciseGoalDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTime } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateExercise } from "@imports/ImportValidates";
import { ExerciseGoal } from "@imports/ImportSchemas";
import { axios, sync, insertComma } from "@imports/ImportUtils";
import { Loading, Footer, Dialog } from "@imports/ImportLayouts";
import { PickerDay, PickerTime, Count, Delete, Input } from "@imports/ImportContainers";
import { Img, Bg } from "@imports/ImportComponents";
import { Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, toList, localUnit } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getWeekStartFmt, getWeekEndFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateExercise();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(ExerciseGoal);
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
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.exercise_goal_dateStart.trim()} - ${OBJECT.exercise_goal_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.exercise_goal_dateStart === "0000-00-00" &&
        OBJECT.exercise_goal_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.exercise_goal_dateEnd]);

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
    axios.get(`${URL_OBJECT}/goal/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || ExerciseGoal);
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
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
        sync("scale");
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
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
        sync("scale");
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
      exercise_goal_count: "0",
      exercise_goal_volume: "0",
      exercise_goal_cardio: "00:00",
      exercise_goal_scale: "0",
    }));
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Grid container spacing={2} columns={12} className={"border-1 radius-1 p-20"}>
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
      const detailFragment = (item: any, i: number) => (
        <Grid container spacing={2} columns={12}
        className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-1 p-20`}>
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
          <Grid size={12}>
            <Input
              locked={LOCKED}
              value={insertComma(item?.exercise_goal_count || "0")}
              inputRef={REFS?.[i]?.exercise_goal_count}
              error={ERRORS?.[i]?.exercise_goal_count}
              label={
                DATE.dateType === "day" ? (
                  `${translate("goalCount")}`
                ) : (
                  `${translate("goalCount")} (${translate("total")})`
                )
              }
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"exercise2"}
                />
              }
              endadornment={
                translate("c")
              }
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 9999 제한 + 정수
                if (Number(value) > 9999 || !/^\d+$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  exercise_goal_count: value
                }));
              }}
            />
          </Grid>
          <Grid size={12}>
            <Input
              locked={LOCKED}
              value={insertComma(item?.exercise_goal_volume || "0")}
              inputRef={REFS?.[i]?.exercise_goal_volume}
              error={ERRORS?.[i]?.exercise_goal_volume}
              label={
                DATE.dateType === "day" ? (
                  `${translate("goalVolume")}`
                ) : (
                  `${translate("goalVolume")} (${translate("total")})`
                )
              }
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"exercise3_1"}
                />
              }
              endadornment={
                translate("vol")
              }
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 9999999 제한 + 정수
                if (Number(value) > 9999999 || !/^\d+$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  exercise_goal_volume: value
                }));
              }}
            />
          </Grid>
          <Grid size={12}>
            <PickerTime
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              DATE={DATE}
              LOCKED={LOCKED}
              extra={"exercise_goal_cardio"}
              i={i}
            />
          </Grid>
          <Grid size={12}>
            <Input
              locked={LOCKED}
              label={translate("goalScale")}
              value={insertComma(item?.exercise_goal_scale || "0")}
              inputRef={REFS?.[i]?.exercise_goal_scale}
              error={ERRORS?.[i]?.exercise_goal_scale}
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"exercise5"}
                />
              }
              endadornment={
                localUnit
              }
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 999 제한 + 소수점 둘째 자리
                if (Number(value) > 999 || !/^\d*\.?\d{0,2}$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  exercise_goal_scale: value
                }));
              }}
            />
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} key={`detail-${0}`}>
            {COUNT?.newSectionCnt > 0 && detailFragment(OBJECT, 0)}
          </Grid>
        </Grid>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {dateCountSection()}
            {LOADING ? <Loading /> : detailSection()}
          </Grid>
        </Grid>
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
