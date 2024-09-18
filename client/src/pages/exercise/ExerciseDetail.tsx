// ExerciseDetail.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useTime } from "@imports/ImportHooks";
import { useValidateExercise } from "@imports/ImportValidates";
import { Exercise } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Bg, Img, Input, Select } from "@imports/ImportComponents";
import { Picker, Time, Count, Delete, Dial } from "@imports/ImportContainers";
import { Card, Paper, MenuItem, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();
  const {
    dayFmt, getMonthStartFmt, getMonthEndFmt
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, PATH, exerciseArray, URL_OBJECT, sessionId, toList,
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateExercise();

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
    exist: "",
    itsMe: "",
    itsNew: "",
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
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart} ~ ${DATE.dateEnd}`;
      const objectRange = `${OBJECT.exercise_dateStart} ~ ${OBJECT.exercise_dateEnd}`;

      const isExist = (
        EXIST[DATE.dateType].some((item: any) => item === dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.exercise_dateStart === "0000-00-00" &&
        OBJECT.exercise_dateEnd === "0000-00-00"
      );

      setFLOW({
        exist: isExist ? "true" : "false",
        itsMe: itsMe ? "true" : "false",
        itsNew: itsNew ? "true" : "false",
      });
    }
  }, [EXIST]);

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
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || Exercise);
      // section 내부 part_idx 값에 따라 재정렬
      setOBJECT((prev: any) => {
        const mergedSection = prev?.exercise_section
        ? prev.exercise_section.sort((a: any, b: any) => (
          a.exercise_part_idx - b.exercise_part_idx
        ))
        : [];
        return {
          ...prev,
          exercise_section: mergedSection,
        };
      });
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

  }, [JSON.stringify(OBJECT?.exercise_section)]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      exercise_part_idx: 0,
      exercise_part_val: "all",
      exercise_title_idx: 0,
      exercise_title_val: "all",
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
    if (!validate(OBJECT, COUNT)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/${type}`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
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
        DATE: DATE,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
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
    // 7-2. total
    const totalSection = () => (
      <Card className={"border radius p-20"}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Input
              label={translate("totalVolume")}
              value={numeral(OBJECT?.exercise_total_volume).format("0,0")}
              readOnly={true}
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
          <Grid size={6}>
            <Input
              label={translate("totalCardio")}
              value={OBJECT?.exercise_total_cardio}
              readOnly={true}
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
                const value = e.target.value.replace(/^0+/, '');
                if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                  const newValue = parseFloat(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_total_weight: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_total_weight: value
                    }));
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={`${LOCKED === "locked" ? "locked" : ""} border radius p-20`} key={i}>
          <Grid container spacing={2}>
            <Grid size={6} className={"d-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 0 ? '#1976d2' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 1 ? '#4CAF50' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 2 ? '#FFC107' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 3 ? '#FF5722' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 4 ? '#673AB7' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 5 ? '#3F51B5' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 6 ? '#2196F3' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 7 ? '#009688' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 8 ? '#CDDC39' :
                  OBJECT?.exercise_section[i]?.exercise_part_idx === 9 ? '#FFEB3B' :
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
                value={OBJECT?.exercise_section[i]?.exercise_part_idx}
                inputRef={REFS?.[i]?.exercise_part_idx}
                error={ERRORS?.[i]?.exercise_part_idx}
                locked={LOCKED}
                onChange={(e: any) => {
                  const newIndex = Number(e.target.value);
                  setOBJECT((prev: any) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        exercise_part_idx: newIndex,
                        exercise_part_val: exerciseArray[newIndex]?.exercise_part,
                        exercise_title_idx: 0,
                        exercise_title_val: exerciseArray[newIndex]?.exercise_title[0],
                      } : item
                    ))
                  }));
                }}
              >
                {exerciseArray?.map((item: any, idx: number) => (
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(item.exercise_part)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={6}>
              <Select
                label={translate("title")}
                value={OBJECT?.exercise_section[i]?.exercise_title_idx}
                inputRef={REFS?.[i]?.exercise_title_idx}
                error={ERRORS?.[i]?.exercise_title_idx}
                locked={LOCKED}
                onChange={(e: any) => {
                  const newTitleIdx = Number(e.target.value);
                  const newTitleVal = exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title[newTitleIdx];
                  if (newTitleIdx >= 0 && newTitleVal) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_section: prev.exercise_section?.map((item: any, idx: number) => (
                        idx === i ? {
                          ...item,
                          exercise_title_idx: newTitleIdx,
                          exercise_title_val: newTitleVal,
                        } : item
                      ))
                    }));
                  }
                }}
              >
                {exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title?.map((title: any, idx: number) => (
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(title)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("set")}
                value={numeral(OBJECT?.exercise_section[i]?.exercise_set).format("0,0")}
                inputRef={REFS?.[i]?.exercise_set}
                error={ERRORS?.[i]?.exercise_set}
                locked={LOCKED}
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
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            exercise_set: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            exercise_set: value
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("rep")}
                value={numeral(OBJECT?.exercise_section[i]?.exercise_rep).format("0,0")}
                inputRef={REFS?.[i]?.exercise_rep}
                error={ERRORS?.[i]?.exercise_rep}
                locked={LOCKED}
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
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            exercise_rep: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            exercise_rep: value
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("kg")}
                value={numeral(OBJECT?.exercise_section[i]?.exercise_kg).format("0,0")}
                inputRef={REFS?.[i]?.exercise_kg}
                error={ERRORS?.[i]?.exercise_kg}
                locked={LOCKED}
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
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            exercise_kg: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            exercise_kg: value
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Time
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
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : OBJECT?.exercise_section?.map((_item: any, i: number) => (
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
            {totalSection()}
            {detailSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 8. dial ---------------------------------------------------------------------------------------
  const dialNode = () => (
    <Dial
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
      {dialNode()}
      {footerNode()}
    </>
  );
};
