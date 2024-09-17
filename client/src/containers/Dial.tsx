// Dial.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { Div, Icons } from "@imports/ImportComponents";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Backdrop } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface DialProps {
  isExpanded: any;
  setIsExpanded: any;
  totalCnt: number;
}

// -------------------------------------------------------------------------------------------------
export const Dial = ( { isExpanded, setIsExpanded, totalCnt }: DialProps ) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt
  } = useCommonDate();
  const {
    navigate, toDetail, PATH
  } = useCommonValue();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [open, setOpen] = useState(false);
  const isGoal = PATH.includes("/goal");

  // 7. dial ---------------------------------------------------------------------------------------
  const dialNode = () => {
    const isTodaySection = () => (
      <Div className={"p-fixed bottom-17vh right-2vw z-600"}>
        <Backdrop
          open={open}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={"speedDial"}
          direction={"up"}
          open={open}
          icon={<SpeedDialIcon />}
          onClick={() => {
            setOpen(!open);
          }}
          FabProps={{
            size: "small"
          }}
        >
          <SpeedDialAction
            key={translate("openAll")}
            tooltipTitle={translate("openAll")}
            icon={<Icons
              key={"ChevronDown"}
              name={"ChevronDown"}
              className={"w-25 h-25"}
            />}
            onClick={() => {
              setIsExpanded({
                exercise: Array.from({ length: totalCnt }).map((_, i) => i),
                food: Array.from({ length: totalCnt }).map((_, i) => i),
                money: Array.from({ length: totalCnt }).map((_, i) => i),
                sleep: Array.from({ length: totalCnt }).map((_, i) => i),
              });
              window.scrollTo(0, 0);
            }}
          />
          <SpeedDialAction
            key={translate("closeAll")}
            tooltipTitle={translate("closeAll")}
            icon={<Icons
              key={"ChevronUp"}
              name={"ChevronUp"}
              className={"w-25 h-25"}
            />}
            onClick={() => {
              setIsExpanded({
                exercise: [],
                food: [],
                money: [],
                sleep: [],
              });
              window.scrollTo(0, 0);
            }}
          />
        </SpeedDial>
      </Div>
    );
    const isNotTodaySection = () => (
      <Div className={"p-fixed bottom-17vh right-2vw z-600"}>
        <Backdrop
          open={open}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={"speedDial"}
          direction={"up"}
          open={open}
          icon={<SpeedDialIcon />}
          onClick={() => {
            setOpen(!open);
          }}
          FabProps={{
            size: "small"
          }}
        >
          <SpeedDialAction
            key={translate("save")}
            tooltipTitle={translate("save")}
            icon={<Icons
              key={"Pencil"}
              name={"Pencil"}
              className={"w-25 h-25"}
            />}
            onClick={() => {
              navigate(toDetail, {
                state: {
                  dateType: isGoal ? "" : "day",
                  dateStart: dayFmt,
                  dateEnd: dayFmt,
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate("openAll")}
            tooltipTitle={translate("openAll")}
            icon={<Icons
              key={"ChevronDown"}
              name={"ChevronDown"}
              className={"w-25 h-25"}
            />}
            onClick={() => {
              Array.from({ length: totalCnt }).map((_, i) => {
                setIsExpanded((prev: any) => {
                  return prev.includes(i) ? prev : [...prev, i];
                });
              });
              window.scrollTo(0, 0);
            }}
          />
          <SpeedDialAction
            key={translate("closeAll")}
            tooltipTitle={translate("closeAll")}
            icon={<Icons
              key={"ChevronUp"}
              name={"ChevronUp"}
              className={"w-25 h-25"}
            />}
            onClick={() => {
              setIsExpanded([]);
              window.scrollTo(0, 0);
            }}
          />
        </SpeedDial>
      </Div>
    );
    return (
      PATH.includes("today") ? isTodaySection() : isNotTodaySection()
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dialNode()}
    </>
  );
};
