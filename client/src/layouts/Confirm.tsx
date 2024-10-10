// Confirm.tsx

import { useEffect } from "@imports/ImportReacts";
import { Snackbar, Alert as MuiAlert } from "@imports/ImportMuis";
import { Icons } from "@imports/ImportComponents";
import { useConfirmStore } from "@imports/ImportStores";

// -------------------------------------------------------------------------------------------------
export const Confirm = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { CONFIRM, setCONFIRM } = useConfirmStore();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // confirm이 true일 때 콜백 실행
    if (CONFIRM.confirm && CONFIRM.callback) {
      CONFIRM.callback(true);
    }

    // confirm이 false일 때 콜백 실행
    else if (!CONFIRM.confirm && !CONFIRM.open && CONFIRM.callback) {
      CONFIRM.callback(false);
    }

  }, [CONFIRM.confirm, CONFIRM.open, CONFIRM.callback]);

  // 7. confirm ------------------------------------------------------------------------------------
  const confirmNode = () => (
    <Snackbar
      open={CONFIRM.open}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      onClose={() => {
        setCONFIRM({
          open: false,
          confirm: false
        });
      }}
    >
      <MuiAlert
        severity={"success"}
        variant={"standard"}
        className={"w-100p h-9vh d-center border-dark radius-1 shadow-2 fs-1-0rem fw-600 snackbar z-10000"}
        action={
          <>
            <Icons
              key={"Check"}
              name={"Check"}
              className={"w-24 h-24 primary"}
              onClick={() => {
                setCONFIRM({
                  open: false,
                  confirm: true
                });
              }}
            />
            <Icons
              key={"X"}
              name={"X"}
              className={"w-24 h-24 danger"}
              onClick={() => {
                setCONFIRM({
                  open: false,
                  confirm: false
                });
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
