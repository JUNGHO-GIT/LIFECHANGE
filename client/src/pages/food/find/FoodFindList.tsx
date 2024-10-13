// FoodFindList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useStorageSession, useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { FoodFind } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Hr, Img, Icons } from "@imports/ImportComponents";
import { Paper, Card, Checkbox, Grid } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodFindList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, TITLE, localIsoCode } = useCommonValue();
  const { location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();

  // 2-1. useStorageSession ------------------------------------------------------------------------
  const [PAGING, setPAGING] = useStorageSession(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      query: "",
      page: 0,
    }
  );

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useStorageLocal(
    `${TITLE}_isExpanded_(${PATH})`, [{
      expanded: true
    }]
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>([FoodFind]);
  const [checkedQueries, setCheckedQueries] = useState<any>({});
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "day",
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
  // 페이지 번호 변경 시 flowFind 호출
  useEffect(() => {
    if (PAGING?.query === "") {
      return;
    }
    flowFind();
  }, [PAGING.page]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 페이지 로드 시 체크박스 상태 초기화
  useEffect(() => {
    let sectionArray = [];
    let section = sessionStorage.getItem(`${TITLE}_foodSection`);

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }

    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const newChecked = OBJECT.map((item: any) => (
      sectionArray.some((sectionItem: any) => (
        sectionItem.food_key === item.food_key
      ))
    ));
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: newChecked
    });
  }, [OBJECT]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowFind = async () => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/find/list`, {
      params: {
        PAGING: PAGING,
        isoCode: localIsoCode,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result.length > 0 ? res.data.result : []);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
      }));
      // Accordion 초기값 설정
      // 이전 값이 있으면 유지하고 없으면 true로 설정
      setIsExpanded((prev: any) => (
        Array(res.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.[i]?.expanded ?? true
        }))
      ));
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

  // 4. handle------------------------------------------------------------------------------------
  // 체크박스 변경 시
  const handleCheckboxChange = (index: number) => {
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const updatedChecked = [...(checkedQueries[queryKey] || [])];
    updatedChecked[index] = !updatedChecked[index];

    setCheckedQueries((prev: any) => ({
      ...prev,
      [queryKey]: updatedChecked,
    }));

    // sessionStorage 업데이트
    let sectionArray = [];
    const section = sessionStorage.getItem(`${TITLE}_foodSection`);

    if (section) {
      sectionArray = JSON.parse(section);
    }

    const item = OBJECT[index];
    const newItem = {
      food_perNumber: item.food_perNumber,
      food_part_idx: item.food_part_idx,
      food_part_val: item.food_part_val,
      food_key: item.food_key,
      food_query: item.food_query,
      food_name: item.food_name,
      food_brand: item.food_brand,
      food_gram: item.food_gram,
      food_serv: item.food_serv,
      food_count: item.food_count,
      food_kcal: item.food_kcal,
      food_carb: item.food_carb,
      food_protein: item.food_protein,
      food_fat: item.food_fat,
    };

    if (updatedChecked[index]) {
      if (!sectionArray.some((i: any) => i.food_key === item.food_key)) {
        sectionArray.push(newItem);
      }
    }
    else {
      sectionArray = sectionArray.filter((i: any) => (
        i.food_key !== item.food_key
      ));
    }

    sessionStorage.setItem(`${TITLE}_foodSection`, JSON.stringify(sectionArray));
  };

  // 7. find ---------------------------------------------------------------------------------------
  const findNode = () => {
    const listSection = () => {
      const listFragment = (item: any, i: number) => (
        <Card className={"border-1 radius-1"}>
          <Accordion className={"shadow-0"} expanded={isExpanded[i].expanded}>
            <AccordionSummary className={"me-n10"} expandIcon={
              <Icons
                key={"ChevronDown"}
                name={"ChevronDown"}
                className={"w-18 h-18"}
                onClick={() => {
                  setIsExpanded(isExpanded.map((el: any, index: number) => (
                    i === index ? {
                      expanded: !el.expanded
                    } : el
                  )));
                }}
              />
            }>
              <Grid container spacing={1} columns={12} onClick={() => {
                handleCheckboxChange(i);
              }}>
                <Grid size={2} className={"d-row-center"}>
                  <Checkbox
                    key={`check-${i}`}
                    color={"primary"}
                    size={"small"}
                    checked={
                      !! (
                        checkedQueries[`${item.food_query}_${PAGING.page}`] &&
                        checkedQueries[`${item.food_query}_${PAGING.page}`][i]
                      )
                    }
                    onChange={() => {
                      handleCheckboxChange(i);
                    }}
                  />
                </Grid>
                <Grid size={6} className={"d-row-left"}>
                  <Div className={`${item.food_name_color}`}>
                    {item.food_name}
                  </Div>
                </Grid>
                <Grid size={4} className={"d-row-right"}>
                  <Div className={`${item.food_brand_color}`}>
                    <Div className={`fs-0-8rem fw-500 dark me-10`}>
                      {item.food_brand}
                    </Div>
                  </Div>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} columns={12}>
                {/** row 1 **/}
                <Grid size={2} className={"d-row-center"}>
                  <Img
                    key={"food2"}
                    src={"food2"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("kcal")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    <Grid size={10} className={"d-row-right"}>
                      <Div className={`${item.food_kcal_color}`}>
                        {numeral(item.food_kcal).format("0,0")}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate("kc")}
                      </Div>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={10} />
                {/** row 2 **/}
                <Grid size={2} className={"d-center"}>
                  <Img
                    key={"food3"}
                    src={"food3"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("carb")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    <Grid size={10} className={"d-row-right"}>
                      <Div className={`${item.food_carb_color}`}>
                        {item.food_carb}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate("g")}
                      </Div>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={10} />
                {/** row 3 **/}
                <Grid size={2} className={"d-center"}>
                  <Img
                    key={"food4"}
                    src={"food4"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("protein")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    <Grid size={10} className={"d-row-right"}>
                      <Div className={`${item.food_protein_color}`}>
                        {item.food_protein}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate("g")}
                      </Div>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={10} />
                {/** row 3 **/}
                <Grid size={2} className={"d-center"}>
                  <Img
                    key={"food5"}
                    src={"food5"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("fat")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    <Grid size={10} className={"d-row-right"}>
                      <Div className={`${item.food_fat_color}`}>
                        {item.food_fat}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate("g")}
                      </Div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            {OBJECT?.map((item: any, i: number) => (
              <Grid size={12} key={`list-${i}`}>
                {COUNT.totalCnt === 0 ? (
                  <Empty extra={"food"} />
                ) : (
                  listFragment(item, i)
                )}
              </Grid>
            ))}
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-column-center"}>
            {LOADING ? <Loading /> : listSection()}
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
      setIsExpanded={setIsExpanded}
    />
  );

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, PAGING, COUNT,
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT,
      }}
      flow={{
        flowFind
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {findNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
};