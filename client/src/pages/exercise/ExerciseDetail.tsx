// ExerciseDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTime } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateExercise } from "@imports/ImportValidates";
import { Exercise } from "@imports/ImportSchemas";
import { axios, numeral, sync } from "@imports/ImportUtils";
import { Loading, Footer, Dialog } from "@imports/ImportLayouts";
import { PickerDay, PickerTime, Count, Delete, Input, Select }from "@imports/ImportContainers";
import { Img, Bg } from "@imports/ImportComponents";
import { Paper, MenuItem, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, toList, exerciseArray, bgColors } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateExercise();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(Exercise);
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
    dateType: location_dateType || "day",
    dateStart: location_dateStart || getDayFmt(),
    dateEnd: location_dateEnd || getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} ~ ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.exercise_dateStart.trim()} ~ ${OBJECT.exercise_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.exercise_dateStart === "0000-00-00" &&
        OBJECT.exercise_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.exercise_dateEnd]);

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
      setOBJECT(res.data.result || Exercise);

      // sectionCnt가 0이면 section 초기화
      if (res.data.sectionCnt <= 0) {
        setOBJECT((prev: any) => ({
          ...prev,
          exercise_section: []
        }));
      }
      // sectionCnt가 0이 아니면 section 내부 part_idx 값에 따라 재정렬
      else {
        setOBJECT((prev: any) => ({
          ...prev,
          exercise_section: prev.exercise_section.sort((a: any, b: any) => (
            a.exercise_part_idx - b.exercise_part_idx
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

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    if (!OBJECT?.exercise_section) {
      return;
    }

    let totalVolume = 0;
    let totalTime = 0;

    const updatedSections = OBJECT?.exercise_section?.map((section: any) => {
      const {exercise_set, exercise_rep, exercise_kg} = section;
      const sectionVolume = Number(exercise_set) * Number(exercise_rep) * Number(exercise_kg);

      totalVolume += sectionVolume;

      const {exercise_cardio} = section;
      if (exercise_cardio) {
        const [hours, minutes] = exercise_cardio.split(':').map(Number);
        totalTime += hours * 60 + minutes;
      }

      return {
        ...section,
        exercise_volume: sectionVolume.toString(),
      };
    });

    setOBJECT((prev: any) => ({
      ...prev,
      exercise_section: updatedSections,
      exercise_total_volume: totalVolume.toString(),
      exercise_total_cardio: `${Math.floor(totalTime / 60).toString().padStart(2, '0')}:${(totalTime % 60).toString().padStart(2, '0')}`
    }));

  }, [OBJECT?.exercise_section]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      exercise_part_idx: 0,
      exercise_part_val: "",
      exercise_title_idx: 0,
      exercise_title_val: "",
      exercise_set: "0",
      exercise_rep: "0",
      exercise_kg: "0",
      exercise_volume: "0",
      exercise_cardio: "00:00",
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_item: any, idx: number) =>
      idx < OBJECT?.exercise_section.length ? OBJECT?.exercise_section[idx] : defaultSection
    );
    setOBJECT((prev: any) => ({
      ...prev,
      exercise_section: updatedSection
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
        sync("scale");
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
        navigate(toList, {
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
  const handleDelete = (index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      exercise_section: prev.exercise_section.filter((_item: any, idx: number) => (idx !== index))
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
            limit={10}
          />
        </Grid>
      </Grid>
    );
    // 7-2. total
    const totalSection = () => (
      <Grid container spacing={2} columns={12} className={"border-1 radius-1 p-20"}>
        <Grid size={12}>
          <Input
            label={translate("totalVolume")}
            value={numeral(OBJECT?.exercise_total_volume).format("0,0")}
            locked={LOCKED}
            className={"pointer"}
            startadornment={
              <Img
                key={"exercise3_1"}
                src={"exercise3_1"}
                className={"w-16 h-16"}
              />
            }
            endadornment={
              translate("vol")
            }
          />
        </Grid>
        <Grid size={12}>
          <Input
            label={translate("totalCardio")}
            value={OBJECT?.exercise_total_cardio}
            locked={LOCKED}
            className={"pointer"}
            startadornment={
              <Img
                key={"exercise4"}
                src={"exercise4"}
                className={"w-16 h-16"}
              />
            }
            endadornment={
              translate("hm")
            }
          />
        </Grid>
        <Grid size={12}>
          <Input
            label={translate("weight")}
            value={OBJECT?.exercise_total_weight}
            locked={LOCKED}
            startadornment={
              <Img
                key={"exercise5"}
                src={"exercise5"}
                className={"w-16 h-16"}
              />
            }
            endadornment={
              translate("k")
            }
            onChange={(e: any) => {
              const value = e.target.value;
              const newValue = value.startsWith("0") ? value.slice(1) : value;
              if (value === "") {
                setOBJECT((prev: any) => ({
                  ...prev,
                  exercise_total_weight: "0"
                }));
              }
              else if (newValue.match(/^\d*\.?\d{0,2}$/) && Number(newValue) <= 999) {
                setOBJECT((prev: any) => ({
                  ...prev,
                  exercise_total_weight: String(newValue)
                }));
              }
            }}
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
              bgcolor={bgColors?.[item?.exercise_part_idx]}
            />
          </Grid>
          <Grid size={6} className={"d-row-right"}>
            <Delete
              index={i}
              handleDelete={handleDelete}
              LOCKED={LOCKED}
            />
          </Grid>
          <Grid size={6}>
            <Select
              label={translate("part")}
              locked={LOCKED}
              inputRef={REFS?.[i]?.exercise_part_idx}
              error={ERRORS?.[i]?.exercise_part_idx}
              value={item?.exercise_part_idx || 0}
              onChange={(e: any) => {
                const newIndex = Number(e.target.value);
                setOBJECT((prev: any) => ({
                  ...prev,
                  exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      exercise_part_idx: newIndex,
                      exercise_part_val: exerciseArray[newIndex]?.exercise_part,
                      exercise_title_idx: 0,
                      exercise_title_val: exerciseArray[newIndex]?.exercise_title[0],
                    } : section
                  ))
                }));
              }}
            >
              {exerciseArray?.map((part: any, idx: number) => (
                <MenuItem
                  key={idx}
                  value={idx}
                  className={"fs-0-8rem"}
                >
                  {translate(part?.exercise_part)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={6}>
            <Select
              label={translate("title")}
              locked={LOCKED}
              inputRef={REFS?.[i]?.exercise_title_idx}
              error={ERRORS?.[i]?.exercise_title_idx}
              value={item?.exercise_title_idx || 0}
              onChange={(e: any) => {
                const newTitleIdx = Number(e.target.value);
                const newTitleVal = exerciseArray[item?.exercise_part_idx]?.exercise_title[newTitleIdx];
                if (newTitleIdx >= 0 && newTitleVal) {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        exercise_title_idx: newTitleIdx,
                        exercise_title_val: newTitleVal,
                      } : section
                    ))
                  }));
                }
              }}
            >
              {exerciseArray[item?.exercise_part_idx]?.exercise_title?.map((title: any, idx: number) => (
                <MenuItem
                  key={idx}
                  value={idx}
                  className={"fs-0-8rem"}
                >
                  {translate(title)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={6}>
            <Input
              label={translate("set")}
              locked={LOCKED}
              inputRef={REFS?.[i]?.exercise_set}
              error={ERRORS?.[i]?.exercise_set}
              value={numeral(item?.exercise_set).format("0,0")}
              startadornment={
                <Img
                  key={"exercise3_1"}
                  src={"exercise3_1"}
                  className={"w-16 h-16"}
                />
              }
              endadornment={
                translate("s")
              }
              onChange={(e: any) => {
                const value = e.target.value.replace(/,/g, '');
                const newValue = value === "" ? 0 : Number(value);
                if (value === "") {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        exercise_set: "0"
                      } : section
                    ))
                  }));
                }
                else if (!isNaN(newValue) && newValue <= 999) {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        exercise_set: String(newValue)
                      } : section
                    ))
                  }));
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <Input
              label={translate("rep")}
              locked={LOCKED}
              inputRef={REFS?.[i]?.exercise_rep}
              error={ERRORS?.[i]?.exercise_rep}
              value={numeral(item?.exercise_rep).format("0,0")}
              startadornment={
                <Img
                  key={"exercise3_2"}
                  src={"exercise3_2"}
                  className={"w-16 h-16"}
                />
              }
              endadornment={
                translate("r")
              }
              onChange={(e: any) => {
                const value = e.target.value.replace(/,/g, '');
                const newValue = value === "" ? 0 : Number(value);
                if (value === "") {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        exercise_rep: "0"
                      } : section
                    ))
                  }));
                }
                else if (!isNaN(newValue) && newValue <= 999) {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        exercise_rep: String(newValue)
                      } : section
                    ))
                  }));
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <Input
              label={translate("kg")}
              locked={LOCKED}
              inputRef={REFS?.[i]?.exercise_kg}
              error={ERRORS?.[i]?.exercise_kg}
              value={numeral(item?.exercise_kg).format("0,0")}
              startadornment={
                <Img
                  key={"exercise3_3"}
                  src={"exercise3_3"}
                  className={"w-16 h-16"}
                />
              }
              endadornment={
                translate("k")
              }
              onChange={(e: any) => {
                const value = e.target.value.replace(/,/g, '');
                const newValue = value === "" ? 0 : Number(value);
                if (value === "") {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        exercise_kg: "0"
                      } : section
                    ))
                  }));
                }
                else if (!isNaN(newValue) && newValue <= 999) {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        exercise_kg: String(newValue)
                      } : section
                    ))
                  }));
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <PickerTime
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              DATE={DATE}
              LOCKED={LOCKED}
              extra={"exercise_cardio"}
              i={i}
            />
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          {OBJECT?.exercise_section?.map((item: any, i: number) => (
            <Grid size={12} key={`detail-${i}`}>
              {COUNT?.newSectionCnt > 0 && detailFragment(item, i)}
            </Grid>
          ))}
        </Grid>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {dateCountSection()}
            {totalSection()}
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