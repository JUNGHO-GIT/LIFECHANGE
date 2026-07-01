/**
 * @file CalendarDetail.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { React, useState, useEffect, useRef, useCallback, useDeferredValue, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useValidateCalendar } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { Calendar, CalendarType } from "@exportSchemas";
import { CalendarExerciseSectionType, CalendarFoodSectionType } from "@exportSchemas";
import { CalendarMoneySectionType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { insertComma, handleNumberInput, sync } from "@exportScripts";
import { Footer, Dialog } from "@exportLayouts";
import { PickerDay, PickerTime, Count, Delete, Input, Select, Memo } from "@exportContainers";
import { Icons, Img, Bg, Paper, Grid, Div, Br } from "@exportComponents";
import { Checkbox, MenuItem } from "@exportMuis";
import { MoneyCategoryItem, ExerciseCategoryItem, FoodCategoryItem } from "@exportTypes";

// -------------------------------------------------------------------------------------------------
export const CalendarDetail = memo(() => {
  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_OBJECT, navigate, toCalendarList, sessionId, localCurrency,
    bgColors, localUnit,
    exerciseArray, foodArray, moneyArray,
    location_dateType, location_dateStart, location_dateEnd, chartThemeColors,
  } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();
  const { ERRORS, REFS, validate } = useValidateCalendar();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ LOCKED, setLOCKED ] = useState<string>(`unlocked`);
  const [ OBJECT, setOBJECT ] = useState<CalendarType>(Calendar);
  const [ EXIST, setEXIST ] = useState({
    day: [``],
    week: [``],
    month: [``],
    year: [``],
    select: [``],
  });
  const [ FLOW, setFLOW ] = useState({
    theme: `calendar`,
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
    dateType: location_dateType ?? `select`,
    dateStart: location_dateStart ?? getDayFmt(),
    dateEnd: location_dateEnd ?? getDayFmt(),
  });

  // 2-2. useDeferredValue ----------------------------------------------------------------------
  // 섹션 항목 렌더를 비긴급으로 분리: 진입 시 화면 틀이 먼저 그려지고 상세 항목은 다음 프레임에 채워짐
  const deferredObject = useDeferredValue(OBJECT);
  // 2-3. useRef --------------------------------------------------------------------------------
  const objectRef: React.RefObject<
    CalendarType
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
  useEffect(() => {
    if (EXIST?.[DATE?.dateType as keyof typeof EXIST]?.length > 0) {
      const dateRange: string = (
        `${DATE?.dateStart?.trim()} - ${DATE?.dateEnd?.trim()}`
      );
      const objectRange: string = (
        `${OBJECT.calendar_exercise_dateStart.trim()} - ${OBJECT.calendar_exercise_dateEnd.trim()}`
      );
      const isExist: boolean = (
        EXIST?.[DATE?.dateType as keyof typeof EXIST]?.includes(dateRange)
      );
      const itsMe: boolean = (
        dateRange === objectRange
      );
      const itsNew: boolean = (
        OBJECT.calendar_exercise_dateStart === `0000-00-00` &&
				OBJECT.calendar_exercise_dateEnd === `0000-00-00`
      );
      setFLOW((prev) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew,
      }));
    }
  }, [ EXIST, DATE?.dateEnd, OBJECT.calendar_exercise_dateEnd ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/exist`, {
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
      setEXIST(!res.data.result || res.data.result?.length === 0 ? [``] : res.data.result)
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
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setLOADING(false);
      setOBJECT(res.data.result ?? Calendar);

      // sectionCnt가 0이면 section 초기화
      if (res.data.sectionCnt <= 0) {
        setOBJECT((prev: CalendarType) => ({
          ...prev,
          calendar_exercise_section: [],
          calendar_food_section: [],
          calendar_money_section: [],
          calendar_sleep_section: [],
        }));
      }
      // sectionCnt가 0이 아니면 section 설정
      else {
        setOBJECT((prev: CalendarType) => ({
          ...prev,
          calendar_exercise_section: res.data.result?.calendar_exercise_section ?? [],
          calendar_food_section: res.data.result?.calendar_food_section ?? [],
          calendar_money_section: res.data.result?.calendar_money_section ?? [],
          calendar_sleep_section: res.data.result?.calendar_sleep_section ?? [],
        }));
      }
      // count 설정
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

  // 2-3. useEffect (exercise total 계산) ------------------------------------------------------
  useEffect(() => {
    const totals: any = OBJECT?.calendar_exercise_section?.reduce((acc: any, cur: any) => ({
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
    }), {
      totalVolume: 0,
      totalCardio: 0,
    });

    setOBJECT((prev) => ({
      ...prev,
      calendar_exercise_record_total_volume: totals.totalVolume.toString(),
      calendar_exercise_record_total_cardio: `${Math.floor(totals.totalCardio / 60).toString().padStart(2, `0`)}:${(totals.totalCardio % 60).toString().padStart(2, `0`)}`,
    }));
  }, [OBJECT?.calendar_exercise_section]);

  // 2-3. useEffect (food total 계산) ----------------------------------------------------------
  useEffect(() => {
    const totals: any = OBJECT?.calendar_food_section?.reduce((acc: any, cur: any) => ({
      totalCalorie: Number(acc.totalCalorie) + Number(cur.food_record_kcal),
      totalCarb: Number(acc.totalCarb) + Number(cur.food_record_carb),
      totalProtein: Number(acc.totalProtein) + Number(cur.food_record_protein),
      totalFat: Number(acc.totalFat) + Number(cur.food_record_fat),
    }), {
      totalCalorie: 0,
      totalCarb: 0,
      totalProtein: 0,
      totalFat: 0,
    });

    setOBJECT((prev) => ({
      ...prev,
      calendar_food_record_total_calorie: totals.totalCalorie.toString(),
      calendar_food_record_total_carb: totals.totalCarb.toString(),
      calendar_food_record_total_protein: totals.totalProtein.toString(),
      calendar_food_record_total_fat: totals.totalFat.toString(),
    }));
  }, [OBJECT?.calendar_food_section]);

  // 2-3. useEffect (money total 계산) ---------------------------------------------------------
  useEffect(() => {
    const totals: any = OBJECT?.calendar_money_section?.reduce((acc: any, cur: any) => {
      const amount: number = Number(cur.money_record_amount);
      return {
        totalIncome: cur.money_record_part === `income` ? Number(acc.totalIncome) + amount : Number(acc.totalIncome),
        totalExpense: cur.money_record_part === `expense` ? Number(acc.totalExpense) + amount : Number(acc.totalExpense),
      };
    }, {
      totalIncome: 0,
      totalExpense: 0,
    });

    setOBJECT((prev) => ({
      ...prev,
      calendar_money_record_total_income: totals.totalIncome.toString(),
      calendar_money_record_total_expense: totals.totalExpense.toString(),
    }));
  }, [OBJECT?.calendar_money_section]);

  // 2-3. useEffect (sleep total 계산) ---------------------------------------------------------
  useEffect(() => {
    const totals: any = OBJECT?.calendar_sleep_section?.reduce((acc: any, cur: any) => {
      const sleepTime: any = cur.sleep_record_sleepTime?.split(`:`) ?? [ `0`, `0` ];
      const minutes: number = Number(sleepTime[0]) * 60 + Number(sleepTime[1]);
      return {
        totalTime: Number(acc.totalTime) + minutes,
      };
    }, {
      totalTime: 0,
    });

    setOBJECT((prev) => ({
      ...prev,
      calendar_sleep_record_total_time: `${Math.floor(totals.totalTime / 60).toString().padStart(2, `0`)}:${(totals.totalTime % 60).toString().padStart(2, `0`)}`,
    }));
  }, [OBJECT?.calendar_sleep_section]);

  // 3. flow ------------------------------------------------------------------------------------
  const flowSave = async (type: string) => {
    setLOADING(true);
    if (!await validate(objectRef.current, countRef.current, `record`)) {
      setLOADING(false);
      return;
    }
    axios({
      method: type === `create` ? `post` : `put`,
      url: type === `create` ? `${URL_OBJECT}/create` : `${URL_OBJECT}/update`,
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
        void navigate(toCalendarList, {
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
      url: `${URL_OBJECT}/delete`,
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
        void navigate(toCalendarList, {
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

  // 4-3. handle ----------------------------------------------------------------------------------
  const handleDelete = useCallback((index: number, section?: string) => {
    section && (() => {
      setOBJECT((prev: CalendarType) => ({
        ...prev,
        [section]: (prev[section as keyof CalendarType] as any[] ?? []).filter(
          (_item: any, idx: number) => idx !== index,
        ),
      }));
      setCOUNT((prev) => ({
        ...prev,
        newSectionCnt: prev.newSectionCnt - 1,
      }));
    })();
  }, []);

  // 7. detail -------------------------------------------------------------------------------------
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
            disabled={true}
          />
        </Grid>
      </Grid>
    );

    // 7-2. exercise
    const exerciseSection = () => (
      <>
        {/** header * */}
        <Grid container={true} spacing={0} className={`${OBJECT?.calendar_exercise_section?.length === 0 ? `radius-2` : `radius-top-2`} border-light-1 shadow-bottom-1 p-10px`}>
          <Grid size={12} className={`d-row`}>
            <Div className={`d-row-left`}>
              <Icons
                key={`exercise1`}
                name={`exercise1`}
                isIconButton={false}
                className={`w-10px h-10px hover ml-5px mr-10px`}
              />
              <Div className={`fs-0-9rem fw-600`}>
                {translate(`exercise`)}
              </Div>
            </Div>
          </Grid>
        </Grid>

        {/** items * */}
        {deferredObject?.calendar_exercise_section?.map((item, i) => (
          <Grid
            container={true}
            spacing={2}
            key={`exercise-detail-${item.exercise_record_part}-${item.exercise_record_title}-${item.exercise_record_set}-${item.exercise_record_rep}-${item.exercise_record_weight}-${item.exercise_record_cardio}`}
            className={`${i === 0 ? `radius-top-0 radius-2` : `radius-2`} border-light-1 border-top-0 shadow-1 p-20px`}
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
                  section={`calendar_exercise_section`}
                  handleDelete={handleDelete}
                  LOCKED={LOCKED}
                  disabled={false}
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
                  inputRef={REFS?.[i]?.exercise_record_part ?? null}
                  error={ERRORS?.[i]?.exercise_record_part ?? null}
                  onChange={(e: any) => {
                    const value: string = String(e.target.value ?? ``);
                    const foundIndex: number = exerciseArray.findIndex((f: any) => f.exercise_record_part === value);
                    const foundItem: ExerciseCategoryItem | null = foundIndex !== -1 ? exerciseArray[foundIndex] : null;
                    setOBJECT((prev: CalendarType) => ({
                      ...prev,
                      calendar_exercise_section: prev.calendar_exercise_section?.map((section: CalendarExerciseSectionType, idx: number) => (
												idx === i ? {
												  ...section,
												  exercise_record_part: value,
												  exercise_record_title: (foundItem as any)?.exercise_record_title?.[0] ?? ``,
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
                      {translate(part.exercise_record_part as string)}
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
                    setOBJECT((prev: CalendarType) => ({
                      ...prev,
                      calendar_exercise_section: prev.calendar_exercise_section?.map((section: CalendarExerciseSectionType, idx: number) => (
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
                    const foundItem: ExerciseCategoryItem | null = foundIndex !== -1 ? exerciseArray[foundIndex] : null;
                    return (foundItem as any)?.exercise_record_title?.map((title: any, idx: number) => (
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
                    <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.volume }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    translate(`s`)
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_exercise_section: prev.calendar_exercise_section?.map((section: CalendarExerciseSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  exercise_record_set: processedValue,
													} : section
                        )),
                      }))
                    );
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
                    <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.volume }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    translate(`r`)
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_exercise_section: prev.calendar_exercise_section?.map((section: CalendarExerciseSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  exercise_record_rep: processedValue,
													} : section
                        )),
                      }))
                    );
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
                    <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.volume }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    localUnit
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_exercise_section: prev.calendar_exercise_section?.map((section: CalendarExerciseSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  exercise_record_weight: processedValue,
													} : section
                        )),
                      }))
                    );
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

    // 7-3. food
    const foodSection = () => (
      <>
        {/** header * */}
        <Grid container={true} spacing={0} className={`${OBJECT?.calendar_food_section?.length === 0 ? `radius-2` : `radius-top-2`} border-light-1 shadow-bottom-1 p-10px`}>
          <Grid size={12} className={`d-row`}>
            <Div className={`d-row-left`}>
              <Icons
                key={`food1`}
                name={`food1`}
                isIconButton={false}
                className={`w-10px h-10px hover ml-5px mr-10px`}
              />
              <Div className={`fs-0-9rem fw-600`}>
                {translate(`food`)}
              </Div>
            </Div>
          </Grid>
        </Grid>

        {/** items * */}
        {deferredObject?.calendar_food_section?.map((item, i) => (
          <Grid
            container={true}
            spacing={2}
            key={`food-detail-${item.food_record_part}-${item.food_record_name}-${item.food_record_brand}-${item.food_record_count}-${item.food_record_serv}-${item.food_record_gram}`}
            className={`${i === 0 ? `radius-top-0 radius-2` : `radius-2`} border-light-1 border-top-0 shadow-1 p-20px`}
          >
            {/** row 1 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6} className={`d-row-left`}>
                <Bg
                  badgeContent={i + 1}
                  bgcolor={bgColors?.[foodArray.findIndex((f: any) => f.food_record_part === item?.food_record_part)]}
                />
              </Grid>
              <Grid size={6} className={`d-row-right`}>
                <Delete
                  index={i}
                  section={`calendar_food_section`}
                  handleDelete={handleDelete}
                  LOCKED={LOCKED}
                  disabled={false}
                />
              </Grid>
            </Grid>

            {/** row 2 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6}>
                <Select
                  locked={LOCKED}
                  label={translate(`part`)}
                  value={item?.food_record_part ?? ``}
                  inputRef={REFS?.[i]?.food_record_part}
                  error={ERRORS?.[i]?.food_record_part}
                  onChange={(e: any) => {
                    const value: string = String(e.target.value ?? ``);
                    setOBJECT((prev: CalendarType) => ({
                      ...prev,
                      calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
												idx === i ? {
												  ...section,
												  food_record_part: value,
												} : section
                      )),
                    }));
                  }}
                >
                  {foodArray.map((part: any, idx: number) => (
                    <MenuItem
                      key={part.food_record_part}
                      value={part.food_record_part}
                      className={`fs-0-8rem`}
                    >
                      {translate(part.food_record_part as string)}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={3}>
                <Input
                  locked={LOCKED}
                  label={translate(`foodCount`)}
                  value={insertComma(item?.food_record_count ?? `0`)}
                  inputRef={REFS?.[i]?.food_record_count}
                  error={ERRORS?.[i]?.food_record_count}
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 99, 1);
                    processedValue !== null && (() => {
                      const numericValue: number = Number(processedValue) ?? 1;
                      const foodCount: number = Number(item?.food_record_count) ?? 1;
                      const setNutrient = (nut: string | number, extra: string) => (
												!Number.isNaN(numericValue) && !Number.isNaN(foodCount) ? (
													extra === `kcal` ? (
														(numericValue * Number(nut) / foodCount).toFixed(0)
													) : (
														(numericValue * Number(nut) / foodCount).toFixed(1)
													)
												) : (
													nut
												)
                      );

                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  food_record_count: processedValue,
													  food_record_kcal: setNutrient(section.food_record_kcal, `kcal`) as string,
													  food_record_carb: setNutrient(section.food_record_carb, `carb`) as string,
													  food_record_protein: setNutrient(section.food_record_protein, `protein`) as string,
													  food_record_fat: setNutrient(section.food_record_fat, `fat`) as string,
													} : section
                        )),
                      }));
                    })();
                  }}
                />
              </Grid>
              <Grid size={3}>
                <Input
                  locked={LOCKED}
                  label={translate(`gram`)}
                  value={insertComma(item?.food_record_gram ?? `0`)}
                  inputRef={REFS?.[i]?.food_record_gram}
                  error={ERRORS?.[i]?.food_record_gram}
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  food_record_gram: processedValue,
													} : section
                        )),
                      }))
                    );
                  }}
                />
              </Grid>
            </Grid>

            {/** row 3 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  shrink={`shrink`}
                  label={translate(`foodName`)}
                  value={item?.food_record_name ?? ``}
                  inputRef={REFS?.[i]?.food_record_name}
                  error={ERRORS?.[i]?.food_record_name}
                  onChange={(e: any) => {
                    const value: string = e.target.value ?? ``;
                    value?.length <= 30 && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  food_record_name: value,
													} : section
                        )),
                      }))
                    );
                  }}
                />
              </Grid>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  shrink={`shrink`}
                  label={translate(`brand`)}
                  value={item?.food_record_brand ?? ``}
                  inputRef={REFS?.[i]?.food_record_brand}
                  error={ERRORS?.[i]?.food_record_brand}
                  onChange={(e: any) => {
                    const value: string = e.target.value ?? ``;
                    value?.length <= 30 && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  food_record_brand: value,
													} : section
                        )),
                      }))
                    );
                  }}
                />
              </Grid>
            </Grid>

            {/** row 4 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  label={translate(`kcal`)}
                  value={insertComma(item?.food_record_kcal ?? `0`)}
                  inputRef={REFS?.[i]?.food_record_kcal}
                  error={ERRORS?.[i]?.food_record_kcal}
                  startadornment={(
                    <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.kcal }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    translate(`kc`)
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 9999);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  food_record_kcal: processedValue,
													} : section
                        )),
                      }))
                    );
                  }}
                />
              </Grid>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  label={translate(`carb`)}
                  value={insertComma(item?.food_record_carb ?? `0`)}
                  inputRef={REFS?.[i]?.food_record_carb}
                  error={ERRORS?.[i]?.food_record_carb}
                  startadornment={(
                    <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.carb }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    translate(`g`)
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999, 1);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  food_record_carb: processedValue,
													} : section
                        )),
                      }))
                    );
                  }}
                />
              </Grid>
            </Grid>

            {/** row 5 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  label={translate(`protein`)}
                  value={insertComma(item?.food_record_protein ?? `0`)}
                  inputRef={REFS?.[i]?.food_record_protein}
                  error={ERRORS?.[i]?.food_record_protein}
                  startadornment={(
                    <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.protein }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    translate(`g`)
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999, 1);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  food_record_protein: processedValue,
													} : section
                        )),
                      }))
                    );
                  }}
                />
              </Grid>
              <Grid size={6}>
                <Input
                  locked={LOCKED}
                  label={translate(`fat`)}
                  value={insertComma(item?.food_record_fat ?? `0`)}
                  inputRef={REFS?.[i]?.food_record_fat}
                  error={ERRORS?.[i]?.food_record_fat}
                  startadornment={(
                    <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.fat }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    translate(`g`)
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999, 1);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_food_section: prev.calendar_food_section?.map((section: CalendarFoodSectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  food_record_fat: processedValue,
													} : section
                        )),
                      }))
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </>
    );

    // 7-4. money
    const moneySection = () => (
      <>
        {/** header * */}
        <Grid container={true} spacing={0} className={`${OBJECT?.calendar_money_section?.length === 0 ? `radius-2` : `radius-top-2`} border-light-1 shadow-bottom-1 p-10px`}>
          <Grid size={12} className={`d-row`}>
            <Div className={`d-row-left`}>
              <Icons
                key={`money1`}
                name={`money1`}
                isIconButton={false}
                className={`w-10px h-10px hover ml-5px mr-10px`}
              />
              <Div className={`fs-0-9rem fw-600`}>
                {translate(`money`)}
              </Div>
            </Div>
          </Grid>
        </Grid>

        {/** items * */}
        {deferredObject?.calendar_money_section?.map((item, i) => (
          <Grid
            container={true}
            spacing={2}
            key={`money-detail-${item.money_record_part}-${item.money_record_title}-${item.money_record_amount}-${item.money_record_content}-${item.money_record_include}`}
            className={`${i === 0 ? `radius-top-0 radius-2` : `radius-2`} border-light-1 border-top-0 shadow-1 p-20px`}
          >
            {/** row 1 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6} className={`d-row-left`}>
                <Bg
                  badgeContent={i + 1}
                  bgcolor={bgColors?.[moneyArray.findIndex((f: any) => f.money_record_part === item?.money_record_part)]}
                />
              </Grid>
              <Grid size={6} className={`d-row-right`}>
                <Delete
                  index={i}
                  section={`calendar_money_section`}
                  handleDelete={handleDelete}
                  LOCKED={LOCKED}
                  disabled={false}
                />
              </Grid>
            </Grid>

            {/** row 2 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6}>
                <Select
                  locked={LOCKED}
                  label={translate(`part`)}
                  value={item?.money_record_part ?? ``}
                  inputRef={REFS?.[i]?.money_record_part}
                  error={ERRORS?.[i]?.money_record_part}
                  onChange={(e: any) => {
                    const value: string = String(e.target.value ?? ``);
                    const foundIndex: number = moneyArray.findIndex((f: any) => f.money_record_part === value);
                    const foundItem: MoneyCategoryItem | null = foundIndex !== -1 ? moneyArray[foundIndex] : null;
                    setOBJECT((prev: CalendarType) => ({
                      ...prev,
                      calendar_money_section: prev.calendar_money_section?.map((section: CalendarMoneySectionType, idx: number) => (
												idx === i ? {
												  ...section,
												  money_record_part: value,
												  money_record_title: (foundItem as any)?.money_record_title?.[0] ?? ``,
												} : section
                      )),
                    }));
                  }}
                >
                  {moneyArray.map((part: any, idx: number) => (
                    <MenuItem
                      key={part.money_record_part}
                      value={part.money_record_part}
                      className={`fs-0-8rem`}
                    >
                      {translate(part.money_record_part)}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={6}>
                <Select
                  locked={LOCKED}
                  label={translate(`title`)}
                  value={item?.money_record_title ?? ``}
                  inputRef={REFS?.[i]?.money_record_title}
                  error={ERRORS?.[i]?.money_record_title}
                  onChange={(e: any) => {
                    const value: string = String(e.target.value ?? ``);
                    setOBJECT((prev: CalendarType) => ({
                      ...prev,
                      calendar_money_section: prev.calendar_money_section?.map((section: CalendarMoneySectionType, idx: number) => (
												idx === i ? {
												  ...section,
												  money_record_title: value,
												} : section
                      )),
                    }));
                  }}
                >
                  {(() => {
                    const foundIndex: number = moneyArray.findIndex((f: any) => f.money_record_part === item?.money_record_part);
                    const foundItem: MoneyCategoryItem | null = foundIndex !== -1 ? moneyArray[foundIndex] : null;
                    return (foundItem as any)?.money_record_title?.map((title: any, idx: number) => (
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
              <Grid size={12}>
                <Input
                  locked={LOCKED}
                  label={translate(`amount`)}
                  value={insertComma(item?.money_record_amount ?? `0`)}
                  inputRef={REFS?.[i]?.money_record_amount}
                  error={ERRORS?.[i]?.money_record_amount}
                  startadornment={(
                    <Div className={`fs-0-6rem`} style={{ color: bgColors?.[moneyArray.findIndex((f: any) => f.money_record_part === item?.money_record_part)] ?? chartThemeColors.expense }}>
                      {`●`}
                    </Div>
                  )}
                  endadornment={
                    localCurrency
                  }
                  onChange={(e: any) => {
                    const processedValue: string | null = handleNumberInput(e.target.value, 999_999_999);
                    processedValue !== null && (
                      setOBJECT((prev: CalendarType) => ({
                        ...prev,
                        calendar_money_section: prev.calendar_money_section?.map((section: CalendarMoneySectionType, idx: number) => (
													idx === i ? {
													  ...section,
													  money_record_amount: processedValue,
													} : section
                        )),
                      }))
                    );
                  }}
                />
              </Grid>
            </Grid>

            {/** row 4 * */}
            <Grid container={true} spacing={1}>
              <Grid size={{ xs: 7, sm: 8 }} className={`d-center`}>
                <Memo
                  OBJECT={OBJECT}
                  setOBJECT={setOBJECT}
                  LOCKED={LOCKED}
                  extra={`money_record_content`}
                  i={i}
                  section={`calendar_money_section`}
                />
              </Grid>
              <Grid size={{ xs: 5, sm: 4 }} className={`d-center`}>
                <Div className={`fs-0-7rem fw-500 dark ml-10px`}>
                  {translate(`includeProperty`)}
                </Div>
                <Checkbox
                  size={`small`}
                  className={`p-0px ml-5px`}
                  checked={item?.money_record_include === `Y`}
                  disabled={LOCKED === `locked`}
                  onChange={(e: any) => {
                    setOBJECT((prev: CalendarType) => ({
                      ...prev,
                      calendar_money_section: prev.calendar_money_section?.map((section: CalendarMoneySectionType, idx: number) => (
												idx === i ? {
												  ...section,
												  money_record_include: e.target.checked ? `Y` : `N`,
												} : section
                      )),
                    }));
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </>
    );

    // 7-5. sleep
    const sleepSection = () => (
      <>
        {/** header * */}
        <Grid container={true} spacing={0} className={`${OBJECT?.calendar_sleep_section?.length === 0 ? `radius-2` : `radius-top-2`} border-light-1 shadow-bottom-1 p-10px`}>
          <Grid size={12} className={`d-row`}>
            <Div className={`d-row-left`}>
              <Icons
                key={`sleep1`}
                name={`sleep1`}
                isIconButton={false}
                className={`w-10px h-10px hover ml-5px mr-10px`}
              />
              <Div className={`fs-0-9rem fw-600`}>
                {translate(`sleep`)}
              </Div>
            </Div>
          </Grid>
        </Grid>

        {/** items * */}
        {deferredObject?.calendar_sleep_section?.map((_item, i) => (
          <Grid
            container={true}
            spacing={2}
            key={`sleep-detail-${_item.sleep_record_bedTime}-${_item.sleep_record_wakeTime}-${_item.sleep_record_sleepTime}`}
            className={`${i === 0 ? `radius-top-0 radius-2` : `radius-2`} border-light-1 border-top-0 shadow-1 p-20px`}
          >
            {/** row 1 * */}
            <Grid container={true} spacing={1}>
              <Grid size={6} className={`d-row-left`}>
                <Bg
                  badgeContent={i + 1}
                  bgcolor={`#1976d2`}
                />
              </Grid>
              <Grid size={6} className={`d-row-right`}>
                <Delete
                  index={i}
                  section={`calendar_sleep_section`}
                  handleDelete={handleDelete}
                  LOCKED={LOCKED}
                  disabled={false}
                />
              </Grid>
            </Grid>

            {/** row 2 * */}
            <Grid container={true} spacing={1}>
              <Grid size={12}>
                <PickerTime
                  OBJECT={OBJECT}
                  setOBJECT={setOBJECT}
                  REFS={REFS}
                  ERRORS={ERRORS}
                  DATE={DATE}
                  LOCKED={LOCKED}
                  extra={`sleep_record_bedTime`}
                  i={i}
                />
              </Grid>
            </Grid>

            {/** row 3 * */}
            <Grid container={true} spacing={1}>
              <Grid size={12}>
                <PickerTime
                  OBJECT={OBJECT}
                  setOBJECT={setOBJECT}
                  REFS={REFS}
                  ERRORS={ERRORS}
                  DATE={DATE}
                  LOCKED={LOCKED}
                  extra={`sleep_record_wakeTime`}
                  i={i}
                />
              </Grid>
            </Grid>

            {/** row 4 * */}
            <Grid container={true} spacing={1}>
              <Grid size={12}>
                <PickerTime
                  OBJECT={OBJECT}
                  setOBJECT={setOBJECT}
                  REFS={REFS}
                  ERRORS={ERRORS}
                  DATE={DATE}
                  LOCKED={LOCKED}
                  extra={`sleep_record_sleepTime`}
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
        {exerciseSection()}
        <Br m={20} />
        {foodSection()}
        <Br m={20} />
        {moneySection()}
        <Br m={20} />
        {sleepSection()}
      </Paper>
    );
  };

  // 8. dialog -------------------------------------------------------------------------------------
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

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE: DATE, SEND: SEND, COUNT: COUNT, EXIST: EXIST, FLOW: FLOW,
      }}
      setState={{
        setDATE: setDATE, setSEND: setSEND, setCOUNT: setCOUNT, setEXIST: setEXIST, setFLOW: setFLOW,
      }}
      flow={{
        flowSave: flowSave, flowDelete: flowDelete,
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
});
