// Confirm.tsx

import { useStoreConfirm } from "@importHooks";
import { Icons } from "@importComponents";
import { Snackbar, Alert as MuiAlert } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Confirm = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { CONFIRM, setCONFIRM } = useStoreConfirm();

  // 7. confirm ------------------------------------------------------------------------------------
  const confirmNode = () => (
    <Snackbar
      open={CONFIRM.open}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      onClose={() => {
        setCONFIRM({
          open: false,
        });
      }}
    >
      <MuiAlert
        severity={"success"}
        variant={"standard"}
        className={"w-95vw h-9vh d-center border-dark radius-1 shadow-2 fs-1-0rem fw-700 snackbar z-10000"}
        action={
          <>
            <Icons
              key={"Check"}
              name={"Check"}
              className={"w-24 h-24 primary"}
              onClick={() => {
                setCONFIRM({
                  open: false,
                });
                CONFIRM.callback && CONFIRM.callback(true);
              }}
            />
            <Icons
              key={"X"}
              name={"X"}
              className={"w-24 h-24 danger"}
              onClick={() => {
                setCONFIRM({
                  open: false,
                });
                CONFIRM.callback && CONFIRM.callback(false);
              }}
            />
          </>
        }
      >
        {CONFIRM.msg}
      </MuiAlert>
    </Snackbar>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {confirmNode()}
    </>
  );
};
