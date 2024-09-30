// FoodGoalList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useStorage } from "@imports/ImportHooks";
import { FoodGoal } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportLibs";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Img, Hr, Icons } from "@imports/ImportComponents";
import { Empty, Dial } from "@imports/ImportContainers";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";
import { Paper, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt, getDayNotFmt,
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, PATH, URL_OBJECT, sessionId, TITLE, toDetail
  } = useCommonValue();

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
      // setIsExpanded([]);
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    const listSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          extra={"food"}
        />
      );
      const listFragment = (i: number) => (
        OBJECT?.map((item: any, index: number) => (
          <Card className={"border-1 radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpanded.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"ChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={() => {
                    setIsExpanded(isExpanded.includes(index)
                    ? isExpanded.filter((el) => el !== index)
                    : [...isExpanded, index]
                  )}}
                />
              }>
                <Grid container spacing={2}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.food_goal_dateType,
                      dateStart: item.food_goal_dateStart,
                      dateEnd: item.food_goal_dateEnd,
                    });
                    navigate(toDetail, {
                      state: SEND
                    });
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18 black"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    {item.food_goal_dateStart === item.food_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_goal_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food2"}
                    	src={"food2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_goal_kcal.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_goal_kcal_color}`}>
                            {numeral(item.food_goal_kcal).format("0,0")}
                          </Div>
                        ) : item.food_goal_kcal.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_goal_kcal_color}`}>
                            {numeral(item.food_goal_kcal).format("0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_goal_kcal_color}`}>
                            {numeral(item.food_goal_kcal).format("0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_total_kcal.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_total_kcal_color}`}>
                            {numeral(item.food_total_kcal).format("0,0")}
                          </Div>
                        ) : item.food_total_kcal.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_total_kcal_color}`}>
                            {numeral(item.food_total_kcal).format("0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_total_kcal_color}`}>
                            {numeral(item.food_total_kcal).format("0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_diff_kcal.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_diff_kcal_color}`}>
                            {numeral(item.food_diff_kcal).format("+0,0")}
                          </Div>
                        ) : item.food_diff_kcal.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_diff_kcal_color}`}>
                            {numeral(item.food_diff_kcal).format("+0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_diff_kcal_color}`}>
                            {numeral(item.food_diff_kcal).format("+0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 2 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food3"}
                    	src={"food3"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_goal_carb.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_goal_carb_color}`}>
                            {numeral(item.food_goal_carb).format("0,0")}
                          </Div>
                        ) : item.food_goal_carb.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_goal_carb_color}`}>
                            {numeral(item.food_goal_carb).format("0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_goal_carb_color}`}>
                            {numeral(item.food_goal_carb).format("0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_total_carb.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_total_carb_color}`}>
                            {numeral(item.food_total_carb).format("0,0")}
                          </Div>
                        ) : item.food_total_carb.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_total_carb_color}`}>
                            {numeral(item.food_total_carb).format("0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_total_carb_color}`}>
                            {numeral(item.food_total_carb).format("0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_diff_carb.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_diff_carb_color}`}>
                            {numeral(item.food_diff_carb).format("+0,0")}
                          </Div>
                        ) : item.food_diff_carb.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_diff_carb_color}`}>
                            {numeral(item.food_diff_carb).format("+0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_diff_carb_color}`}>
                            {numeral(item.food_diff_carb).format("+0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 3 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food4"}
                    	src={"food4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_goal_protein.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_goal_protein_color}`}>
                            {numeral(item.food_goal_protein).format("0,0")}
                          </Div>
                        ) : item.food_goal_protein.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_goal_protein_color}`}>
                            {numeral(item.food_goal_protein).format("0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_goal_protein_color}`}>
                            {numeral(item.food_goal_protein).format("0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_total_protein.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_total_protein_color}`}>
                            {numeral(item.food_total_protein).format("0,0")}
                          </Div>
                        ) : item.food_total_protein.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_total_protein_color}`}>
                            {numeral(item.food_total_protein).format("0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_total_protein_color}`}>
                            {numeral(item.food_total_protein).format("0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_diff_protein.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_diff_protein_color}`}>
                            {numeral(item.food_diff_protein).format("+0,0")}
                          </Div>
                        ) : item.food_diff_protein.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_diff_protein_color}`}>
                            {numeral(item.food_diff_protein).format("+0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_diff_protein_color}`}>
                            {numeral(item.food_diff_protein).format("+0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 4 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food5"}
                    	src={"food5"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_goal_fat.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_goal_fat_color}`}>
                            {numeral(item.food_goal_fat).format("0,0")}
                          </Div>
                        ) : item.food_goal_fat.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_goal_fat_color}`}>
                            {numeral(item.food_goal_fat).format("0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_goal_fat_color}`}>
                            {numeral(item.food_goal_fat).format("0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_total_fat.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_total_fat_color}`}>
                            {numeral(item.food_total_fat).format("0,0")}
                          </Div>
                        ) : item.food_total_fat.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_total_fat_color}`}>
                            {numeral(item.food_total_fat).format("0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_total_fat_color}`}>
                            {numeral(item.food_total_fat).format("0,0")}
                          </Div>
                        )}
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        {item.food_diff_fat.length > 12 ? (
                          <Div className={`fs-0-6rem fw-600 ${item.food_diff_fat_color}`}>
                            {numeral(item.food_diff_fat).format("+0,0")}
                          </Div>
                        ) : item.food_diff_fat.length > 8 ? (
                          <Div className={`fs-0-8rem fw-600 ${item.food_diff_fat_color}`}>
                            {numeral(item.food_diff_fat).format("+0,0")}
                          </Div>
                        ) : (
                          <Div className={`fs-1-0rem fw-600 ${item.food_diff_fat_color}`}>
                            {numeral(item.food_diff_fat).format("+0,0")}
                          </Div>
                        )}
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
        ))
      );
      return (
        LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : listFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius h-min75vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {listSection()}
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
      {dialNode()}
      {footerNode()}
    </>
  );
};