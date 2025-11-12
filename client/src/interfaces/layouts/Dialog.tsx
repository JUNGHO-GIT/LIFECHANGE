// Dialog.tsx

import { Div, Icons } from "@exportComponents";
import { useCommonDate, useCommonValue } from "@exportHooks";
import { Backdrop, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@exportMuis";
import { memo, useState } from "@exportReacts";
import { useStoreLanguage } from "@exportStores";

// -------------------------------------------------------------------------------------------------
declare type DialogProps = {
  COUNT?: any;
  setCOUNT?: any;
  OBJECT?: any;
  setOBJECT?: any;
  LOCKED?: string;
  setLOCKED?: React.Dispatch<React.SetStateAction<string>>;
  setIsExpanded?: any;
}

// -------------------------------------------------------------------------------------------------
export const Dialog = memo((
  { COUNT, setCOUNT, OBJECT, setOBJECT, LOCKED, setLOCKED, setIsExpanded }: DialogProps
) => {

	// 1. common ----------------------------------------------------------------------------------
  const { PATH, navigate, toDetail, localIsoCode } = useCommonValue();
	const { isToday, isGoalList, isFindList, isFavoriteList, isList, isDetail } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

	// 2-2. useState ---------------------------------------------------------------------------------
  const [open, setOpen] = useState(false);

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
					className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
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
					className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
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
    // 3. record
    const listRecordSection = () => (
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
					className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
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
					className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
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
					className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
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
							if (setLOCKED) {
								if (LOCKED === "locked") {
									setLOCKED("unlocked");
								}
								else {
									setLOCKED("locked");
								}
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
            onClick={(e) => {
              if (LOCKED === "locked") {
                e.preventDefault();
                return;
              }
              if (setOBJECT) {
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: [],
                  today_food_section: [],
                }));
              }
              if (setCOUNT) {
                setCOUNT((prev: any) => ({
                  ...prev,
                  newSectionCnt: 0,
                }));
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
        listRecordSection()
      )
      : isDetail ? (
        detailSection()
      )
			: null
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {dialogNode()}
    </>
  );
});
