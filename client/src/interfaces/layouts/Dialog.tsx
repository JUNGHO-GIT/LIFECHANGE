/**
 * @file Dialog.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { React, memo, startTransition, useState } from "@exportReacts";
import { Div, Icons } from "@exportComponents";
import { useCommonDate, useCommonValue } from "@exportHooks";
import { Backdrop, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@exportMuis";
import { useStoreLanguage } from "@exportStores";

// -------------------------------------------------------------------------------------------------
declare interface DialogProps {
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
  const {
    PATH, navigate, toDetail, localIsoCode,
    isGoalList, isFindList, isFavoriteList,
    isList, isDetail, isCalendar,
  } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ open, setOpen ] = useState(false);

  // 4. handle ------------------------------------------------------------------------------------
  const handleSetAllExpanded = (expanded: boolean) => {
    const totalCnt: number = Number(COUNT?.totalCnt ?? 0);
    if (!setIsExpanded || totalCnt <= 0) {
      return;
    }
    startTransition(() => {
      setIsExpanded(() => (
        Array.from({ length: totalCnt }).map(() => ({
          expanded: expanded,
        }))
      ));
    });

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  };

  // 7. dialog -------------------------------------------------------------------------------------
  const dialogNode = () => {
    // 1. goal
    const listGoalSection = () => (
      <Div className={`d-flex`}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={`speedDial`}
          direction={`up`}
          open={open}
          style={{ zIndex: 600 }}
          className={`p-fixed right-6vw ml-5px z-600`}
          icon={
            <SpeedDialIcon />
          }
          FabProps={{
            size: `small`,
            component: `div`,
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate(`save`)}
            slotProps={{ tooltip: { title: translate(`save`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`Pencil`}
                name={`Pencil`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              void navigate(toDetail, {
                state: {
                  dateType: `week`,
                  dateStart: getWeekStartFmt(),
                  dateEnd: getWeekEndFmt(),
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate(`openAll`)}
            slotProps={{ tooltip: { title: translate(`openAll`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`ChevronDown`}
                name={`ChevronDown`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              handleSetAllExpanded(true);
            }}
          />
          <SpeedDialAction
            key={translate(`closeAll`)}
            slotProps={{ tooltip: { title: translate(`closeAll`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`ChevronUp`}
                name={`ChevronUp`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              handleSetAllExpanded(false);
            }}
          />
        </SpeedDial>
      </Div>
    );
    // 1. record
    const listRecordSection = () => (
      <Div className={`d-flex`}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={`speedDial`}
          direction={`up`}
          open={open}
          style={{ zIndex: 600 }}
          className={`p-fixed right-6vw ml-5px z-600`}
          icon={
            <SpeedDialIcon />
          }
          FabProps={{
            size: `small`,
            component: `div`,
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate(`save`)}
            slotProps={{ tooltip: { title: translate(`save`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`Pencil`}
                name={`Pencil`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              void navigate(toDetail, {
                state: {
                  dateType: `day`,
                  dateStart: getDayFmt(),
                  dateEnd: getDayFmt(),
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate(`openAll`)}
            slotProps={{ tooltip: { title: translate(`openAll`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`ChevronDown`}
                name={`ChevronDown`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              handleSetAllExpanded(true);
            }}
          />
          <SpeedDialAction
            key={translate(`closeAll`)}
            slotProps={{ tooltip: { title: translate(`closeAll`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`ChevronUp`}
                name={`ChevronUp`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              handleSetAllExpanded(false);
            }}
          />
        </SpeedDial>
      </Div>
    );
    // 3. find
    const findSection = () => (
      <Div className={`d-flex`}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={`speedDial`}
          direction={`up`}
          open={open}
          className={`p-fixed right-6vw ml-5px z-600`}
          icon={
            <SpeedDialIcon />
          }
          FabProps={{
            size: `small`,
            component: `div`,
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          {PATH.includes(`/favorite/list`) ? (
						<SpeedDialAction
						  key={translate(`search`)}
						  slotProps={{ tooltip: { title: translate(`search`) } }}
						  className={open ? `` : `d-none`}
						  icon={(
						    <Icons
						      key={`Search`}
						      name={`Search`}
						      className={`w-23px h-23px`}
						    />
						  )}
						  onClick={() => {
						    void navigate(`/food/find/list`);
						  }}
						/>
					) : (
						<SpeedDialAction
						  key={translate(`favorite`)}
						  slotProps={{ tooltip: { title: translate(`favorite`) } }}
						  className={open ? `` : `d-none`}
						  icon={(
						    <Icons
						      key={`Star`}
						      name={`Star`}
						      fill={`gold`}
						      className={`w-23px h-23px`}
						    />
						  )}
						  onClick={() => {
						    void navigate(`/food/favorite/list`);
						  }}
						/>
					)}
          <SpeedDialAction
            key={translate(`save`)}
            slotProps={{ tooltip: { title: translate(`save`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`Pencil`}
                name={`Pencil`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              void navigate(toDetail, {
                state: {
                  dateType: isGoalList ? `` : `day`,
                  dateStart: getDayFmt(),
                  dateEnd: getDayFmt(),
                },
              });
            }}
          />
          <SpeedDialAction
            key={translate(`openAll`)}
            slotProps={{ tooltip: { title: translate(`openAll`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`ChevronDown`}
                name={`ChevronDown`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              handleSetAllExpanded(true);
            }}
          />
          <SpeedDialAction
            key={translate(`closeAll`)}
            slotProps={{ tooltip: { title: translate(`closeAll`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`ChevronUp`}
                name={`ChevronUp`}
                className={`w-25px h-25px`}
              />
            )}
            onClick={() => {
              handleSetAllExpanded(false);
            }}
          />
          <SpeedDialAction
            key={translate(`locale`)}
            slotProps={{ tooltip: { title: translate(`locale`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Div className={`fw-700 fs-0-8rem`}>
                {localIsoCode}
              </Div>
            )}
          />
        </SpeedDial>
      </Div>
    );
    // 4. detail
    const detailSection = () => (
      <Div className={`d-flex`}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={`speedDial`}
          direction={`up`}
          open={open}
          style={{ zIndex: 600 }}
          className={`p-fixed right-6vw ml-5px z-600`}
          icon={
            <SpeedDialIcon />
          }
          FabProps={{
            size: `small`,
            component: `div`,
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate(`itemLock`)}
            slotProps={{ tooltip: { title: translate(`itemLock`) } }}
            className={open ? `` : `d-none`}
            icon={
							LOCKED === `locked` ? (
								<Icons
								  key={`UnLock`}
								  name={`UnLock`}
								  className={`w-25px h-25px`}
								/>
							) : (
								<Icons
								  key={`Lock`}
								  name={`Lock`}
								  className={`w-25px h-25px`}
								/>
							)
            }
            onClick={() => {
              if (setLOCKED) {
                if (LOCKED === `locked`) {
                  setLOCKED(`unlocked`);
                }
                else {
                  setLOCKED(`locked`);
                }
              }
            }}
          />
          <SpeedDialAction
            key={translate(`closeAll`)}
            slotProps={{ tooltip: { title: translate(`closeAll`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`X`}
                name={`X`}
                locked={LOCKED}
                className={`w-25px h-25px`}
              />
            )}
            onClick={(e) => {
              if (LOCKED === `locked`) {
                e.preventDefault();
                return;
              }
              if (setOBJECT) {
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: [],
                  calendar_food_section: [],
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
    // 5. calendar
    const calendarDetailSection = () => (
      <Div className={`d-flex`}>
        <Backdrop
          open={open}
          style={{ zIndex: 550 }}
          onClick={() => {
            setOpen(false);
          }}
        />
        <SpeedDial
          ariaLabel={`speedDial`}
          direction={`up`}
          open={open}
          style={{ zIndex: 600 }}
          className={`p-fixed right-6vw ml-5px z-600`}
          icon={
            <SpeedDialIcon />
          }
          FabProps={{
            size: `small`,
            component: `div`,
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SpeedDialAction
            key={translate(`itemLock`)}
            slotProps={{ tooltip: { title: translate(`itemLock`) } }}
            className={open ? `` : `d-none`}
            icon={
							LOCKED === `locked` ? (
								<Icons
								  key={`UnLock`}
								  name={`UnLock`}
								  className={`w-25px h-25px`}
								/>
							) : (
								<Icons
								  key={`Lock`}
								  name={`Lock`}
								  className={`w-25px h-25px`}
								/>
							)
            }
            onClick={() => {
              if (setLOCKED) {
                if (LOCKED === `locked`) {
                  setLOCKED(`unlocked`);
                }
                else {
                  setLOCKED(`locked`);
                }
              }
            }}
          />
          <SpeedDialAction
            key={translate(`closeAll`)}
            slotProps={{ tooltip: { title: translate(`closeAll`) } }}
            className={open ? `` : `d-none`}
            icon={(
              <Icons
                key={`X`}
                name={`X`}
                locked={LOCKED}
                className={`w-25px h-25px`}
              />
            )}
            onClick={(e) => {
              if (LOCKED === `locked`) {
                e.preventDefault();
                return;
              }
              if (setOBJECT) {
                setOBJECT((prev: any) => ({
                  ...prev,
                  calendar_exercise_section: [],
                  calendar_food_section: [],
                  calendar_money_section: [],
                  calendar_sleep_section: [],
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
			isGoalList ? (
				listGoalSection()
			)
			: isFindList || isFavoriteList ? (
				findSection()
			)
			: isList ? (
				listRecordSection()
			)
			: isCalendar && isDetail ? (
				calendarDetailSection()
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
