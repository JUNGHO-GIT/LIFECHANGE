// Dialog.tsx

import { useState } from "@importReacts";
import { useCommonValue, useCommonDate } from "@importHooks";
import { useStoreLanguage } from "@importStores";
import { Div, Icons } from "@importComponents";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Backdrop } from "@importMuis";

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
  const { translate } = useStoreLanguage();

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
      <Div className={"d-flex"}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={"speedDial"}
          direction={"up"}
          open={open}
          style={{ zIndex: 600 }}
          className={`p-fixed bottom-18vh right-6vw`}
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
                className={"w-25px h-25px"}
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
                className={"w-25px h-25px"}
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
      <Div className={"d-flex"}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={"speedDial"}
          direction={"up"}
            open={open}
            style={{ zIndex: 600 }}
            className={`p-fixed bottom-18vh right-6vw`}
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
                className={"w-25px h-25px"}
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
                className={"w-25px h-25px"}
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
                className={"w-25px h-25px"}
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
      <Div className={"d-flex"}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={"speedDial"}
          direction={"up"}
            open={open}
            style={{ zIndex: 600 }}
            className={`p-fixed bottom-18vh right-6vw`}
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
                className={"w-25px h-25px"}
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
                className={"w-25px h-25px"}
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
                className={"w-25px h-25px"}
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
      <Div className={"d-flex"}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={"speedDial"}
          direction={"up"}
          open={open}
          className={`p-fixed bottom-18vh z-600 right-6vw ml-5px`}
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
                  className={"w-23px h-23px"}
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
                  className={"w-23px h-23px"}
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
                className={"w-25px h-25px"}
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
                className={"w-25px h-25px"}
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
                className={"w-25px h-25px"}
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
      <Div className={"d-flex"}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={"speedDial"}
          direction={"up"}
          open={open}
          style={{ zIndex: 600 }}
          className={`p-fixed bottom-18vh right-6vw`}
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
                  key={"UnLock"}
                  name={"UnLock"}
                  className={"w-25px h-25px"}
                />
              ) : (
                <Icons
                  key={"Lock"}
                  name={"Lock"}
                  className={"w-25px h-25px"}
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
                className={"w-25px h-25px"}
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
