// Empty.tsx

import { useTranslate, useCommonValue } from "@imports/ImportHooks";
import { Div, Icons } from "@imports/ImportComponents";
import { Card, Accordion, AccordionSummary, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface EmptyProps {
  SEND: any;
  DATE: any;
  extra: string;
}

// -------------------------------------------------------------------------------------------------
export const Empty = (
  { SEND, DATE, extra }: EmptyProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();
  const {
    PATH, navigate
  } = useCommonValue();

  const isFindList = PATH.includes("food/find/list");
  const isGoalList = !isFindList && PATH.includes("goal/list");
  const isList = !isFindList && !isGoalList && PATH.includes("list");
  const toDetail = isGoalList ? `/${extra}/goal/detail` : `/${extra}/detail`;

  // 7. emptyNode ----------------------------------------------------------------------------------
  const emptyNode = () => {
    // 1. isFindSection
    const isFindSection = () => (
      <Card className={"border-1 radius"} key={`empty-${extra}`}>
        <Accordion className={"shadow-none"} expanded={false}>
          <AccordionSummary>
            <Grid container spacing={2}>
              <Grid size={2} className={"d-center"}>
                <Div className={"fs-1-0rem fw-600 dark"}>
                  {translate("search")}
                </Div>
              </Grid>
              <Grid size={10} className={"d-left"}>
                <Div className={"fs-1-0rem fw-500 black"}>
                  {translate("notFound")}
                </Div>
              </Grid>
            </Grid>
          </AccordionSummary>
        </Accordion>
      </Card>
    );
    // 2. nonFindSection
    const nonFindSection = () => (
      <Card className={"border-1 radius"} key={`empty`}>
        <Accordion className={"shadow-none"} expanded={false}>
          <AccordionSummary>
            <Grid container spacing={1}
              onClick={(e: any) => {
                e.stopPropagation();
                Object.assign(SEND, {
                  dateType: DATE.dateType,
                  dateStart: DATE.dateStart,
                  dateEnd: DATE.dateEnd,
                });
                navigate(toDetail, {
                  state: SEND
                });
              }}
            >
              <Grid size={2} className={"d-center"}>
                <Icons
                  name={"Search"}
                  className={"w-18 h-18 black"}
                />
              </Grid>
              <Grid size={2} className={"d-left"}>
                <Div className={"fs-0-9rem fw-600 dark"}>
                  {translate(`${extra}`)}
                </Div>
              </Grid>
              <Grid size={8} className={"d-left"}>
                <Div className={"fs-1-0rem fw-500 black"}>
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
      ) : (
        nonFindSection()
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