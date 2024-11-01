// FoodGoalDetail.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useValidateFood } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importHooks";
import { FoodGoal } from "@importSchemas";
import { axios } from "@importLibs";
import { insertComma, sync } from "@importScripts";
import { Loader, Footer, Dialog } from "@importLayouts";
import { PickerDay, Count, Delete, Input } from "@importContainers";
import { Img, Bg } from "@importComponents";
import { Paper, Grid, Card } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const FoodGoalDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, navigate, sessionId, toList, toToday } = useCommonValue();
  const { location_from, location_dateType } = useCommonValue();
  const { location_dateStart, location_dateEnd } = useCommonValue();
  const { getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { ALERT, setALERT } = useStoreAlert();
  const { ERRORS, REFS, validate } = useValidateFood();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(FoodGoal);
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
    dateType: location_dateType || "month",
    dateStart: location_dateStart || getMonthStartFmt(),
    dateEnd: location_dateEnd || getMonthEndFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.food_goal_dateStart.trim()} - ${OBJECT.food_goal_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.food_goal_dateStart === "0000-00-00" &&
        OBJECT.food_goal_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.food_goal_dateEnd]);

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
    if (LOCKED === "locked") {
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
      setOBJECT(res.data.result || FoodGoal);
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
      }, 300);
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
        navigate(location_from === "today" ? toToday : toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
        sync("nutrition");
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
      }, 300);
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
        navigate(location_from === "today" ? toToday : toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
        sync("nutrition");
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
      }, 300);
    });
  };

  // 4-3. handle----------------------------------------------------------------------------------
  const handleDelete = (_index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      food_goal_kcal: "",
      food_goal_carb: "",
      food_goal_protein: "",
      food_goal_fat: "",
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
            limit={1}
          />
        </Grid>
      </Grid>
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={0}>
          {[OBJECT].filter((_: any, idx: number) => idx === 0).map((item: any, i: number) => (
            <Grid container spacing={2} className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-1 p-20`}  key={`detail-${i}`}>
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
                  <Input
                    locked={LOCKED}
                    value={insertComma(item?.food_goal_kcal || "0")}
                    inputRef={REFS?.[i]?.food_goal_kcal}
                    error={ERRORS?.[i]?.food_goal_kcal}
                    label={
                      DATE.dateType === "day" ? (
                        `${translate("goalKcal")}`
                      ) : (
                        `${translate("goalKcal")} (${translate("total")})`
                      )
                    }
                    startadornment={
                      <Img
                        max={15}
                        hover={true}
                        shadow={false}
                        radius={false}
                        src={"food2"}
                      />
                    }
                    endadornment={
                      translate("kc")
                    }
                    onChange={(e: any) => {
                      // 빈값 처리
                      let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                      // 999999 제한 + 정수
                      if (Number(value) > 999999 || !/^\d+$/.test(value)) {
                        return;
                      }
                      // 01, 05 같은 숫자는 1, 5로 변경
                      if (/^0(?!\.)/.test(value)) {
                        value = value.replace(/^0+/, '');
                      }
                      // object 설정
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_kcal: value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              {/** /.row 2 **/}

              {/** row 3 **/}
              <Grid container={true} spacing={2}>
                <Grid size={12}>
                  <Input
                    locked={LOCKED}
                    value={insertComma(item?.food_goal_carb || "0")}
                    inputRef={REFS?.[i]?.food_goal_carb}
                    error={ERRORS?.[i]?.food_goal_carb}
                    label={
                      DATE.dateType === "day" ? (
                        `${translate("goalCarb")}`
                      ) : (
                        `${translate("goalCarb")} (${translate("total")})`
                      )
                    }
                    startadornment={
                      <Img
                        max={15}
                        hover={true}
                        shadow={false}
                        radius={false}
                        src={"food3"}
                      />
                    }
                    endadornment={
                      translate("g")
                    }
                    onChange={(e: any) => {
                      // 빈값 처리
                      let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                      // 999999 제한 + 정수
                      if (Number(value) > 999999 || !/^\d+$/.test(value)) {
                        return;
                      }
                      // 01, 05 같은 숫자는 1, 5로 변경
                      if (/^0(?!\.)/.test(value)) {
                        value = value.replace(/^0+/, '');
                      }
                      // object 설정
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_carb: value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              {/** /.row 3 **/}

              {/** row 4 **/}
              <Grid container={true} spacing={2}>
                <Grid size={12}>
                  <Input
                    locked={LOCKED}
                    value={insertComma(item?.food_goal_protein || "0")}
                    inputRef={REFS?.[i]?.food_goal_protein}
                    error={ERRORS?.[i]?.food_goal_protein}
                    label={
                      DATE.dateType === "day" ? (
                        `${translate("goalProtein")}`
                      ) : (
                        `${translate("goalProtein")} (${translate("total")})`
                      )
                    }
                    startadornment={
                      <Img
                        max={15}
                        hover={true}
                        shadow={false}
                        radius={false}
                        src={"food4"}
                      />
                    }
                    endadornment={
                      translate("g")
                    }
                    onChange={(e: any) => {
                      // 빈값 처리
                      let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                      // 999999 제한 + 정수
                      if (Number(value) > 999999 || !/^\d+$/.test(value)) {
                        return;
                      }
                      // 01, 05 같은 숫자는 1, 5로 변경
                      if (/^0(?!\.)/.test(value)) {
                        value = value.replace(/^0+/, '');
                      }
                      // object 설정
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_protein: value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              {/** /.row 4 **/}

              {/** row 5 **/}
              <Grid container={true} spacing={2}>
                <Grid size={12}>
                  <Input
                    locked={LOCKED}
                    value={insertComma(item?.food_goal_fat || "0")}
                    inputRef={REFS?.[i]?.food_goal_fat}
                    error={ERRORS?.[i]?.food_goal_fat}
                    label={
                      DATE.dateType === "day" ? (
                        `${translate("goalFat")}`
                      ) : (
                        `${translate("goalFat")} (${translate("total")})`
                      )
                    }
                    startadornment={
                      <Img
                        max={15}
                        hover={true}
                        shadow={false}
                        radius={false}
                        src={"food5"}
                      />
                    }
                    endadornment={
                      translate("g")
                    }
                    onChange={(e: any) => {
                      // 빈값 처리
                      let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                      // 999999 제한 + 정수
                      if (Number(value) > 999999 || !/^\d+$/.test(value)) {
                        return;
                      }
                      // 01, 05 같은 숫자는 1, 5로 변경
                      if (/^0(?!\.)/.test(value)) {
                        value = value.replace(/^0+/, '');
                      }
                      // object 설정
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_fat: value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              {/** /.row 5 **/}
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
