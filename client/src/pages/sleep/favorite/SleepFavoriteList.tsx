/**
 * @file SleepFavoriteList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { axios } from "@exportLibs";
import { setSession, getSession, sync } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Icons, Paper, Grid } from "@exportComponents";
import { Checkbox, Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const SleepFavoriteList = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, PATH, sessionId,
    location_dateType, location_dateStart, location_dateEnd,
  } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  const recordKey: string = `sleep_record_key`;

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ PAGING, setPAGING ] = useStorageLocal(
    `paging`, PATH, ``, {
      sort: `asc`,
      query: `favorite`,
      page: 0,
    }
  );
  const [ isExpanded, setIsExpanded ] = useStorageLocal(
    `isExpanded`, PATH, ``, [
      {
        expanded: true,
      },
    ]
  );

  // 2-2. useState -------------------------------------------------------------------------------
  const [ OBJECT, setOBJECT ] = useState<any[]>([]);
  const [ checkedQueries, setCheckedQueries ] = useState<Record<string, boolean[]>>({});
  const [ SEND, setSEND ] = useState({
    id: ``,
    dateType: `day`,
    dateStart: `0000-00-00`,
    dateEnd: `0000-00-00`,
  });
  const [ COUNT, setCOUNT ] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0,
  });
  const [ DATE, setDATE ] = useState({
    dateType: location_dateType ?? `day`,
    dateStart: location_dateStart ?? getDayFmt(),
    dateEnd: location_dateEnd ?? getDayFmt(),
  });

  // 2-2. useDeferredValue ----------------------------------------------------------------------
  const deferredObject = useDeferredValue(OBJECT);

  // 2-3. expanded 상태 -------------------------------------------------------------------------
  const normalizeExpanded = (items: any[], current: any[]): any[] => {
    const expandedMap = new Map<string, boolean>(
      (current ?? [])
      .filter((item: any) => typeof item?.[recordKey] === `string`)
      .map((item: any) => [ item[recordKey], item.expanded ?? true ])
    );

    return items.map((item: any, index: number) => ({
      [recordKey]: item[recordKey],
      expanded: expandedMap.get(item[recordKey]) ?? current?.[index]?.expanded ?? true,
    }));
  };

  // 2-3. useEffect ------------------------------------------------------------------------------
  useEffect(() => {
    void flowFind();
  }, [PAGING.page]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    const section: any = getSession(`section`, `sleep`, ``) ?? [];
    const sectionArray: any[] = section?.length > 0 ? section : [];
    const queryKey: string = `${PAGING.query}_${PAGING.page}`;
    const newChecked: boolean[] = OBJECT.map((item: any) => (
      sectionArray.some((sectionItem: any) => (
        sectionItem[recordKey] === item[recordKey]
      ))
    ));

    setCheckedQueries((prev) => ({
      ...prev,
      [queryKey]: newChecked,
    }));
  }, [OBJECT, PAGING.query, PAGING.page]);

  // 3. flow ------------------------------------------------------------------------------------
  async function flowFind() {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/favorite/list`, {
      params: {
        user_id: sessionId,
      },
    })
    .then((res: any) => {
      setLOADING(false);
      const result: any[] = res.data.result?.length > 0 ? res.data.result : [];
      setOBJECT(result);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ?? 0,
      }));
      setIsExpanded((prev: any[]) => normalizeExpanded(result, prev ?? []));
    })
    .catch((error: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response?.data?.msg ?? `searchError`),
        severity: `error`,
      });
      console.error(error);
    })
    .finally(() => {
      setLOADING(false);
    });
  }

  // 3. flow ------------------------------------------------------------------------------------
  const flowUpdateFavorite = (favorite: any) => {
    axios.put(`${URL_OBJECT}/favorite/update`, {
      user_id: sessionId,
      favorite: favorite,
    })
    .then((res: any) => {
      if (res.data.status === `success`) {
        setLOADING(false);
        setOBJECT(res.data.result?.length > 0 ? res.data.result : []);
        void flowFind();
        void sync(`favorite`);
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
        msg: translate(error.response?.data?.msg ?? `searchError`),
        severity: `error`,
      });
      console.error(error);
    });
  };

  // 4. handle ---------------------------------------------------------------------------------
  const handleCheckboxChange = (index: number) => {
    const queryKey: string = `${PAGING.query}_${PAGING.page}`;
    const updatedChecked: boolean[] = [...(checkedQueries[queryKey] ?? [])];
    updatedChecked[index] = !updatedChecked[index];

    setCheckedQueries((prev) => ({
      ...prev,
      [queryKey]: updatedChecked,
    }));

    const currentSection: any = getSession(`section`, `sleep`, ``) ?? [];
    let sectionArray: any[] = currentSection?.length > 0 ? [...currentSection] : [];
    const item: any = OBJECT[index];

    if (updatedChecked[index]) {
      if (!sectionArray.some((sectionItem: any) => sectionItem[recordKey] === item[recordKey])) {
        sectionArray.push(item);
      }
    }
    else {
      sectionArray = sectionArray.filter((sectionItem: any) => (
        sectionItem[recordKey] !== item[recordKey]
      ));
    }

    setSession(`section`, `sleep`, ``, sectionArray);
  };

  // 5. format ---------------------------------------------------------------------------------
  const renderPrimaryText = (item: any): string => (
    `${item.sleep_record_bedTime} - ${item.sleep_record_wakeTime}`
  );

  const renderSecondaryText = (item: any): string => (
    item.sleep_record_sleepTime ?? `00:00`
  );

  // 7. favorite --------------------------------------------------------------------------------
  const favoriteNode = () => {
    const listSection = () => (
      deferredObject?.map((item, i) => (
        <Grid container={true} spacing={0} key={item[recordKey] ?? `sleep-${i}`}>
          <Grid size={12} className={`accordion radius-3 border-light-1 shadow-1 mb-10px`}>
            <Accordion className={`radius-3 border-0 shadow-0`} expanded={isExpanded?.[i]?.expanded ?? true}>
              <AccordionSummary
                expandIcon={(
                  <Icons
                    key={`ChevronDown`}
                    name={`ChevronDown`}
                    isIconButton={true}
                    className={`w-16px h-16px`}
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsExpanded((prev: any[]) => (
                        normalizeExpanded(OBJECT, prev ?? []).map((item: any, index: number) => (
                          index === i ? { ...item, expanded: !item.expanded } : item
                        ))
                      ));
                    }}
                  />
                )}
              >
                <Grid container={true} spacing={1}>
                  <Grid size={2} className={`d-row-center`}>
                    <Checkbox
                      key={`check-${item[recordKey]}`}
                      color={`primary`}
                      size={`small`}
                      checked={
                        !!(
                          checkedQueries[`${PAGING.query}_${PAGING.page}`] &&
                          checkedQueries[`${PAGING.query}_${PAGING.page}`]?.[i]
                        )
                      }
                      onChange={(e: any) => {
                        e.stopPropagation();
                        handleCheckboxChange(i);
                      }}
                    />
                  </Grid>
                  <Grid size={7} className={`d-row-left`}>
                    <Div className={`fs-0-8rem fw-600`}>
                      {renderPrimaryText(item)}
                    </Div>
                    <Div className={`mt-n3px ml-5px`}>
                      <Icons
                        key={`star_on`}
                        name={`star_on`}
                        isIconButton={true}
                        className={`w-20px h-20px`}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          flowUpdateFavorite(item);
                        }}
                      />
                    </Div>
                  </Grid>
                  <Grid size={3} className={`d-row-right`}>
                    <Div className={`fs-0-75rem fw-600 dark`}>
                      {renderSecondaryText(item)}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container={true} spacing={1} className={`legend`}>
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: `#0876b9` }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`favorite`)}
                      </Div>
                    </Grid>
                    <Grid size={7} className={`d-row-right`}>
                      <Div className={`fs-0-8rem fw-600`}>
                        {renderPrimaryText(item)}
                      </Div>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      ))
    );

    return (
      <Paper className={`content-wrapper radius-2 border-light-1 shadow-1 h-min-75vh`}>
        {COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={`sleep`} /> : listSection()}
      </Paper>
    );
  };

  // 8. dialog ----------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      setIsExpanded={setIsExpanded}
    />
  );

  // 9. footer ----------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, PAGING, COUNT,
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT,
      }}
      flow={{
        flowFind,
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {favoriteNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});
