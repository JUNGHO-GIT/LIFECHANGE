// Buttons.tsx

import { memo, useMemo, useEffect } from "@importReacts";
import { Btn, Div, Grid } from "@importComponents";
import { PopUp } from "@importContainers";
import { useCommonValue } from "@importHooks";
import { fnSetSession } from "@importScripts";
import { useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
declare type ButtonsProps = {
  state: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const Buttons = memo((
  { state, flow }: ButtonsProps
) => {

	// 1. common ----------------------------------------------------------------------------------
  const { toFind, toFavorite, navigate } = useCommonValue();
	const { isFoodRecordDetail, isUserCategory, isUserDetail, isDetail, isSleep } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 2. useMemo ---------------------------------------------------------------------------------
  const navigationState = useMemo(() => ({
    dateType: state?.DATE?.dateType,
    dateStart: state?.DATE?.dateStart,
    dateEnd: state?.DATE?.dateEnd
  }), [state?.DATE?.dateType, state?.DATE?.dateStart, state?.DATE?.dateEnd]);

  // 3. handler ------------------------------------------------------------------------------------
  const handleSave = (type: string) => {
    flow?.flowSave(type);
    fnSetSession("section", "food", "", []);
  };

  // 7. btn ----------------------------------------------------------------------------------------
  const toFindBtn = useMemo(() => (
    <Btn
      color={"success"}
      className={"ml-2vw mr-2vw"}
      onClick={() => {
        navigate(toFind, {
					state: navigationState
				});
      }}
    >
      {translate("find")}
    </Btn>
  ), [navigate, toFind, navigationState, translate]);

  const favoriteBtn = useMemo(() => (
    <Btn
      color={"warning"}
      className={"ml-2vw mr-2vw"}
      onClick={() => {
        navigate(toFavorite, {
          state: navigationState
        });
      }}
    >
      {translate("favorite")}
    </Btn>
  ), [navigate, toFavorite, navigationState, translate]);

  const deleteBtn = useMemo(() => (
    <Btn
      color={"error"}
      className={"ml-2vw mr-2vw"}
      onClick={() => {
        flow?.flowDelete();
      }}
    >
      {translate("delete")}
    </Btn>
  ), [flow, translate]);

  const saveBtn = useMemo(() => (
    <PopUp
      key={"innerCenter"}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      padding={"6px"}
      contents={
        <Grid container={true} spacing={2} className={"h-max-30vh d-row-center"}>
          <Grid size={12}>
            <Div className={"fs-0-8rem fw-600 pre-line dark-grey"}>
              {translate("replaceOrInsert")}
            </Div>
          </Grid>
          <Grid
            size={isSleep ? 12 : 6}
            className={isSleep ? "d-center" : "d-row-right"}
          >
            <Btn
              size={"large"}
              color={"primary"}
              variant={"text"}
              className={"fs-1-2rem fw-600 ml-2vw mr-2vw"}
              onClick={() => {
                handleSave("replace");
              }}
            >
              {translate("replace")}
            </Btn>
          </Grid>
          <Grid
            size={isSleep ? 0 : 6}
            className={isSleep ? "d-none" : "d-row-left"}
          >
            <Btn
              size={"large"}
              color={"primary"}
              variant={"text"}
              className={"fs-1-2rem fw-600 ml-2vw mr-2vw"}
              onClick={() => {
                handleSave("insert");
              }}
            >
              {translate("insert")}
            </Btn>
          </Grid>
        </Grid>
      }
      children={(popTrigger: any) => (
        <Btn
          color={"primary"}
          className={"ml-2vw mr-2vw"}
          onClick={(e: any) => {
            state.FLOW?.exist ? (
              state.FLOW?.itsMe ? handleSave("update") : popTrigger.openPopup(e.currentTarget)
            ) : (
							handleSave("create")
						);
          }}
        >
          {translate("save")}
        </Btn>
      )}
    />
  ), [isSleep, translate, state.FLOW?.exist, state.FLOW?.itsMe]);

	// 10. return ----------------------------------------------------------------------------------
  return (
		(isUserCategory || isUserDetail) ? (
			<Grid container={true} spacing={1}>
				<Grid size={10} className={"d-center"}>
					{saveBtn}
				</Grid>
			</Grid>
		)
		: isDetail ? (
			<Grid container={true} spacing={1}>
				<Grid size={10} className={"d-center"}>
					{saveBtn}
					{deleteBtn}
					{isFoodRecordDetail && toFindBtn}
					{isFoodRecordDetail && favoriteBtn}
				</Grid>
			</Grid>
		) : null
	);
});