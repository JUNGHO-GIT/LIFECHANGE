// Empty.tsx

import { useTranslate } from "@imports/ImportHooks";
import { Div, Icons } from "@imports/ImportComponents";
import { Card, Accordion, AccordionSummary, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface EmptyProps {
  SEND: any;
  DATE: any;
  navigate: any;
  type: string;
  extra: string;
}

// -------------------------------------------------------------------------------------------------
export const Empty = (
  { SEND, DATE, navigate, type, extra }: EmptyProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();

  // 3. navigateStr --------------------------------------------------------------------------------
  const navigateStr = (
    type === "goal" ? `/${extra}/goal/detail` :
    type === "real" ? `/${extra}/detail` :
    null
  );

  // 7. emptyNode ----------------------------------------------------------------------------------
  const emptyNode = () => {
    // 1. isFindSection
    const isFindSection = () => (
      <Card className={"border radius"} key={`empty-${extra}`}>
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
      <Card className={"border radius"} key={`empty-${extra}`}>
        <Accordion className={"shadow-none"} expanded={false}>
          <AccordionSummary>
            <Grid container spacing={1}
              onClick={(e: any) => {
                e.stopPropagation();
                Object.assign(SEND, {
                  dateType: DATE.dateType || "day",
                  dateStart: DATE.dateStart,
                  dateEnd: DATE.dateEnd,
                });
                navigate(navigateStr, {
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
      <>
        {type === "find" ? isFindSection() : nonFindSection()}
      </>
    );
  };

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {emptyNode()}
    </>
  );
};