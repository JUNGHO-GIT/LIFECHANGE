// Buttons.tsx
// Node -> Section -> Fragment

import { useState } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { Btn, Div, Icons } from "@imports/ImportComponents";
import { Grid } from "@imports/ImportMuis";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Backdrop } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface ButtonsProps {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const Buttons = (
  { state, setState, flow }: ButtonsProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    PATH, toFind, toUpdate, navigate
  } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [open, setOpen] = useState<boolean>(false);

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {

    // 1. find
    const toFindSection = () => (
      <Btn
        color={"warning"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          Object.assign(state?.SEND, {
            url: PATH,
            dateType: state?.DATE.dateType,
            dateStart: state?.DATE.dateStart,
            dateEnd: state?.DATE.dateEnd
          });
          navigate(toFind, {
            state: state?.SEND,
          });
        }}
      >
        {translate("find")}
      </Btn>
    );

    // 2. new
    const newNode = () => (
      <Btn
        color={"success"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          flow?.flowNew();
        }}
      >
        {translate("new")}
      </Btn>
    );

    // 3. toUpdate
    const toUpdateSection = () => (
      <Btn
        color={"primary"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          Object.assign(state?.SEND, {
            dateType: state?.DATE.dateType,
            dateStart: state?.DATE.dateStart,
            dateEnd: state?.DATE.dateEnd
          });
          navigate(toUpdate, {
            state: state?.SEND,
          });
        }}
      >
        {translate("update")}
      </Btn>
    );

    // 3. save
    const saveSection = () => (
      <Btn
        color={"primary"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          flow?.flowSave();
          Object.keys(sessionStorage).forEach((key) => {
            if (key.includes("foodSection") || key.includes("paging")) {
              sessionStorage.removeItem(key);
            }
          });
        }}
      >
        {translate("save")}
      </Btn>
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

    // 9. dial
    const dialSection = () => (
      <SpeedDial
        ariaLabel={"SpeedDial"}
        direction={"up"}
        icon={<SpeedDialIcon />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        FabProps={{
          color: "default",
          size: "small",
          style: {
            backgroundColor: "#ffffff",
            color: "black",
            border: "1px solid #000000",
          }
        }}
        style={{
          position: "absolute",
          bottom: 3,
          right: 0,
          zIndex: 1000000,
        }}
      >
        <SpeedDialAction
          key={"today"}
          icon={<SpeedDialIcon />}
          sx={{
           zIndex: 1000000,
          }}
          tooltipTitle={translate("today")}
        />
        <SpeedDialAction
          key={"calendar"}
          icon={<SpeedDialIcon />}
          tooltipTitle={translate("calendar")}

        />
      </SpeedDial>
    );

    // 10. return
    return (
      PATH.includes("/user/category") || PATH.includes("/user/detail") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {saveSection()}
          </Grid>
        </Grid>
      )
      : PATH.includes("/detail") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {newNode()}
            {toUpdateSection()}
            {deleteSection()}
          </Grid>
        </Grid>
      )
      : PATH.includes("/update") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {PATH.includes("/food") ? toFindSection() : null}
            {newNode()}
            {saveSection()}
            {deleteSection()}
          </Grid>
        </Grid>
      )
      : PATH.includes("/save") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {PATH.includes("/food") ? toFindSection() : null}
            {saveSection()}
            {deleteSection()}
            {dialSection()}
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