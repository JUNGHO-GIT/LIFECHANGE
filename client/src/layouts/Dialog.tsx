// Dialog.tsx

import { useState } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { Div, Icons } from "@imports/ImportComponents";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Backdrop } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare type DialogProps = {
  COUNT?: any;
  setCOUNT?: any;
  LOCKED?: any;
  setLOCKED?: any;
  setIsExpanded?: any;
}

// -------------------------------------------------------------------------------------------------
export const Dialog = (
  { COUNT, setCOUNT, LOCKED, setLOCKED, setIsExpanded }: DialogProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, navigate, toDetail, localIsoCode } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [open, setOpen] = useState(false);
  const isToday = PATH.includes("/today");
  const isGoalList = PATH.includes("/goal/list");
  const isFindList = PATH.includes("/find/list");
  const isFavoriteList = PATH.includes("/favorite/list");
  const isList = !isGoalList && !isFindList && !isFavoriteList && PATH.includes("/list");
  const isDetail = PATH.includes("/detail");

  // 7. dialog -------------------------------------------------------------------------------------
  const dialogNode = () => {
    // 1. today
    const todaySection = () => (
      <Div className={`p-fixed d-row-bottom bottom-18vh z-600 right-6vw`}>
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
            icon={
              <Icons
                key={"ChevronDown"}
                name={"ChevronDown"}
                className={"w-25 h-25"}
              />
            }
            onClick={() => {
              setIsExpanded(() => ({
                exercise: Array.from({ length: COUNT?.exercise as number }).map((_: any) => ({
                  expanded: true,
                })),
                food: Array.from({ length: COUNT?.food as number }).map((_: any) => ({
                  expanded: true,
                })),
                money: Array.from({ length: COUNT?.money as number }).map((_: any) => ({
                  expanded: true,
                })),
                sleep: Array.from({ length: COUNT?.sleep as number }).map((_: any) => ({
                  expanded: true,
                })),
              }));
              window.scrollTo(0, 0);
            }}
          />
          <SpeedDialAction
            key={translate("closeAll")}
            tooltipTitle={translate("closeAll")}
            className={open ? "" : "d-none"}
            icon={
              <Icons
                key={"ChevronUp"}
                name={"ChevronUp"}
                className={"w-25 h-25"}
              />
            }
            onClick={() => {
              setIsExpanded(() => ({
                exercise: Array.from({ length: COUNT?.exercise as number }).map((_: any) => ({
                  expanded: false,
                })),
                food: Array.from({ length: COUNT?.food as number }).map((_: any) => ({
                  expanded: false,
                })),
                money: Array.from({ length: COUNT?.money as number }).map((_: any) => ({
                  expanded: false,
                })),
                sleep: Array.from({ length: COUNT?.sleep as number }).map((_: any) => ({
                  expanded: false,
                })),
              }));
              window.scrollTo(0, 0);
            }}
          />
        </SpeedDial>
      </Div>
    );
    // 2. goal
    const listGoalSection = () => (
      <Div className={`p-fixed d-row-bottom bottom-18vh z-600 right-6vw`}>
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
                  dateType: "week",
                  dateStart: getWeekStartFmt(),
                  dateEnd: getWeekEndFmt(),
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate("openAll")}
            tooltipTitle={translate("openAll")}
            className={open ? "" : "d-none"}
            icon={
              <Icons
                key={"ChevronDown"}
                name={"ChevronDown"}
                className={"w-25 h-25"}
              />
            }
            onClick={() => {
              setIsExpanded(() => (
                Array.from({ length: COUNT?.totalCnt as number }).map((_: any) => ({
                  expanded: true,
                }))
              ));
              window.scrollTo(0, 0);
            }}
          />
          <SpeedDialAction
            key={translate("closeAll")}
            tooltipTitle={translate("closeAll")}
            className={open ? "" : "d-none"}
            icon={
              <Icons
                key={"ChevronUp"}
                name={"ChevronUp"}
                className={"w-25 h-25"}
              />
            }
            onClick={() => {
              setIsExpanded(() => (
                Array.from({ length: COUNT?.totalCnt as number }).map((_: any) => ({
                  expanded: false,
                }))
              ));
              window.scrollTo(0, 0);
            }}
          />
        </SpeedDial>
      </Div>
    );
    // 3. real
    const listRealSection = () => (
      <Div className={`p-fixed d-row-bottom bottom-18vh z-600 right-6vw`}>
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
                  dateType: "day",
                  dateStart: getDayFmt(),
                  dateEnd: getDayFmt(),
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate("openAll")}
            tooltipTitle={translate("openAll")}
            className={open ? "" : "d-none"}
            icon={
              <Icons
                key={"ChevronDown"}
                name={"ChevronDown"}
                className={"w-25 h-25"}
              />
            }
            onClick={() => {
              setIsExpanded(() => (
                Array.from({ length: COUNT?.totalCnt as number }).map((_: any) => ({
                  expanded: true,
                }))
              ));
              window.scrollTo(0, 0);
            }}
          />
          <SpeedDialAction
            key={translate("closeAll")}
            tooltipTitle={translate("closeAll")}
            className={open ? "" : "d-none"}
            icon={
              <Icons
                key={"ChevronUp"}
                name={"ChevronUp"}
                className={"w-25 h-25"}
              />
            }
            onClick={() => {
              setIsExpanded(() => (
                Array.from({ length: COUNT?.totalCnt as number }).map((_: any) => ({
                  expanded: false,
                }))
              ));
              window.scrollTo(0, 0);
            }}
          />
        </SpeedDial>
      </Div>
    );
    // 4. find
    const findSection = () => (
      <Div className={`p-fixed d-row-bottom bottom-18vh z-600 right-6vw`}>
        <Backdrop
          open={open}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={"speedDial"}
          direction={"up"}
          className={"ms-5"}
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
          {PATH.includes("/favorite/list") ? (
            <SpeedDialAction
              key={translate("search")}
              tooltipTitle={translate("search")}
              className={open ? "" : "d-none"}
              icon={
                <Icons
                  key={"Search"}
                  name={"Search"}
                  className={"w-23 h-23"}
                />
              }
              onClick={() => {
                navigate("/food/find/list");
              }}
            />
          ) : (
            <SpeedDialAction
              key={translate("favorite")}
              tooltipTitle={translate("favorite")}
              className={open ? "" : "d-none"}
              icon={
                <Icons
                  key={"Star"}
                  name={"Star"}
                  fill={"gold"}
                  className={"w-23 h-23"}
                />
              }
              onClick={() => {
                navigate("/food/favorite/list");
              }}
            />
          )}
          <SpeedDialAction
            key={translate("save")}
            tooltipTitle={translate("save")}
            className={open ? "" : "d-none"}
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
                  dateStart: getDayFmt(),
                  dateEnd: getDayFmt(),
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate("openAll")}
            tooltipTitle={translate("openAll")}
            className={open ? "" : "d-none"}
            icon={
              <Icons
                key={"ChevronDown"}
                name={"ChevronDown"}
                className={"w-25 h-25"}
              />
            }
            onClick={() => {
              setIsExpanded(() => (
                Array.from({ length: COUNT?.totalCnt as number }).map((_: any) => ({
                  expanded: true,
                }))
              ));
              window.scrollTo(0, 0);
            }}
          />
          <SpeedDialAction
            key={translate("closeAll")}
            tooltipTitle={translate("closeAll")}
            className={open ? "" : "d-none"}
            icon={
              <Icons
                key={"ChevronUp"}
                name={"ChevronUp"}
                className={"w-25 h-25"}
              />
            }
            onClick={() => {
              setIsExpanded(() => (
                Array.from({ length: COUNT?.totalCnt as number }).map((_: any) => ({
                  expanded: false,
                }))
              ));
              window.scrollTo(0, 0);
            }}
          />
          <SpeedDialAction
            key={translate("locale")}
            tooltipTitle={translate("locale")}
            className={open ? "" : "d-none"}
            icon={
              <Div className={"fw-800 fs-0-8rem"}>
                {localIsoCode}
              </Div>
            }
          />
        </SpeedDial>
      </Div>
    );
    // 5. detail
    const detailSection = () => (
      <Div className={`p-fixed d-row-bottom bottom-18vh z-600 right-6vw`}>
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
        todaySection()
      )
      : isGoalList ? (
        listGoalSection()
      )
      : isFindList || isFavoriteList ? (
        findSection()
      )
      : isList ? (
        listRealSection()
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
      {dialogNode()}
    </>
  );
};
