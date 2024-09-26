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
    navigate, toDetail, PATH, localIsoCode
  } = useCommonValue();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [open, setOpen] = useState(false);
  const isToday = PATH.includes("/today");
  const isGoalList = PATH.includes("/goal/list");
  const isFindList = PATH.includes("/find/list");
  const isList = !isGoalList && !isFindList && PATH.includes("/list");
  const isDetail = PATH.includes("/detail");

  // 7. dial ---------------------------------------------------------------------------------------
  const dialNode = () => {
    // 1. list (today o)
    const listTodaySection = () => (
      <Div className={`p-fixed bottom-18vh z-600 right-6vw`}>
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
            size: "small",
            component: "div",
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate("openAll")}
            tooltipTitle={translate("openAll")}
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
    // 2. list (today x)
    const listNotTodaySection = () => (
      <Div className={`p-fixed bottom-18vh z-600 right-6vw`}>
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
            size: "small",
            component: "div",
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate("save")}
            tooltipTitle={translate("save")}
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
                  dateType: isGoalList ? "" : "day",
                  dateStart: dayFmt,
                  dateEnd: dayFmt,
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate("openAll")}
            tooltipTitle={translate("openAll")}
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
    // 3. find
    const findSection = () => (
      <Div className={`p-fixed bottom-18vh z-600 right-6vw`}>
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
            size: "small",
            component: "div",
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate("save")}
            tooltipTitle={translate("save")}
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
                  dateType: isGoalList ? "" : "day",
                  dateStart: dayFmt,
                  dateEnd: dayFmt,
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate("openAll")}
            tooltipTitle={translate("openAll")}
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
          <SpeedDialAction
            key={translate("nation")}
            tooltipTitle={translate("nation")}
            className={`${open ? "" : "d-none"}`}
            FabProps={{
              size: "small",
              component: "div",
            }}
            icon={
              <Div className={"fw-800 fs-0-8rem"}>
                {localIsoCode}
              </Div>
            }
          />
        </SpeedDial>
      </Div>
    );
    // 4. detail
    const detailSection = () => (
      <Div className={`p-fixed bottom-18vh z-600 right-6vw`}>
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
            size: "small",
            component: "div",
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate("itemLock")}
            tooltipTitle={translate("itemLock")}
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
            className={open ? "" : "d-none"}
            FabProps={{
              size: "small",
              component: "div",
            }}
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
    // 10. return
    return (
      isToday ? (
        listTodaySection()
      )
      : isGoalList || isList ? (
        listNotTodaySection()
      )
      : isFindList ? (
        findSection()
      )
      : isDetail ? (
        detailSection()
      )
      : null
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dialNode()}
    </>
  );
};