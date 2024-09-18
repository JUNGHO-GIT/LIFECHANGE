// Dial.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { Div, Icons } from "@imports/ImportComponents";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Backdrop } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface DialProps {
  COUNT?: any;
  setCOUNT?: any;
  LOCKED?: any;
  setLOCKED?: any;
  isExpanded?: any;
  setIsExpanded?: any;
}

// -------------------------------------------------------------------------------------------------
export const Dial = (
  { COUNT, setCOUNT, LOCKED, setLOCKED, isExpanded, setIsExpanded }: DialProps
) => {

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
  const isList = PATH.includes("/list");

  // 7. dial ---------------------------------------------------------------------------------------
  const dialNode = () => {
    // 1. list
    const listSection = () => {
      const isTodayFragment = () => (
        <Div className={"p-fixed bottom-18vh right-3vw z-600"}>
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
            icon={
              <SpeedDialIcon />
            }
            FabProps={{
              size: "small"
            }}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <SpeedDialAction
              key={translate("openAll")}
              tooltipTitle={translate("openAll")}
              icon={
                <Icons
                  key={"ChevronDown"}
                  name={"ChevronDown"}
                  className={"w-25 h-25"}
                />
              }
              onClick={() => {
                setIsExpanded({
                  exercise: Array.from({ length: COUNT?.totalCnt as number }).map((_, i) => i),
                  food: Array.from({ length: COUNT?.totalCnt as number }).map((_, i) => i),
                  money: Array.from({ length: COUNT?.totalCnt as number }).map((_, i) => i),
                  sleep: Array.from({ length: COUNT?.totalCnt as number }).map((_, i) => i),
                });
                window.scrollTo(0, 0);
              }}
            />
            <SpeedDialAction
              key={translate("closeAll")}
              tooltipTitle={translate("closeAll")}
              icon={
                <Icons
                  key={"ChevronUp"}
                  name={"ChevronUp"}
                  className={"w-25 h-25"}
                />
              }
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
      const isNotTodayFragment = () => (
        <Div className={"p-fixed bottom-18vh right-3vw z-600"}>
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
            icon={
              <SpeedDialIcon />
            }
            FabProps={{
              size: "small"
            }}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <SpeedDialAction
              key={translate("save")}
              tooltipTitle={translate("save")}
              icon={
                <Icons
                  key={"Pencil"}
                  name={"Pencil"}
                  className={"w-25 h-25"}
              />
              }
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
              icon={
                <Icons
                  key={"ChevronDown"}
                  name={"ChevronDown"}
                  className={"w-25 h-25"}
              />
              }
              onClick={() => {
                Array.from({ length: COUNT?.totalCnt as number }).map((_, i) => {
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
              icon={
                <Icons
                  key={"ChevronUp"}
                  name={"ChevronUp"}
                  className={"w-25 h-25"}
              />
              }
              onClick={() => {
                setIsExpanded([]);
                window.scrollTo(0, 0);
              }}
            />
          </SpeedDial>
        </Div>
      );
      return (
        PATH.includes("today") ? isTodayFragment() : isNotTodayFragment()
      );
    };
    // 2. detail
    const detailSection = () => (
      <Div className={"p-fixed bottom-18vh right-3vw z-600"}>
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
          icon={
            <SpeedDialIcon />
          }
          FabProps={{
            size: "small"
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate("itemLock")}
            tooltipTitle={translate("itemLock")}
            icon={
              LOCKED === "locked" ? (
                <Icons
                  key={"Lock"}
                  name={"Lock"}
                  className={"w-25 h-25"}
                />
              ) : (
                <Icons
                  key={"UnLock"}
                  name={"UnLock"}
                  className={"w-25 h-25"}
                />
              )
            }
            onClick={() => {
              if (LOCKED === "locked") {
                setLOCKED("unlocked");
              }
              else {
                setLOCKED("locked");
              }
            }}
          />
          <SpeedDialAction
            key={translate("closeAll")}
            tooltipTitle={translate("closeAll")}
            icon={
              <Icons
                key={"X"}
                name={"X"}
                locked={LOCKED}
                className={"w-25 h-25"}
              />
            }
            onClick={(e: any) => {
              if (LOCKED === "locked") {
                e.preventDefault();
                return;
              }
              else {
                setCOUNT((prev: any) => ({
                  ...prev,
                  newSectionCnt: 0,
                }))
              }
            }}
          />
        </SpeedDial>
      </Div>
    );
    // 3. return
    return (
      isList ? listSection() : detailSection()
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dialNode()}
    </>
  );
};
