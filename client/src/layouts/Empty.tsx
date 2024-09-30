// Empty.tsx

import { useTranslate, useCommonValue } from "@imports/ImportHooks";
import { Div, Icons } from "@imports/ImportComponents";
import { Card, Accordion, AccordionSummary, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface EmptyProps {
  SEND: any;
  extra: string;
}

// -------------------------------------------------------------------------------------------------
export const Empty = (
  { SEND, extra }: EmptyProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH, navigate
  } = useCommonValue();
  const {
    translate
  } = useTranslate();

  const isFindList = PATH.includes("food/find/list");
  const isGoalList = !isFindList && PATH.includes("goal/list");
  const toDetail = isGoalList ? `/${extra}/goal/detail` : `/${extra}/detail`;

  // 7. emptyNode ----------------------------------------------------------------------------------
  const emptyNode = () => {
    // 1. isFindSection
    const isFindSection = () => (
      <Card className={"border-1 radius-1"} key={`empty-${extra}`}>
        <Accordion className={"shadow-none"} expanded={false}>
          <AccordionSummary>
            <Grid container spacing={2}>
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
    // 2. nonFindSection
    const nonFindSection = () => (
      <Card className={"border-1 radius-1"} key={`empty-${extra}`}>
        <Accordion className={"shadow-none"} expanded={false}>
          <AccordionSummary>
            <Grid
              container={true}
              spacing={2}
              onClick={(e: any) => {
                e.stopPropagation();
                Object.assign(SEND, {
                  dateType: "",
                  dateStart: "",
                  dateEnd: "",
                });
                navigate(toDetail, {
                  state: SEND
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
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-0-9rem fw-600 dark"}>
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
      isFindList ? isFindSection() : nonFindSection()
    );
  };

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {emptyNode()}
    </>
  );
};