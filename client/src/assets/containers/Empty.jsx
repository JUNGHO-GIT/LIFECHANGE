// Empty.jsx

import { useCommon } from "../../imports/ImportHooks.jsx";
import { Div, Icons } from "../../imports/ImportComponents.jsx";
import { Card, Accordion, AccordionSummary, Grid } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Empty = ({
  SEND, DATE, navigate, type, extra
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useCommon();

  // 3. navigateStr --------------------------------------------------------------------------------
  const navigateStr = (
    type === "goal" ? `/${extra}/goal/save` :
    type === "real" ? `/${extra}/save` :
    null
  );

  // 7. emptyNode ----------------------------------------------------------------------------------
  const emptyNode = () => {
    // 1. isFindSection
    const isFindSection = () => (
      <Card className={"border radius shadow-none"} key={`empty-${extra}`}>
        <Accordion className={"shadow-none"} expanded={false}>
          <AccordionSummary>
            <Grid container className={"w-95p"}>
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
      <Card className={"border radius shadow-none"} key={`empty-${extra}`}>
        <Accordion className={"shadow-none"} expanded={false}>
          <AccordionSummary>
            <Grid container className={"w-95p"}
              onClick={(e) => {
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
                  name={"TbSearch"}
                  className={"w-18 h-18 black"}
                  onClick={() => {}}
                />
              </Grid>
              <Grid size={3} className={"d-left"}>
                <Div className={"fs-0-9rem fw-600 dark"}>
                  {translate(`${extra}`)}
                </Div>
              </Grid>
              <Grid size={7} className={"d-left"}>
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