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
import { insertComma, sync, getSession, setSession } from "@exportScripts";
import { handleNumberInput } from "@exportScripts";
import { ExerciseRecord, ExerciseRecordType, type CategoryType } from "@exportSchemas";
import { Footer, Dialog } from "@exportLayouts";
import { PickerDay, PickerTime, Count, Delete, Select, Input, PopUp, CategoryEdit } from "@exportContainers";
import { Icons, Bg, Div, Paper, Grid, Br } from "@exportComponents";
import { MenuItem } from "@exportMuis";
import type { CategoryEditGroup, CategoryEditResult, ExerciseCategoryItem } from "@exportTypes";

// -------------------------------------------------------------------------------------------------
export const ExerciseRecordDetail = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, URL_USER, PATH, navigate, toList,
    sessionId, localUnit, bgColors, exerciseArray: exerciseSession, chartThemeColors,
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
  const [ FAVORITE, setFAVORITE ] = useState<any[]>([]);
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
  const [ exerciseArray, setExerciseArray ] = useState<ExerciseCategoryItem[]>(exerciseSession);
  const [ CATEGORY_PART, setCATEGORY_PART ] = useState<string>(``);

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
  const categoryPopRef: React.RefObject<{
    openPopup: (_anchorEl: any) => void;
    closePopup: () => void;
  } | null> = useRef(null);

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
    axios.get(`${URL_OBJECT}/favorite/list`, {
      params: {
        user_id: sessionId,
      },
    })
    .then((res: any) => {
      setFAVORITE(
        (!res.data.result || res.data.result?.length === 0 ? [] : res.data.result)
      );
    })
    .catch((error: any) => {
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
    });
  }, [ URL_OBJECT, sessionId ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    setFAVORITE([]);
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

      const sessionSection: any = getSession(`section`, `exercise`, ``) ?? [];
      const sectionArray: any[] = Array.isArray(sessionSection) ? sessionSection : [];

      setOBJECT((prev) => ({
        ...prev,
        exercise_section: [
          ...(prev.exercise_section ?? []),
          ...sectionArray,
        ],
      }));

      setCOUNT((prev) => ({
        ...prev,
        newSectionCnt: prev.newSectionCnt + sectionArray.length,
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
      exercise_record_key: ``,
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

  // 3. flow ------------------------------------------------------------------------------------
  const flowUpdateFavorite = useCallback((favorite: any) => {
    axios.put(`${URL_OBJECT}/favorite/update`, {
      user_id: sessionId,
      favorite: favorite,
    })
    .then((res: any) => {
      if (res.data.status === `success`) {
        setFAVORITE(res.data.result?.length > 0 ? res.data.result : []);
        void sync(`favorite`);
      }
      else {
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
      }
    })
    .catch((error: any) => {
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
  }, [ URL_OBJECT, sessionId, setLOADING, setALERT, translate ]);

  // 3. flow ------------------------------------------------------------------------------------
  const flowSaveCategory = async (result: CategoryEditResult, closePopup: () => void) => {
    setLOADING(true);
    try {
      const resDetail: any = await axios.get(`${URL_USER}/category/detail`, {
        params: {
          user_id: sessionId,
        },
      });
      const baseCategory: CategoryType | null = resDetail?.data?.result ?? null;
      if (!baseCategory || !Array.isArray(baseCategory.exercise)) {
        setALERT({
          open: true,
          msg: translate(`saveFailed`),
          severity: `error`,
        });
        return;
      }
      const head: ExerciseCategoryItem = baseCategory.exercise?.[0] ?? {
        exercise_record_part: `all`,
        exercise_record_title: [`all`],
      };
      const edited: ExerciseCategoryItem[] = result.groups.map((group: CategoryEditGroup) => {
        const source: ExerciseCategoryItem | undefined = baseCategory.exercise?.find((item: ExerciseCategoryItem) => (
          item?.exercise_record_part === group.part
        ));
        return {
          exercise_record_part: group.part,
          exercise_record_title: [
            source?.exercise_record_title?.[0] ?? `all`,
            ...group.titles,
          ],
        };
      });
      const untouched: ExerciseCategoryItem[] = (baseCategory.exercise ?? []).slice(1).filter((item: ExerciseCategoryItem) => (
        !result.groups.some((group: CategoryEditGroup) => group.part === item?.exercise_record_part)
      ));
      const nextCategory: ExerciseCategoryItem[] = [ head, ...edited, ...untouched ];
      const resUpdate: any = await axios.post(`${URL_USER}/category/update`, {
        user_id: sessionId,
        OBJECT: {
          ...baseCategory,
          exercise: nextCategory,
        },
      });
      if (resUpdate?.data?.status !== `success`) {
        setALERT({
          open: true,
          msg: translate((resUpdate?.data?.msg as string) ?? `saveFailed`),
          severity: `error`,
        });
        return;
      }
      const synced: any = await sync(`category`);
      const syncedCategory: ExerciseCategoryItem[] = (
        Array.isArray(synced?.exercise) ? synced.exercise : nextCategory
      );
      setExerciseArray(syncedCategory);

      const renameMap: Map<string, string> = new Map<string, string>(
        result.renames.map((item) => [ `${item.part}::${item.from}`, item.to ]),
      );
      const removeSet: Set<string> = new Set<string>(
        result.removes.map((item) => `${item.part}::${item.title}`),
      );
      let reselect: boolean = false;
      if (renameMap.size > 0 || removeSet.size > 0) {
        const remap = (section: any) => {
          const part: string = section?.exercise_record_part ?? ``;
          const title: string = section?.exercise_record_title ?? ``;
          const titles: string[] = (
            syncedCategory.find((item: ExerciseCategoryItem) => (
              item?.exercise_record_part === part
            ))?.exercise_record_title ?? []
          );
          const renamed: string = renameMap.get(`${part}::${title}`) ?? title;
          const nextTitle: string = (
            removeSet.has(`${part}::${title}`) || !titles.includes(renamed)
              ? (titles[0] ?? ``)
              : renamed
          );
          if (nextTitle === title) {
            return section;
          }
          if (nextTitle !== renamed) {
            reselect = true;
          }
          const nextSection: any = {
            ...section,
            exercise_record_title: nextTitle,
          };
          return section?.exercise_record_key ? {
            ...nextSection,
            exercise_record_key: handleExerciseFavorite(nextSection).exercise_record_key,
          } : nextSection;
        };
        const nextSection: any[] = (objectRef.current?.exercise_section ?? []).map(remap);
        setOBJECT((prev) => ({
          ...prev,
          exercise_section: nextSection,
        }));
        const sessionSection: any = getSession(`section`, `exercise`, ``) ?? [];
        if (Array.isArray(sessionSection) && sessionSection.length > 0) {
          setSession(`section`, `exercise`, ``, sessionSection.map(remap));
        }
      }

      setALERT({
        open: true,
        msg: translate(reselect ? `categoryChanged` : (resUpdate?.data?.msg as string) ?? `saveSuccessful`),
        severity: reselect ? `warning` : `success`,
      });
      closePopup();
    }
    catch (error: any) {
      setALERT({
        open: true,
        msg: translate((error?.response?.data?.msg as string) ?? `saveError`),
        severity: `error`,
      });
      console.error(error);
    }
    finally {
      setLOADING(false);
    }
  };

  // 4-3. handle --------------------------------------------------------------------------------
  const handleDelete = useCallback((index: number) => {
    const currentItem: any = OBJECT?.exercise_section?.[index];
    const currentKey: string = currentItem?.exercise_record_key ?? (
      `${currentItem?.exercise_record_part ?? ``}_${currentItem?.exercise_record_title ?? ``}_${currentItem?.exercise_record_set ?? `0`}_${currentItem?.exercise_record_rep ?? `0`}_${currentItem?.exercise_record_weight ?? `0`}_${currentItem?.exercise_record_cardio ?? `00:00`}`
    );
    const sessionSection: any = getSession(`section`, `exercise`, ``) ?? [];

    if (currentKey !== `` && Array.isArray(sessionSection)) {
      setSession(`section`, `exercise`, ``, sessionSection.filter((item: any) => (
        item.exercise_record_key !== currentKey
      )));
    }

    setOBJECT((prev) => ({
      ...prev,
      exercise_section: prev.exercise_section?.filter((_item: any, idx: number) => (idx !== index)),
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  }, [ OBJECT?.exercise_section ]);

  // 4-4. handle --------------------------------------------------------------------------------
  const handleExerciseFavorite = useCallback((item: any) => {
    const exercise_record_part: string = item?.exercise_record_part ?? ``;
    const exercise_record_title: string = item?.exercise_record_title ?? ``;
    const exercise_record_set: string = item?.exercise_record_set ?? `0`;
    const exercise_record_rep: string = item?.exercise_record_rep ?? `0`;
    const exercise_record_weight: string = item?.exercise_record_weight ?? `0`;
    const exercise_record_cardio: string = item?.exercise_record_cardio ?? `00:00`;
    const exercise_record_key: string = (
      `${exercise_record_part}_${exercise_record_title}_${exercise_record_set}_${exercise_record_rep}_${exercise_record_weight}_${exercise_record_cardio}`
    );

    return {
      exercise_record_key: exercise_record_key,
      exercise_record_part: exercise_record_part,
      exercise_record_title: exercise_record_title,
      exercise_record_set: exercise_record_set,
      exercise_record_rep: exercise_record_rep,
      exercise_record_weight: exercise_record_weight,
      exercise_record_cardio: exercise_record_cardio,
    };
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
            allowZero={true}
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
      deferredObject?.exercise_section?.map((item, i) => (
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
              <Div className={`mt-n10px ml-15px`}>
                <Icons
                  key={`Star`}
                  name={
                    FAVORITE?.length > 0 && FAVORITE.some((favorite: any) => (
                      favorite.exercise_record_key === handleExerciseFavorite(item).exercise_record_key
                    )) ? `star_on` : `star_off`
                  }
                  isIconButton={true}
                  className={`w-20px h-20px`}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    flowUpdateFavorite(handleExerciseFavorite(item));
                  }}
                />
              </Div>
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
                  if (value === `__category_edit__`) {
                    return;
                  }
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
                <MenuItem
                  key={`__category_edit__`}
                  value={`__category_edit__`}
                  className={`cat-menu-add`}
                  onClick={() => {
                    setCATEGORY_PART(item?.exercise_record_part ?? ``);
                    categoryPopRef.current?.openPopup(null);
                  }}
                >
                  <Icons
                    key={`Plus`}
                    name={`Plus`}
                    isIconButton={false}
                    className={`w-14px h-14px navy`}
                  />
                </MenuItem>
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
      ))
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-2 border-light-1 shadow-1 h-min-75vh`}>
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
    <>
      <Dialog
        COUNT={COUNT}
        setCOUNT={setCOUNT}
        OBJECT={OBJECT}
        setOBJECT={setOBJECT}
        LOCKED={LOCKED}
        setLOCKED={setLOCKED}
      />
      <PopUp
        type={`innerCenter`}
        position={`center`}
        direction={`center`}
        contents={(popState: any) => (
          <CategoryEdit
            groups={(exerciseArray ?? []).slice(1).map((item: ExerciseCategoryItem) => ({
              part: item?.exercise_record_part ?? ``,
              titles: (item?.exercise_record_title ?? []).slice(1),
            }))}
            activePart={CATEGORY_PART}
            limit={20}
            onClose={popState.closePopup}
            onSave={(result: CategoryEditResult) => {
              void flowSaveCategory(result, popState.closePopup);
            }}
          />
        )}
        children={(popTrigger: any) => {
          categoryPopRef.current = popTrigger;
          return null;
        }}
      />
    </>
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