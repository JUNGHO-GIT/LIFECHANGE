// Empty.tsx

import { useCommonValue, useStoreLanguage } from "@importHooks";
import { Div, Icons } from "@importComponents";
import { Grid, Card, Accordion, AccordionSummary } from "@importMuis";

// -------------------------------------------------------------------------------------------------
declare type EmptyProps = {
  DATE: any;
  extra: string;
}

// -------------------------------------------------------------------------------------------------
export const Empty = (
  { DATE, extra }: EmptyProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, navigate } = useCommonValue();
  const { translate } = useStoreLanguage();

  const isFindList = PATH.includes("food/find/list");
  const isGoalList = !isFindList && PATH.includes("goal/list");
  const toDetail = isGoalList ? `/${extra}/goal/detail` : `/${extra}/detail`;

  // 7. emptyNode ----------------------------------------------------------------------------------
  const emptyNode = () => {
    // 1. isFindSection
    const isFindSection = () => (
      <Card className={"border-1 radius-2 shadow-0"}>
        <Accordion expanded={false}>
          <AccordionSummary>
            <Grid container={true} spacing={2}>
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-1-0rem fw-600 dark"}>
                  {translate("search")}
                </Div>
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-1-0rem fw-500"}>
                  {translate("notFound")}
                </Div>
              </Grid>
            </Grid>
          </AccordionSummary>
        </Accordion>
      </Card>
    );
    // 2. isGoalSection
    const isGoalSection = () => (
      <Card className={"border-1 radius-2 shadow-0"}>
        <Accordion expanded={false}>
          <AccordionSummary
            onClick={() => {
              navigate(toDetail, {
                state: {
                  from: PATH.includes("today") ? "today" : "list",
                  dateType: DATE?.dateType,
                  dateStart: DATE?.dateStart,
                  dateEnd: DATE?.dateEnd
                }
              });
            }}
          >
            <Grid container={true} spacing={2}>
              <Grid size={2} className={"d-row-center"}>
                <Icons
                  key={"Search"}
                  name={"Search"}
                  className={"w-18 h-18"}
                />
              </Grid>
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-1-0rem fw-600 dark"}>
                  {translate(`${extra}`)}
                </Div>
              </Grid>
              <Grid size={6} className={"d-row-left"}>
                <Div className={"fs-1-0rem fw-500"}>
                  {translate("empty")}
                </Div>
              </Grid>
            </Grid>
          </AccordionSummary>
        </Accordion>
      </Card>
    );
    // 2. isRealSection
    const isRealSection = () => (
      <Card className={"border-1 radius-2 shadow-0"}>
        <Accordion expanded={false}>
          <AccordionSummary
            onClick={() => {
              navigate(toDetail, {
                state: {
                  from: PATH.includes("today") ? "today" : "list",
                  dateType: "day",
                  dateStart: DATE?.dateStart,
                  dateEnd: DATE?.dateStart,
                }
              });
            }}
          >
            <Grid container={true} spacing={2}>
              <Grid size={2} className={"d-row-center"}>
                <Icons
                  key={"Search"}
                  name={"Search"}
                  className={"w-18 h-18"}
                />
              </Grid>
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-1-0rem fw-600 dark"}>
                  {translate(`${extra}`)}
                </Div>
              </Grid>
              <Grid size={6} className={"d-row-left"}>
                <Div className={"fs-1-0rem fw-500"}>
                  {translate("empty")}
                </Div>
              </Grid>
            </Grid>
          </AccordionSummary>
        </Accordion>
      </Card>
    );
    // 3. return
    return (
      isFindList ? (
        isFindSection()
      )
      : isGoalList ? (
        isGoalSection()
      )
      : (
        isRealSection()
      )
    );
  };

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {emptyNode()}
    </>
  );
};