// FoodGoalList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorage } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { FoodGoal } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Img, Hr, Icons } from "@imports/ImportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";
import { Paper, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, TITLE, PATH, sessionId, toDetail } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { dayFmt, getDayNotFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: location_dateType || "",
      dateStart: location_dateStart || dayFmt,
      dateEnd: location_dateEnd || dayFmt,
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useState<number[]>([0]);
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>([FoodGoal]);
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

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/goal/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result.length > 0 ? res.data.result : [FoodGoal]);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
      // Accordion 초기값 설정
      setIsExpanded(res.data.result.map((_item: any, index: number) => index));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    const listSection = () => {
      const emptyFragment = () => (
        <Empty
          SEND={SEND}
          extra={"food"}
        />
      );
      const listFragment = (i: number) => (
        OBJECT?.map((item: any, index: number) => (
          <Card className={"border-1 radius-1"} key={`${index}-${i}`}>
            <Accordion className={"shadow-0"} expanded={isExpanded.includes(index)}>
              <AccordionSummary
                className={"me-n10"}
                expandIcon={
                  <Icons
                    key={"ChevronDown"}
                    name={"ChevronDown"}
                    className={"w-18 h-18"}
                    onClick={() => {
                      setIsExpanded(isExpanded.includes(index)
                      ? isExpanded.filter((el: number) => el !== index)
                      : [...isExpanded, index]
                    )}}
                  />
                }
              >
                <Grid
                  container={true}
                  spacing={2}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    navigate(toDetail, {
                      state: {
                        id: item._id,
                        dateType: item.food_goal_dateType,
                        dateStart: item.food_goal_dateStart,
                        dateEnd: item.food_goal_dateEnd,
                      }
                    });
                  }}
                >
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.food_goal_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
                    </Div>
                    <Div className={"fs-1-0rem fw-500 dark ms-10 me-10"}>
                      ~
                    </Div>
                    <Div className={"fs-1-1rem fw-600 black me-5"}>
                      {item.food_goal_dateEnd?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.food_goal_dateEnd).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} columns={12}>
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
                    <Grid container spacing={2} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_goal_kcal_color}`}>
                          {numeral(item.food_goal_kcal).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_total_kcal_color}`}>
                          {numeral(item.food_total_kcal).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_diff_kcal_color}`}>
                          {numeral(item.food_diff_kcal).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={1} />
                  {/** row 2 **/}
                  <Grid size={2} className={"d-row-center"}>
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
                    <Grid container spacing={2} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_goal_carb_color}`}>
                          {numeral(item.food_goal_carb).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_total_carb_color}`}>
                          {numeral(item.food_total_carb).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_diff_carb_color}`}>
                          {numeral(item.food_diff_carb).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={1} />
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
                    <Grid container spacing={2} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_goal_protein_color}`}>
                          {numeral(item.food_goal_protein).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_total_protein_color}`}>
                          {numeral(item.food_total_protein).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_diff_protein_color}`}>
                          {numeral(item.food_diff_protein).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={1} />
                  {/** row 4 **/}
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
                    <Grid container spacing={2} columns={12}>
                      {/** goal **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_goal_fat_color}`}>
                          {numeral(item.food_goal_fat).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_total_fat_color}`}>
                          {numeral(item.food_total_fat).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={3} className={"d-row-right"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={7} className={"d-row-right"}>
                        <Div className={`${item.food_diff_fat_color}`}>
                          {numeral(item.food_diff_fat).format("+0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
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
        ))
      );
      return (
        COUNT.totalCnt === 0 ? emptyFragment() : listFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 h-min75vh"}>
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            {!LOADING ? listSection() : <Loading />}
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
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
  );

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, PAGING, COUNT
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT
      }}
      flow={{
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
};