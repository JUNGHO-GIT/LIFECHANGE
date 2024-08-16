// Empty.jsx

import {React} from "../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../import/ImportHooks.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {Card, Accordion, AccordionSummary, Grid} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Empty = ({
  SEND, DATE, navigate, type, extra
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();
  const navigateStr = (
    type === "goal" ? `/${extra}/goal/save` :
    type === "real" ? `/${extra}/save` :
    null
  );

  // 2. goalAndRealNode ---------------------------------------------------------------------------
  const goalAndRealNode = () => (
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
            <Grid item xs={2} className={"d-center"}>
              <Icons
                name={"TbSearch"}
                className={"w-18 h-18 black"}
                onClick={() => {}}
              />
            </Grid>
            <Grid item xs={2} className={"d-left"}>
              <Div className={"fs-1-0rem fw-600 dark"}>
                {translate(`${extra}`)}
              </Div>
            </Grid>
            <Grid item xs={8} className={"d-left"}>
              <Div className={"fs-1-0rem fw-500 black"}>
                {translate("empty")}
              </Div>
            </Grid>
          </Grid>
        </AccordionSummary>
      </Accordion>
    </Card>
  );

  // 4. findNode -----------------------------------------------------------------------------------
  const findNode = () => (
    <Card className={"border radius shadow-none"} key={`empty-${extra}`}>
      <Accordion className={"shadow-none"} expanded={false}>
        <AccordionSummary>
          <Grid container className={"w-95p"}>
            <Grid item xs={2} className={"d-center"}>
              <Div className={"fs-1-0rem fw-600 dark"}>
                {translate("search")}
              </Div>
            </Grid>
            <Grid item xs={10} className={"d-left"}>
              <Div className={"fs-1-0rem fw-500 black"}>
                {translate("notFound")}
              </Div>
            </Grid>
          </Grid>
        </AccordionSummary>
      </Accordion>
    </Card>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {type === "find" ? findNode() : goalAndRealNode()}
    </>
  );
};