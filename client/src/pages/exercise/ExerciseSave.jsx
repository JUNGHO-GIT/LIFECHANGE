// ExerciseSave.jsx
// Node -> Section -> Fragment

import { useState, useEffect, useRef, createRef } from "../../imports/ImportReacts.jsx";
import { useCommon, useTime } from "../../imports/ImportHooks.jsx";
import { moment, axios, numeral } from "../../imports/ImportLibs.jsx";
import { sync } from "../../imports/ImportUtils.jsx";
import { Loading, Footer } from "../../imports/ImportLayouts.jsx";
import { Bg, Br, Img, Input, Select } from "../../imports/ImportComponents.jsx";
import { Picker, Time, Count, Delete } from "../../imports/ImportContainers.jsx";
import { Card, Paper, MenuItem, Grid } from "../../imports/ImportMuis.jsx";
import { exercise1, exercise3_1, exercise3_2, exercise3_3, exercise4, exercise5 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location_dateType, location_dateStart, location_dateEnd, PATH, exerciseArray, koreanDate, URL_OBJECT, sessionId, translate } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/exercise/list"
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
    exercise_number: 0,
    exercise_dummy: "N",
    exercise_dateType: "",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_volume: "0",
    exercise_total_cardio: "00:00",
    exercise_total_weight: "0",
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "all",
      exercise_title_idx: 0,
      exercise_title_val: "all",
      exercise_set: "0",
      exercise_rep: "0",
      exercise_kg: "0",
      exercise_volume: "0",
      exercise_cardio: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState(OBJECT?.exercise_section?.map(() => ({
    exercise_part_idx: false,
    exercise_title_idx: false,
    exercise_set: false,
    exercise_rep: false,
    exercise_kg: false,
  })));
  const REFS = useRef(OBJECT?.exercise_section?.map(() => ({
    exercise_part_idx: createRef(),
    exercise_title_idx: createRef(),
    exercise_set: createRef(),
    exercise_rep: createRef(),
    exercise_kg: createRef(),
  })));

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "real");

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
        _id: "",
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
      // section 내부 part_idx 값에 따라 재정렬
      setOBJECT((prev) => {
        const mergedFoodSection = prev?.exercise_section
          ? prev.exercise_section.sort((a, b) => a.exercise_part_idx - b.exercise_part_idx)
          : [];
        return {
          ...prev,
          exercise_section: mergedFoodSection,
        };
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
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    if (!OBJECT?.exercise_section) {
      return;
    }

    let totalVolume = 0;
    let totalTime = 0;

    const updatedSections = OBJECT?.exercise_section?.map((section) => {
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

    setOBJECT((prev) => ({
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
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.exercise_section.length ? OBJECT?.exercise_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      exercise_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    REFS.current = OBJECT?.exercise_section?.map((_, idx) => ({
      exercise_part_idx: REFS?.current[idx]?.exercise_part_idx || createRef(),
      exercise_title_idx: REFS?.current[idx]?.exercise_title_idx || createRef(),
      exercise_set: REFS?.current[idx]?.exercise_set || createRef(),
      exercise_rep: REFS?.current[idx]?.exercise_rep || createRef(),
      exercise_kg: REFS?.current[idx]?.exercise_kg || createRef(),
    }));
  }, [OBJECT?.exercise_section.length]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT) => {
    let foundError = false;
    const initialErrors = OBJECT?.exercise_section?.map(() => ({
      exercise_part_idx: false,
      exercise_title_idx: false,
      exercise_set: false,
      exercise_rep: false,
      exercise_kg: false,
    }));

    if (COUNT.newSectionCnt === 0 && OBJECT?.exercise_total_weight === "0") {
      alert(translate("errorCount"));
      foundError = true;
      return;
    }

    for (let idx = 0; idx < OBJECT?.exercise_section.length; idx++) {
      const section = OBJECT?.exercise_section[idx];
      const refsCurrentIdx = REFS?.current[idx];
      if (!refsCurrentIdx) {
        console.warn('Ref is undefined, skipping validation for index:', idx);
        continue;
      }
      else if (!section.exercise_part_idx || section.exercise_part_idx === 0) {
        alert(translate("errorExercisePart"));
        refsCurrentIdx.exercise_part_idx.current &&
        refsCurrentIdx.exercise_part_idx?.current?.focus();
        initialErrors[idx].exercise_part_idx = true;
        foundError = true;
        break;
      }
      else if (!section.exercise_title_idx || section.exercise_title_idx === 0) {
        alert(translate("errorExerciseTitle"));
        refsCurrentIdx.exercise_title_idx.current &&
        refsCurrentIdx.exercise_title_idx?.current?.focus();
        initialErrors[idx].exercise_title_idx = true;
        foundError = true;
        break;
      }
      else if (!section.exercise_set || section.exercise_set === "0") {
        alert(translate("errorExerciseSet"));
        refsCurrentIdx.exercise_set.current &&
        refsCurrentIdx.exercise_set?.current?.focus();
        initialErrors[idx].exercise_set = true;
        foundError = true;
        break;
      }
      else if (!section.exercise_rep || section.exercise_rep === "0") {
        alert(translate("errorExerciseRep"));
        refsCurrentIdx.exercise_rep.current &&
        refsCurrentIdx.exercise_rep?.current?.focus();
        initialErrors[idx].exercise_rep = true;
        foundError = true;
        break;
      }
      else if (!section.exercise_kg || section.exercise_kg === "0") {
        alert(translate("errorExerciseKg"));
        refsCurrentIdx.exercise_kg.current &&
        refsCurrentIdx.exercise_kg?.current?.focus();
        initialErrors[idx].exercise_kg = true;
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
        sync();
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
        sync();
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
      exercise_section: prev.exercise_section.filter((_, idx) => (idx !== index))
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
    // 7-2. total
    const totalSection = () => (
      <Card className={"border radius p-20"}>
        <Grid container columnSpacing={1}>
          <Grid size={6}>
            <Input
              label={translate("totalVolume")}
              value={numeral(OBJECT?.exercise_total_volume).format("0,0")}
              readOnly={true}
              startadornment={
                <Img src={exercise3_1} className={"w-16 h-16"} />
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
                <Img src={exercise4} className={"w-16 h-16"} />
              }
              endadornment={
                translate("hm")
              }
            />
          </Grid>
          <Br px={20} />
          <Grid size={12}>
            <Input
              label={translate("weight")}
              value={OBJECT?.exercise_total_weight}
              startadornment={
                <Img src={exercise5} className={"w-16 h-16"} />
              }
              endadornment={
                translate("k")
              }
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, '');
                if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                  const newValue = parseFloat(value);
                  if (value === "") {
                    setOBJECT((prev) => ({
                      ...prev,
                      exercise_total_weight: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 999) {
                    setOBJECT((prev) => ({
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
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"border radius p-20"} key={i}>
          <Grid container columnSpacing={1}>
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
              />
            </Grid>
            <Br px={20} />
            <Grid size={6}>
              <Select
                label={translate("part")}
                value={OBJECT?.exercise_section[i]?.exercise_part_idx}
                inputRef={REFS.current[i]?.exercise_part_idx}
                error={ERRORS[i]?.exercise_part_idx}
                onChange={(e) => {
                  const newIndex = Number(e.target.value);
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_section: prev.exercise_section?.map((item, idx) => (
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
                {exerciseArray?.map((item, idx) => (
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
                inputRef={REFS.current[i]?.exercise_title_idx}
                error={ERRORS[i]?.exercise_title_idx}
                onChange={(e) => {
                  const newTitleIdx = Number(e.target.value);
                  const newTitleVal = exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title[newTitleIdx];
                  if (newTitleIdx >= 0 && newTitleVal) {
                    setOBJECT((prev) => ({
                      ...prev,
                      exercise_section: prev.exercise_section?.map((item, idx) => (
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
                {exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title?.map((title, idx) => (
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(title)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Br px={20} />
            <Grid size={6}>
              <Input
                label={translate("set")}
                value={numeral(OBJECT?.exercise_section[i]?.exercise_set).format("0,0")}
                inputRef={REFS.current[i]?.exercise_set}
                error={ERRORS[i]?.exercise_set}
                startadornment={
                  <Img src={exercise3_1} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("s")
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item, idx) => (
                          idx === i ? {
                            ...item,
                            exercise_set: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item, idx) => (
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
                inputRef={REFS.current[i]?.exercise_rep}
                error={ERRORS[i]?.exercise_rep}
                startadornment={
                  <Img src={exercise3_2} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("r")
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item, idx) => (
                          idx === i ? {
                            ...item,
                            exercise_rep: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item, idx) => (
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
            <Br px={20} />
            <Grid size={6}>
              <Input
                label={translate("kg")}
                value={numeral(OBJECT?.exercise_section[i]?.exercise_kg).format("0,0")}
                inputRef={REFS.current[i]?.exercise_kg}
                error={ERRORS[i]?.exercise_kg}
                startadornment={
                  <Img src={exercise3_3} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("k")
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item, idx) => (
                          idx === i ? {
                            ...item,
                            exercise_kg: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev) => ({
                        ...prev,
                        exercise_section: prev.exercise_section?.map((item, idx) => (
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
                extra={"exercise_cardio"}
                i={i}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : OBJECT?.exercise_section?.map((_, i) => (cardFragment(i)))
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            {dateCountSection()}
            {totalSection()}
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
