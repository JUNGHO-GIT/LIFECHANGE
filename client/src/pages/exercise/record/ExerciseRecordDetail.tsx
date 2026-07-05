/**
 * @file ExerciseRecordDetail.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { React, useState, useEffect, useRef, useCallback, useDeferredValue, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useTime, useValidateExercise } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { axios } from "@exportLibs";
import { insertComma, sync } from "@exportScripts";
import { handleNumberInput } from "@exportScripts";
import { ExerciseRecord, ExerciseRecordType } from "@exportSchemas";
import { Footer, Dialog } from "@exportLayouts";
import { PickerDay, PickerTime, Count, Delete, Select, Input } from "@exportContainers";
import { Icons, Bg, Div, Paper, Grid, Br } from "@exportComponents";
import { MenuItem } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseRecordDetail = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, PATH, navigate, toList,
    sessionId, localUnit, bgColors, exerciseArray, chartThemeColors,
    location_dateStart, location_dateEnd,
  } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { ERRORS, REFS, validate } = useValidateExercise();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-2. useState -------------------------------------------------------------------------------
  const [ LOCKED, setLOCKED ] = useState<string>(`unlocked`);
  const [ OBJECT, setOBJECT ] = useState<ExerciseRecordType>(ExerciseRecord);
  const [ EXIST, setEXIST ] = useState({
    day: [``],
    week: [``],
    month: [``],
    year: [``],
    select: [``],
  });
  const [ FLOW, setFLOW ] = useState({
    theme: `exercise`,
    exist: false,
    itsMe: false,
    itsNew: false,
  });
  const [ SEND, setSEND ] = useState({
    id: ``,
    dateType: ``,
    dateStart: `0000-00-00`,
    dateEnd: `0000-00-00`,
  });
  const [ COUNT, setCOUNT ] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0,
  });
  const [ DATE, setDATE ] = useState({
    dateType: `day`,
    dateStart: location_dateStart ?? getDayFmt(),
    dateEnd: location_dateEnd ?? getDayFmt(),
  });

  // 2-2. useDeferredValue ----------------------------------------------------------------------
  // - 항목 렌더를 비긴급으로 분리
  // - 전환·데이터 반영 시 화면 틀이 먼저 그려지고 항목은 다음 프레임에 채워짐
  const deferredObject = useDeferredValue(OBJECT);

  // 2-3. useRef --------------------------------------------------------------------------------
  const objectRef: React.RefObject<
    ExerciseRecordType
  > = useRef(OBJECT);
  const countRef: React.RefObject<{
    totalCnt: number;
    sectionCnt: number;
    newSectionCnt: number;
  }> = useRef(COUNT);
  const dateRef: React.RefObject<{
    dateType: string;
    dateStart: string;
    dateEnd: string;
  }> = useRef(DATE);

  // 2-3. useEffect ------------------------------------------------------------------------------
  useEffect(() => {
    COUNT !== countRef.current && (countRef.current = COUNT);
    OBJECT !== objectRef.current && (objectRef.current = OBJECT);
    DATE !== dateRef.current && (dateRef.current = DATE);
  }, [ COUNT, OBJECT, DATE ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, `record`);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE?.dateType as keyof typeof EXIST]?.length > 0) {

      const dateRange: string = (
        `${DATE?.dateStart.trim()} - ${DATE?.dateEnd.trim()}`
      );
      const objectRange: string = (
        `${OBJECT.exercise_record_dateStart.trim()} - ${OBJECT.exercise_record_dateEnd.trim()}`
      );
      const isExist: boolean = (
        EXIST?.[DATE?.dateType as keyof typeof EXIST]?.includes(dateRange)
      );
      const itsMe: boolean = (
        dateRange === objectRange
      );
      const itsNew: boolean = (
        OBJECT.exercise_record_dateStart === `0000-00-00` &&
        OBJECT.exercise_record_dateEnd === `0000-00-00`
      );

      setFLOW((prev) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew,
      }));
    }
  }, [ EXIST, DATE?.dateEnd, OBJECT.exercise_record_dateEnd ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/record/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: ``,
          dateStart: getMonthStartFmt(DATE?.dateStart),
          dateEnd: getMonthEndFmt(DATE?.dateEnd),
        },
      },
    })
    .then((res: any) => {
      setEXIST(!res.data.result || res.data.result?.length === 0 ? {
          day: [``],
          week: [``],
          month: [``],
          year: [``],
          select: [``],
        } : res.data.result);
    })
    .catch((error: any) => {
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
    });
  }, [ URL_OBJECT, sessionId, DATE?.dateStart, DATE?.dateEnd ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    if (LOCKED === `locked`) {
      setLOADING(false);
      return;
    }
    axios.get(`${URL_OBJECT}/record/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setLOADING(false);
      setOBJECT(res.data.result ?? ExerciseRecord);

      res.data.sectionCnt <= 0 && setOBJECT((prev) => ({
        ...prev,
        exercise_section: [],
      }));

      res.data.sectionCnt > 0 && setOBJECT((prev) => ({
        ...prev,
        exercise_section: prev.exercise_section?.sort((a: any, b: any) => (
          exerciseArray.findIndex((item: any) => item.exercise_record_part === a.exercise_record_part) -
					exerciseArray.findIndex((item: any) => item.exercise_record_part === b.exercise_record_part)
        )),
      }));

      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ?? 0,
        sectionCnt: res.data.sectionCnt ?? 0,
        newSectionCnt: res.data.sectionCnt ?? 0,
      }));
    })
    .catch((error: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [ URL_OBJECT, sessionId, DATE?.dateStart, DATE?.dateEnd ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    const totals = OBJECT?.exercise_section?.reduce((acc: any, cur: any) => {
      return {
        totalVolume: (
          Number(acc.totalVolume) +
          Number(cur.exercise_record_set) *
          Number(cur.exercise_record_rep) *
          Number(cur.exercise_record_weight)
        ),
        totalCardio: (
          Number(acc.totalCardio) +
          Number(cur.exercise_record_cardio.split(`:`)[0]) * 60 +
          Number(cur.exercise_record_cardio.split(`:`)[1])
        ),
      };
    }, {
      totalVolume: 0,
      totalCardio: 0,
    });

    setOBJECT((prev) => ({
      ...prev,
      exercise_record_total_volume: totals.totalVolume.toString(),
      exercise_record_total_cardio: `${Math.floor(totals.totalCardio / 60).toString().padStart(2, `0`)}:${(totals.totalCardio % 60).toString().padStart(2, `0`)}`,
    }));

  }, [OBJECT?.exercise_section]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      exercise_record_part: exerciseArray[1]?.exercise_record_part ?? ``,
      exercise_record_title: exerciseArray[1]?.exercise_record_title?.[0] ?? ``,
      exercise_record_set: `0`,
      exercise_record_rep: `0`,
      exercise_record_weight: `0`,
      exercise_record_volume: `0`,
      exercise_record_cardio: `00:00`,
    };
    const updatedSection = Array.from({ length: COUNT?.newSectionCnt }).fill(null).map((_item: any, idx: number) => {
      return idx < OBJECT?.exercise_section?.length ? OBJECT?.exercise_section[idx] : defaultSection;
    });
    setOBJECT((prev) => ({
      ...prev,
      exercise_section: updatedSection,
    }));

    // COUNT.sectionCnt도 newSectionCnt와 동기화
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: COUNT?.newSectionCnt,
    }));

  }, [COUNT?.newSectionCnt]);

  // 3. flow ------------------------------------------------------------------------------------
  const flowSave = async (type: string) => {
    setLOADING(true);
    if (!await validate(objectRef.current, countRef.current, `record`)) {
      setLOADING(false);
      return;
    }
    axios({
      method: type === `create` ? `post` : `put`,
      url: type === `create` ? `${URL_OBJECT}/record/create` : `${URL_OBJECT}/record/update`,
      data: {
        user_id: sessionId,
        OBJECT: objectRef.current,
        DATE: dateRef.current,
        type: type,
      },
    })
    .then((res: any) => {
      if (res.data.status === `success`) {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `success`,
        });
        void navigate(toList, {
          state: {
            dateType: ``,
            dateStart: dateRef.current.dateStart,
            dateEnd: dateRef.current.dateEnd,
          },
        });
        void sync(`scale`);
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
      }
    })
    .catch((error: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
      console.error(error);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ------------------------------------------------------------------------------------
  const flowDelete = async () => {
    setLOADING(true);
    if (!await validate(objectRef.current, countRef.current, `delete`)) {
      setLOADING(false);
      return;
    }
    axios({
      method: `delete`,
      url: `${URL_OBJECT}/record/delete`,
      data: {
        user_id: sessionId,
        DATE: dateRef.current,
      },
    })
    .then((res: any) => {
      if (res.data.status === `success`) {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `success`,
        });
        void navigate(toList, {
          state: {
            dateType: ``,
            dateStart: dateRef.current.dateStart,
            dateEnd: dateRef.current.dateEnd,
          },
        });
        void sync(`scale`);
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
      }
    })
    .catch((error: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
      console.error(error);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4-3. handle --------------------------------------------------------------------------------
  const handleDelete = useCallback((index: number) => {
    setOBJECT((prev) => ({
      ...prev,
      exercise_section: prev.exercise_section?.filter((_item: any, idx: number) => (idx !== index)),
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  }, []);

  // 7. detail ----------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Grid container={true} spacing={2} className={`radius-3 border-light-1 shadow-1 p-20px`}>
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
      <Grid container={true} spacing={2} className={`radius-3 border-light-1 shadow-1 p-20px`}>
        {/** row 1 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12}>
            <Input
              locked={LOCKED}
              readOnly={true}
              label={translate(`totalVolume`)}
              value={insertComma(OBJECT?.exercise_record_total_volume ?? `0`)}
              startadornment={(
                <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.volume }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                translate(`vol`)
              }
            />
          </Grid>
        </Grid>

        {/** row 2 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12}>
            <Input
              locked={LOCKED}
              readOnly={true}
              label={translate(`totalCardio`)}
              value={OBJECT?.exercise_record_total_cardio}
              startadornment={(
                <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.cardio }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                translate(`hm`)
              }
            />
          </Grid>
        </Grid>

        {/** row 3 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12}>
            <Input
              label={translate(`scale`)}
              value={insertComma(OBJECT?.exercise_record_total_scale ?? `0`)}
              startadornment={(
                <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.scale }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                localUnit
              }
              onChange={(e: any) => {
                const processedValue: string | null = handleNumberInput(e.target.value, 999, 2);
                if (processedValue === null) {
                      return;
                    }
                setOBJECT((prev) => ({
                  ...prev,
                  exercise_record_total_scale: processedValue,
                }));
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    );
    // 7-3. detail
    const detailSection = () => (
      <>
        {deferredObject?.exercise_section?.map((item, i) => (
          <Grid
            container={true}
            spacing={2}
            key={`detail-${i}`}
            className={`${LOCKED === `locked` ? `locked` : ``} radius-3 border-light-1 shadow-1 p-20px`}
          >
            {/** row 1 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6} className={`d-row-left`}>
                <Bg
                  badgeContent={i + 1}
                  bgcolor={bgColors?.[exerciseArray.findIndex((f: any) => f.exercise_record_part === item?.exercise_record_part)]}
                />
              </Grid>
              <Grid size={6} className={`d-row-right`}>
                <Delete
                  index={i}
                  handleDelete={handleDelete}
                  LOCKED={LOCKED}
                />
              </Grid>
            </Grid>

            {/** row 2 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6}>
                <Select
                  locked={LOCKED}
                  label={translate(`part`)}
                  value={item?.exercise_record_part ?? ``}
                  inputRef={REFS?.[i]?.exercise_record_part}
                  error={ERRORS?.[i]?.exercise_record_part}
                  onChange={(e: any) => {
                    const value: string = String(e.target.value ?? ``);
                    const foundIndex: number = exerciseArray.findIndex((f: any) => f.exercise_record_part === value);
                    const foundItem: any = foundIndex !== -1 ? exerciseArray[foundIndex] : null;
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
											idx === i ? {
											  ...section,
											  exercise_record_part: value,
											  exercise_record_title: foundItem?.exercise_record_title?.[0] ?? ``,
											} : section
                      )),
                    }));
                  }}
                >
                  {exerciseArray.map((part: any, idx: number) => (
                    <MenuItem
                      key={part.exercise_record_part}
                      value={part.exercise_record_part}
                      className={`fs-0-8rem`}
                    >
                      {translate(part.exercise_record_part)}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={6}>
                <Select
                  locked={LOCKED}
                  label={translate(`title`)}
                  value={item?.exercise_record_title ?? ``}
                  inputRef={REFS?.[i]?.exercise_record_title}
                  error={ERRORS?.[i]?.exercise_record_title}
                  onChange={(e: any) => {
                    const value: string = String(e.target.value ?? ``);
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
											idx === i ? {
											  ...section,
											  exercise_record_title: value,
											} : section
                      )),
                    }));
                  }}
                >
                  {(() => {
                    const foundIndex: number = exerciseArray.findIndex((f: any) => f.exercise_record_part === item?.exercise_record_part);
                    const foundItem: any = foundIndex !== -1 ? exerciseArray[foundIndex] : null;
                    return foundItem?.exercise_record_title?.map((title: any, idx: number) => (
                      <MenuItem
                        key={title}
                        value={title}
                        className={`fs-0-8rem`}
                      >
                        {translate(title as string)}
                      </MenuItem>
                    )) ?? [];
                  })()}
                </Select>
              </Grid>
            </Grid>

            {/** row 3 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  label={translate(`set`)}
                  value={insertComma(item?.exercise_record_set ?? `0`)}
                  inputRef={REFS?.[i]?.exercise_record_set}
                  error={ERRORS?.[i]?.exercise_record_set}
                  startadornment={(
                    <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.volume }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    translate(`s`)
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999);
                    if (processedValue === null) {
                      return;
                    }
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
											idx === i ? {
											  ...section,
											  exercise_record_set: processedValue,
											} : section
                      )),
                    }));
                  }}
                />
              </Grid>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  label={translate(`rep`)}
                  value={insertComma(item?.exercise_record_rep ?? `0`)}
                  inputRef={REFS?.[i]?.exercise_record_rep}
                  error={ERRORS?.[i]?.exercise_record_rep}
                  startadornment={(
                    <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.volume }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    translate(`r`)
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999);
                    if (processedValue === null) {
                      return;
                    }
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
											idx === i ? {
											  ...section,
											  exercise_record_rep: processedValue,
											} : section
                      )),
                    }));
                  }}
                />
              </Grid>
            </Grid>

            {/** row 4 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  label={translate(`weight`)}
                  value={insertComma(item?.exercise_record_weight ?? `0`)}
                  inputRef={REFS?.[i]?.exercise_record_weight}
                  error={ERRORS?.[i]?.exercise_record_weight}
                  startadornment={(
                    <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.volume }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    localUnit
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999);
                    if (processedValue === null) {
                      return;
                    }
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_section: prev.exercise_section?.map((section: any, idx: number) => (
											idx === i ? {
											  ...section,
											  exercise_record_weight: processedValue,
											} : section
                      )),
                    }));
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
                  extra={`exercise_record_cardio`}
                  i={i}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </>
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-3 border-light-1 shadow-1 h-min-75vh`}>
        {dateCountSection()}
        <Br m={20} />
        {totalSection()}
        <Br m={20} />
        {COUNT?.newSectionCnt > 0 && detailSection()}
      </Paper>
    );
  };

  // 8. dialog ----------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      OBJECT={OBJECT}
      setOBJECT={setOBJECT}
      LOCKED={LOCKED}
      setLOCKED={setLOCKED}
    />
  );

  // 9. footer ----------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST, FLOW,
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST, setFLOW,
      }}
      flow={{
        flowSave, flowDelete,
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {detailNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});
