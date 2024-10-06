// Buttons.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { PopUp } from "@imports/ImportContainers";
import { Btn, Div } from "@imports/ImportComponents";
import { Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare type ButtonsProps = {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const Buttons = (
  { state, setState, flow }: ButtonsProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, toFind, navigate } = useCommonValue();
  const { translate } = useLanguageStore();

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = (type: string) => {
    flow?.flowSave(type);
    Object.keys(sessionStorage).forEach((key) => {
      if (key.includes("foodSection") || key.includes("paging")) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {

    // 1. find
    const toFindSection = () => (
      <Btn
        color={"success"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          navigate(toFind, {
            state: {
              url: PATH,
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
        className={"ms-1vw me-1vw"}
        onClick={() => {
          navigate("/food/favorite/list");
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
          <Card className={"h-max30vh d-center"}>
            <Grid container spacing={2} columns={12}>
              <Grid size={12}>
                <Div className={"fs-1-0rem fw-600 pre-line dark-grey"}>
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
                  className={"fs-1-2rem fw-600 ms-1vw me-1vw"}
                  onClick={() => {
                    flowSave("replace");
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
                  className={"fs-1-2rem fw-600 ms-1vw me-1vw"}
                  onClick={() => {
                    flowSave("insert");
                  }}
                >
                  {translate("insert")}
                </Btn>
              </Grid>
            </Grid>
          </Card>
        }
      >
        {(popTrigger: any) => (
          <Btn
            color={"primary"}
            className={"ms-1vw me-1vw"}
            onClick={(e: any) => {
              if (state.FLOW?.exist) {
                if (state.FLOW?.itsMe) {
                  flowSave("update");
                }
                else {
                  popTrigger.openPopup(e.currentTarget);
                }
              }
              else {
                flowSave("create");
              }
            }}
          >
            {translate("save")}
          </Btn>
        )}
      </PopUp>
    );

    // 4. delete
    const deleteSection = () => (
      <Btn
        color={"error"}
        className={"ms-1vw me-1vw"}
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
        <Grid container spacing={2} columns={12}>
          <Grid size={10} className={"d-center"}>
            {saveSection()}
          </Grid>
        </Grid>
      )
      : PATH.includes("/detail") ? (
        <Grid container spacing={2} columns={12}>
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

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {btnNode()}
    </>
  );
};