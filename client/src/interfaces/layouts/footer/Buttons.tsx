// Buttons.tsx

import { Btn, Div, Grid } from "@importComponents";
import { PopUp } from "@importContainers";
import { useCommonValue } from "@importHooks";
import { memo } from "@importReacts";
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
  const { PATH, toFind, toFavorite, navigate } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 3. handler ------------------------------------------------------------------------------------
  const handleSave = (type: string) => {
    flow?.flowSave(type);
    fnSetSession("section", "food", "", []);
  };

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {

    // 1. find
    const toFindSection = () => (
      <Btn
        color={"success"}
        className={"ml-2vw mr-2vw"}
        onClick={() => {
          navigate(toFind, {
            state: {
              dateType: state?.DATE.dateType,
              dateStart: state?.DATE.dateStart,
              dateEnd: state?.DATE.dateEnd
            },
          });
        }}
      >
        {translate("find")}
      </Btn>
    );

    // 2. favorite
    const favoriteSection = () => (
      <Btn
        color={"warning"}
        className={"ml-2vw mr-2vw"}
        onClick={() => {
          navigate(toFavorite, {
            state: {
              dateType: state?.DATE.dateType,
              dateStart: state?.DATE.dateStart,
              dateEnd: state?.DATE.dateEnd
            },
          });
        }}
      >
        {translate("favorite")}
      </Btn>
    );

    // 3. save
    const saveSection = () => (
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
              size={PATH.includes("/sleep") ? 12 : 6}
              className={PATH.includes("/sleep") ? "d-center" : "d-row-right"}
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
              size={PATH.includes("/sleep") ? 0 : 6}
              className={PATH.includes("/sleep") ? "d-none" : "d-row-left"}
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
              if (state.FLOW?.exist) {
                if (state.FLOW?.itsMe) {
                  handleSave("update");
                }
                else {
                  popTrigger.openPopup(e.currentTarget);
                }
              }
              else {
                handleSave("create");
              }
            }}
          >
            {translate("save")}
          </Btn>
        )}
      />
    );

    // 4. delete
    const deleteSection = () => (
      <Btn
        color={"error"}
        className={"ml-2vw mr-2vw"}
        onClick={() => {
          flow?.flowDelete();
        }}
      >
        {translate("delete")}
      </Btn>
    );

    // 10. return
    return (
      PATH.includes("/user/category") || PATH.includes("/user/detail") ? (
        <Grid container={true} spacing={1}>
          <Grid size={10} className={"d-center"}>
            {saveSection()}
          </Grid>
        </Grid>
      )
      : PATH.includes("/detail") ? (
        <Grid container={true} spacing={1}>
          <Grid size={10} className={"d-center"}>
            {PATH.includes("/food/detail") && toFindSection()}
            {PATH.includes("/food/detail") && favoriteSection()}
            {saveSection()}
            {deleteSection()}
          </Grid>
        </Grid>
      )
      : null
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {btnNode()}
    </>
  );
});