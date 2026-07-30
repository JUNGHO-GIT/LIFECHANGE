/**
 * @file SleepRecordDetail.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { React, useState, useEffect, useRef, useCallback, useDeferredValue, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useTime, useValidateSleep } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { SleepRecord, SleepRecordType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { sync, getSession, setSession } from "@exportScripts";
import { Footer, Dialog } from "@exportLayouts";
import { PickerDay, PickerTime, Count, Delete } from "@exportContainers";
import { Icons, Bg, Div, Paper, Grid, Br } from "@exportComponents";

// -------------------------------------------------------------------------------------------------
export const SleepRecordDetail = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, PATH, sessionId, navigate, toList,
    location_dateStart, location_dateEnd,
  } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();
  const { ERRORS, REFS, validate } = useValidateSleep();

  // 2-2. useState -------------------------------------------------------------------------------
  const [ LOCKED, setLOCKED ] = useState<string>(`unlocked`);
  const [ OBJECT, setOBJECT ] = useState<SleepRecordType>(SleepRecord);
  const [ FAVORITE, setFAVORITE ] = useState<any[]>([]);
  const [ EXIST, setEXIST ] = useState({
    day: [``],
    week: [``],
    month: [``],
    year: [``],
    select: [``],
  });
  const [ FLOW, setFLOW ] = useState({
    theme: `sleep`,
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
    SleepRecordType
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
    if (EXIST?.[DATE?.dateType as keyof typeof EXIST]?.length <= 0) {
      return;
    }
    const dateRange: string = (
      `${DATE?.dateStart.trim()} - ${DATE?.dateEnd.trim()}`
    );
    const objectRange: string = (
      `${OBJECT.sleep_record_dateStart.trim()} - ${OBJECT.sleep_record_dateEnd.trim()}`
    );
    const isExist: boolean = (
      EXIST?.[DATE?.dateType as keyof typeof EXIST]?.includes(dateRange)
    );
    const itsMe: boolean = (
      dateRange === objectRange
    );
    const itsNew: boolean = (
      OBJECT.sleep_record_dateStart === `0000-00-00` &&
			OBJECT.sleep_record_dateEnd === `0000-00-00`
    );

    setFLOW((prev) => ({
      ...prev,
      exist: isExist,
      itsMe: itsMe,
      itsNew: itsNew,
    }));
  }, [ EXIST, DATE?.dateEnd, OBJECT.sleep_record_dateEnd ]);

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
      setOBJECT(res.data.result ?? SleepRecord);

      // sectionCnt가 0이면 section 초기화
      if (res.data.sectionCnt <= 0) {
        setOBJECT((prev) => ({
          ...prev,
          sleep_section: [],
        }));
      }
      // sectionCnt가 0이 아니면 section 내부 part 값에 따라 재정렬
      else {
        setOBJECT((prev) => ({
          ...prev,
          sleep_section: prev.sleep_section,
        }));
      }
      // count 설정
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ?? 0,
        sectionCnt: res.data.sectionCnt ?? 0,
        newSectionCnt: res.data.sectionCnt ?? 0,
      }));

      const sessionSection: any = getSession(`section`, `sleep`, ``) ?? [];
      const sectionArray: any[] = Array.isArray(sessionSection) ? sessionSection : [];

      setOBJECT((prev) => ({
        ...prev,
        sleep_section: [
          ...(prev.sleep_section ?? []),
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
    const defaultSection: any = {
      sleep_record_key: ``,
      sleep_record_bedTime: `00:00`,
      sleep_record_wakeTime: `00:00`,
      sleep_record_sleepTime: `00:00`,
    };
    const updatedSection: any[] = Array.from({ length: COUNT?.newSectionCnt }).fill(null).map((_item: any, idx: number) => {
      return idx < OBJECT?.sleep_section?.length ? OBJECT?.sleep_section[idx] : defaultSection;
    });
    setOBJECT((prev: any) => ({
      ...prev,
      sleep_section: updatedSection,
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
			res.data.status === `success` ? (() => {
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
			  void sync();
			})() : (() => {
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
  };

  // 3. flow ------------------------------------------------------------------------------------
  const flowDelete = async () => {
    setLOADING(true);
    if (!await validate(objectRef.current, countRef.current, `delete`)) {
      setLOADING(false);
      return;
    }
    axios.delete(`${URL_OBJECT}/record/delete`, {
      data: {
        user_id: sessionId,
        DATE: dateRef.current,
      },
    })
    .then((res: any) => {
			res.data.status === `success` ? (() => {
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
			  void sync();
			})() : (() => {
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

  // 4-3. handle --------------------------------------------------------------------------------
  const handleDelete = useCallback((index: number) => {
    const currentItem: any = OBJECT?.sleep_section?.[index];
    const currentKey: string = currentItem?.sleep_record_key ?? (
      `${currentItem?.sleep_record_bedTime ?? `00:00`}_${currentItem?.sleep_record_wakeTime ?? `00:00`}_${currentItem?.sleep_record_sleepTime ?? `00:00`}`
    );
    const sessionSection: any = getSession(`section`, `sleep`, ``) ?? [];

    if (currentKey !== `` && Array.isArray(sessionSection)) {
      setSession(`section`, `sleep`, ``, sessionSection.filter((item: any) => (
        item.sleep_record_key !== currentKey
      )));
    }

    setOBJECT((prev) => ({
      ...prev,
      sleep_section: prev.sleep_section?.filter((_item: any, idx: number) => (idx !== index)),
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  }, [ OBJECT?.sleep_section ]);

  // 4-4. handle --------------------------------------------------------------------------------
  const handleSleepFavorite = useCallback((item: any) => {
    const sleep_record_bedTime: string = item?.sleep_record_bedTime ?? `00:00`;
    const sleep_record_wakeTime: string = item?.sleep_record_wakeTime ?? `00:00`;
    const sleep_record_sleepTime: string = item?.sleep_record_sleepTime ?? `00:00`;
    const sleep_record_key: string = (
      `${sleep_record_bedTime}_${sleep_record_wakeTime}_${sleep_record_sleepTime}`
    );

    return {
      sleep_record_key: sleep_record_key,
      sleep_record_bedTime: sleep_record_bedTime,
      sleep_record_wakeTime: sleep_record_wakeTime,
      sleep_record_sleepTime: sleep_record_sleepTime,
    };
  }, []);

  // 7. save --------------------------------------------------------------------------------------
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
    // 7-3. detail
    const detailSection = () => (
      <>
        {deferredObject.sleep_section?.map((item, i) => (
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
                  bgcolor={`#0876b9`}
                />
                <Div className={`mt-n10px ml-15px`}>
                  <Icons
                    key={`Star`}
                    name={
                      FAVORITE?.length > 0 && FAVORITE.some((favorite: any) => (
                        favorite.sleep_record_key === handleSleepFavorite(item).sleep_record_key
                      )) ? `star_on` : `star_off`
                    }
                    isIconButton={true}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      flowUpdateFavorite(handleSleepFavorite(item));
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
      <Paper className={`content-wrapper radius-2 border-light-1 shadow-1 h-min-75vh`}>
        {dateCountSection()}
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
