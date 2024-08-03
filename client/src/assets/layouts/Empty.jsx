// Empty.jsx

import {React} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {Card, Accordion, AccordionSummary, Grid} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Empty = ({
  SEND, DATE, navigate, type, extra
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();

  // 2. diffNode -----------------------------------------------------------------------------------
  const diffNode = () => (
    <Card className={"border radius shadow-none"} key={`empty-${extra}`}>
      <Accordion className={"shadow-none"} expanded={false}>
        <AccordionSummary>
          <Grid container className={"w-95p"}>
            <Grid item xs={2} className={"d-center"}>
              <Div className={"fs-1-0rem fw-600 dark"}>
                {translate(`${extra}`)}
              </Div>
            </Grid>
            <Grid item xs={10} className={"d-left"}>
              <Div className={"fs-1-0rem fw-500 black"}>
                {translate("empty")}
              </Div>
            </Grid>
          </Grid>
        </AccordionSummary>
      </Accordion>
    </Card>
  );

  // 3. goalAndRealNode ----------------------------------------------------------------------------
  const goalAndRealNode = () => (
    <Card className={"border radius shadow-none"} key={`empty-${extra}`}>
      <Accordion className={"shadow-none"} expanded={false}>
        <AccordionSummary>
          <Grid container className={"w-95p"}>
            <Grid item xs={2} className={"d-center"}>
              <Icons
                name={"TbSearch"}
                className={"w-18 h-18 black"}
                onClick={(e) => {
                  e.stopPropagation();
                  Object.assign(SEND, {
                    dateType: DATE.dateType || "day",
                    dateStart: DATE.dateStart,
                    dateEnd: DATE.dateEnd,
                  });
                  navigate(SEND.toSave, {
                    state: SEND
                  });
                }}
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
                {translate("findFood")}
              </Div>
            </Grid>
            <Grid item xs={10} className={"d-left"}>
              <Div className={"fs-1-0rem fw-500 black"}>
                {translate("empty")}
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
      {type === "diff" && diffNode()}
      {(type === "goal" || type === "real") && goalAndRealNode()}
      {type === "find" && findNode()}
    </>
  );
};