/**
 * @file FoodRecordDetail.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { React, useState, useEffect, useRef, useCallback, useDeferredValue, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useValidateFood } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { FoodRecord, FoodRecordType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { insertComma, setSession, getSession, sync, handleNumberInput } from "@exportScripts";
import { Footer, Dialog } from "@exportLayouts";
import { PickerDay, Count, Delete, Input, Select } from "@exportContainers";
import { Img, Bg, Icons, Div, Paper, Grid, Br } from "@exportComponents";
import { MenuItem } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodRecordDetail = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, navigate, toList, sessionId,
    foodArray, bgColors, chartThemeColors,
    location_dateStart, location_dateEnd,
  } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { ERRORS, REFS, validate } = useValidateFood();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-2. useState -------------------------------------------------------------------------------
  const [ LOCKED, setLOCKED ] = useState<string>(`unlocked`);
  const [ OBJECT, setOBJECT ] = useState<FoodRecordType>(FoodRecord);
  const [ FAVORITE, setFAVORITE ] = useState([]);
  const [ EXIST, setEXIST ] = useState({
    day: [``],
    week: [``],
    month: [``],
    year: [``],
    select: [``],
  });
  const [ FLOW, setFLOW ] = useState({
    theme: `food`,
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
    FoodRecordType
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
  // 회(count) 편집 시 기준이 되는 1회당 영양값 보존 (편집 중 회가 0/공백을 거쳐도 기준 유지)
  const foodBaseRef = useRef<Record<number, {
    kcal: number;
    carb: number;
    protein: number;
    fat: number;
  }>>({});

  // 2-3. useEffect ------------------------------------------------------------------------------
  useEffect(() => {
    COUNT !== countRef.current && (countRef.current = COUNT);
    OBJECT !== objectRef.current && (objectRef.current = OBJECT);
    DATE !== dateRef.current && (dateRef.current = DATE);
  }, [ COUNT, OBJECT, DATE ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    const dateRange: string = (
      `${DATE?.dateStart.trim()} - ${DATE?.dateEnd.trim()}`
    );
    const objectRange: string = (
      `${OBJECT.food_record_dateStart.trim()} - ${OBJECT.food_record_dateEnd.trim()}`
    );
    const isExist: boolean = (
      EXIST?.[DATE?.dateType as keyof typeof EXIST]?.includes(dateRange)
    );
    const itsMe: boolean = (
      dateRange === objectRange
    );
    const itsNew: boolean = (
      OBJECT.food_record_dateStart === `0000-00-00` &&
      OBJECT.food_record_dateEnd === `0000-00-00`
    );

    setFLOW((prev) => ({
      ...prev,
      exist: isExist,
      itsMe: itsMe,
      itsNew: itsNew,
    }));
  }, [
    EXIST,
    DATE?.dateType,
    DATE?.dateStart,
    DATE?.dateEnd,
    OBJECT.food_record_dateStart,
    OBJECT.food_record_dateEnd,
  ]);

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
        (!res.data.result || res.data.result?.length === 0 ? [``] : res.data.result)
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
      setOBJECT(res.data.result ?? FoodRecord);

      res.data.sectionCnt <= 0 && setOBJECT((prev) => ({
        ...prev,
        food_section: [],
      }));

      res.data.sectionCnt > 0 && setOBJECT((prev) => ({
        ...prev,
        food_section: prev.food_section?.sort((a: any, b: any) => (
          foodArray.findIndex((item: any) => item.food_record_part === a.food_record_part) -
          foodArray.findIndex((item: any) => item.food_record_part === b.food_record_part)
        )),
      }));

      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ?? 0,
        sectionCnt: res.data.sectionCnt ?? 0,
        newSectionCnt: res.data.sectionCnt ?? 0,
      }));

      const sessionSection: any = getSession(`section`, `food`, ``) ?? [];
      const sectionArray: any[] = sessionSection?.length > 0 ? sessionSection : [];

      setOBJECT((prev) => ({
        ...prev,
        food_section: prev?.food_section
				? [ ...[...prev.food_section]?.sort((a, b) => Number.parseInt(a.food_record_part) - Number.parseInt(b.food_record_part)), ...sectionArray ]
				: [...sectionArray],
      }));

      setCOUNT((prev) => ({
        ...prev,
        newSectionCnt: prev?.newSectionCnt + sectionArray?.length,
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
    const totals = OBJECT?.food_section.reduce((acc: any, cur: any) => {
      return {
        totalKcal: Number(acc.totalKcal) + Number(cur.food_record_kcal),
        totalFat: Number(acc.totalFat) + Number(cur.food_record_fat),
        totalCarb: Number(acc.totalCarb) + Number(cur.food_record_carb),
        totalProtein: Number(acc.totalProtein) + Number(cur.food_record_protein),
      };
    }, {
      totalKcal: 0,
      totalFat: 0,
      totalCarb: 0,
      totalProtein: 0,
    });

    setOBJECT((prev) => ({
      ...prev,
      food_record_total_kcal: Number(totals.totalKcal).toString(),
      food_record_total_fat: Number(totals.totalFat.toFixed(1)).toString(),
      food_record_total_carb: Number(totals.totalCarb.toFixed(1)).toString(),
      food_record_total_protein: Number(totals.totalProtein.toFixed(1)).toString(),
    }));
  }, [OBJECT?.food_section]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      food_record_part: foodArray[1]?.food_record_part ?? ``,
      food_record_key: ``,
      food_record_name: ``,
      food_record_brand: ``,
      food_record_count: `1`,
      food_record_serv: `serv`,
      food_record_gram: `0`,
      food_record_kcal: `0`,
      food_record_fat: `0`,
      food_record_carb: `0`,
      food_record_protein: `0`,
    };
    const updatedSection = Array.from({ length: COUNT?.newSectionCnt }).fill(null).map((_item: any, idx: number) => {
      return idx < OBJECT?.food_section?.length ? OBJECT?.food_section[idx] : defaultSection;
    });
    setOBJECT((prev) => ({
      ...prev,
      food_section: updatedSection,
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
        setSession(`section`, `food`, ``, []);
        void sync(`nutrition`);
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
        void sync(`nutrition`);
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
  const flowUpdateFavorite = useCallback((foodFavorite: any) => {
    if (!foodFavorite.food_record_name || foodFavorite.food_record_name.trim() === ``) {
      setALERT({
        open: true,
        msg: translate(`음식 이름을 입력해주세요.`),
        severity: `error`,
      });
      return;
    }

    axios.put(`${URL_OBJECT}/favorite/update`, {
      user_id: sessionId,
      foodFavorite: foodFavorite,
    })
    .then((res: any) => {
      res.data.status === `success` && (() => {
        setFAVORITE(res.data.result);
        void sync(`favorite`);
      })();
      res.data.status !== `success` && (() => {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
      })();
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
  }, [ URL_OBJECT, sessionId, setLOADING, setALERT, translate ]);

  // 4-3. handle --------------------------------------------------------------------------------
  const handleDelete = useCallback((index: number) => {

    const currentItem: any = OBJECT?.food_section?.[index];
    const sessionSection: any = getSession(`section`, `food`, ``) ?? [];
    const sectionArray: any[] = (sessionSection?.length > 0 ? sessionSection : []).filter((item: any) => (
      item.food_record_key !== currentItem?.food_record_key
    ));
    setSession(`section`, `food`, ``, sectionArray);

    setOBJECT((prev) => ({
      ...prev,
      food_section: prev?.food_section?.filter((_item: any, idx: number) => (idx !== index)),
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev?.newSectionCnt - 1,
    }));
  }, [OBJECT?.food_section]);

  // 4-5. handle (favorite 추가) -------------------------------------------------------------------
  const handleFoodFavorite = useCallback((index: number) => {

    const food_record_name: string = OBJECT?.food_section[index]?.food_record_name;
    const food_record_brand: string = OBJECT?.food_section[index]?.food_record_brand;
    const food_record_gram: string = OBJECT?.food_section[index]?.food_record_gram;
    const food_record_serv: string = OBJECT?.food_section[index]?.food_record_serv;
    const food_record_count: string = OBJECT?.food_section[index]?.food_record_count ?? `1`;
    const unitCount: number = Number.parseFloat(food_record_count);
    const divisor: number = Number.isFinite(unitCount) && unitCount > 0 ? unitCount : 1;

    const food_record_kcal: string = (
      Number.parseFloat(OBJECT?.food_section[index]?.food_record_kcal) / divisor
    ).toFixed(0);
    const food_record_carb: string = (
      Number.parseFloat(OBJECT?.food_section[index]?.food_record_carb) / divisor
    ).toFixed(1);
    const food_record_protein: string = (
      Number.parseFloat(OBJECT?.food_section[index]?.food_record_protein) / divisor
    ).toFixed(1);
    const food_record_fat: string = (
      Number.parseFloat(OBJECT?.food_section[index]?.food_record_fat) / divisor
    ).toFixed(1);
    const food_record_key: string = (
      `${food_record_name}_${food_record_brand}_${food_record_kcal}_${food_record_carb}_${food_record_protein}_${food_record_fat}`
    );

    return {
      food_record_key: food_record_key,
      food_record_name: food_record_name,
      food_record_brand: food_record_brand,
      food_record_gram: food_record_gram,
      food_record_serv: food_record_serv,
      food_record_count: `1`,
      food_record_kcal: food_record_kcal,
      food_record_carb: food_record_carb,
      food_record_protein: food_record_protein,
      food_record_fat: food_record_fat,
    };
  }, [OBJECT]);

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
          <Grid size={6}>
            <Input
              locked={LOCKED}
              readOnly={true}
              label={translate(`totalKcal`)}
              value={insertComma(OBJECT?.food_record_total_kcal ?? `0`)}
              startadornment={(
                <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.kcal }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                translate(`kc`)
              }
            />
          </Grid>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              readOnly={true}
              label={translate(`totalCarb`)}
              value={insertComma(OBJECT?.food_record_total_carb ?? `0`)}
              startadornment={(
                <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.carb }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                translate(`g`)
              }
            />
          </Grid>
        </Grid>

        {/** row 2 * */}
        <Grid container={true} spacing={1}>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              readOnly={true}
              label={translate(`totalProtein`)}
              value={insertComma(OBJECT?.food_record_total_protein ?? `0`)}
              startadornment={(
                <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.protein }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                translate(`g`)
              }
            />
          </Grid>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              readOnly={true}
              label={translate(`totalFat`)}
              value={insertComma(OBJECT?.food_record_total_fat ?? `0`)}
              startadornment={(
                <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.fat }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                translate(`g`)
              }
            />
          </Grid>
        </Grid>
      </Grid>
    );
    // 7-3. detail
    const detailSection = () => (
      deferredObject.food_section?.map((item, i) => (
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
                bgcolor={bgColors?.[foodArray.findIndex((f: any) => f.food_record_part === item?.food_record_part)]}
              />
              <Div className={`mt-n10px ml-15px`}>
                <Icons
                  key={`Star`}
                  name={
                  FAVORITE?.length > 0 && FAVORITE.some((item: any) => (
                    item.food_record_key === handleFoodFavorite(i).food_record_key
                  )) ? `star_on` : `star_off`
                  }
                  isIconButton={true}
                  className={`w-20px h-20px`}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    flowUpdateFavorite(handleFoodFavorite(i));
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
                value={item?.food_record_part ?? ``}
                inputRef={REFS?.[i]?.food_record_part}
                error={ERRORS?.[i]?.food_record_part}
                onChange={(e: any) => {
                  let value: string = String(e.target.value ?? ``);
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_part: value,
                    } : section
                    )),
                  }));
                }}
              >
                {foodArray.filter((part: any) => part.food_record_part !== `all`).map((part: any, idx: number) => (
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
                onFocus={() => {
                  // 편집 시작 시점의 1회당 기준 영양값을 보존 (현재 회로 나눠 per-unit 산출)
                  const baseCount: number = Number(item?.food_record_count);
                  const perUnit = (nut?: string): number => {
                    const value: number = Number(nut ?? 0);
                    return Number.isFinite(baseCount) && baseCount > 0 ? value / baseCount : value;
                  };
                  foodBaseRef.current[i] = {
                    kcal: perUnit(item?.food_record_kcal),
                    carb: perUnit(item?.food_record_carb),
                    protein: perUnit(item?.food_record_protein),
                    fat: perUnit(item?.food_record_fat),
                  };
                }}
                onChange={(e: any) => {
                  const processedValue: string | null = handleNumberInput(e.target.value, 99, 1);
                  if (processedValue === null) {
                    return;
                  }
                  // object 설정 (보존된 1회당 기준값 × 회 로 절대 재계산 → 편집 중 회 0/공백 통과에도 기준 소실 없음)
                  const base = foodBaseRef.current[i];
                  const newCount: number = Number(processedValue);
                  const canScale: boolean = !!base && Number.isFinite(newCount) && newCount > 0;
                  const scale = (unit: number, extra: string): string => {
                    const scaled: number = Math.max(0, unit * newCount);
                    return extra === `kcal` ? scaled.toFixed(0) : scaled.toFixed(1);
                  };
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_count: processedValue,
                      ...(canScale ? {
                        food_record_kcal: scale(base.kcal, `kcal`),
                        food_record_fat: scale(base.fat, `fat`),
                        food_record_carb: scale(base.carb, `carb`),
                        food_record_protein: scale(base.protein, `protein`),
                      } : {}),
                    } : section
                    )),
                  }));
                }}
              />
            </Grid>
            <Grid size={3}>
              <Input
                locked={LOCKED}
                readOnly={true}
                label={translate(`gram`)}
                value={insertComma(item?.food_record_gram ?? `0`)}
                inputRef={REFS?.[i]?.food_record_gram}
                error={ERRORS?.[i]?.food_record_gram}
                onChange={(e: any) => {
                  const processedValue: string | null = handleNumberInput(e.target.value, 999);
                  if (processedValue === null) {
                    return;
                  }
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_gram: processedValue,
                    } : section
                    )),
                  }));
                }}
              />
            </Grid>
          </Grid>

          {/** row 3 * */}
          <Grid container={true} spacing={1}>
            <Grid size={6}>
              <Input
                locked={LOCKED}
                readOnly={true}
                shrink={`shrink`}
                label={translate(`foodName`)}
                value={item?.food_record_name ?? ``}
                inputRef={REFS?.[i]?.food_record_name}
                error={ERRORS?.[i]?.food_record_name}
                onChange={(e: any) => {
                  // 빈값 처리
                  const value: string = e.target.value ?? ``;
                  // 30 제한
                  if (value?.length > 30) {
                    return;
                  }
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_name: value,
                    } : section
                    )),
                  }));
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                locked={LOCKED}
                readOnly={true}
                shrink={`shrink`}
                label={translate(`brand`)}
                value={item?.food_record_brand ?? ``}
                inputRef={REFS?.[i]?.food_record_brand}
                error={ERRORS?.[i]?.food_record_brand}
                onChange={(e: any) => {
                  // 빈값 처리
                  const value: string = e.target.value ?? ``;
                  // 30 제한
                  if (value?.length > 30) {
                    return;
                  }
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_brand: value,
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
                label={translate(`kcal`)}
                value={insertComma(item?.food_record_kcal ?? `0`)}
                inputRef={REFS?.[i]?.food_record_kcal}
                error={ERRORS?.[i]?.food_record_kcal}
                startadornment={(
                  <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.kcal }}>
                    {`●`}
                  </Div>
                )}
                endadornment={
                  translate(`kc`)
                }
                onChange={(e: any) => {
                  const processedValue: string | null = handleNumberInput(e.target.value, 9999);
                  if (processedValue === null) {
                    return;
                  }
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_kcal: processedValue,
                    } : section
                    )),
                  }));
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
                  <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.carb }}>
                    {`●`}
                  </Div>
                )}
                endadornment={
                  translate(`g`)
                }
                onChange={(e: any) => {
                  const processedValue: string | null = handleNumberInput(e.target.value, 999, 1);
                  if (processedValue === null) {
                    return;
                  }
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_carb: processedValue,
                    } : section
                    )),
                  }));
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
                  <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.protein }}>
                    {`●`}
                  </Div>
                )}
                endadornment={
                  translate(`g`)
                }
                onChange={(e: any) => {
                  const processedValue: string | null = handleNumberInput(e.target.value, 999, 1);
                  if (processedValue === null) {
                    return;
                  }
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_protein: processedValue,
                    } : section
                    )),
                  }));
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
                  <Div className={`fs-0-6rem ml-2vw`} style={{ color: chartThemeColors.fat }}>
                    {`●`}
                  </Div>
                )}
                endadornment={
                  translate(`g`)
                }
                onChange={(e: any) => {
                  const processedValue: string | null = handleNumberInput(e.target.value, 999, 1);
                  if (processedValue === null) {
                    return;
                  }
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_record_fat: processedValue,
                    } : section
                    )),
                  }));
                }}
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
