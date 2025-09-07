// Confirm.tsx

import { useStoreConfirm } from "@importStores";
import { Icons } from "@importComponents";
import { Snackbar, MuiAlert } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Confirm = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { CONFIRM, setCONFIRM } = useStoreConfirm();

  // 7. confirm ------------------------------------------------------------------------------------
  const confirmNode = () => (
    <Snackbar
      open={CONFIRM.open}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      style={{
        zIndex: 1000000
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
        className={"w-95vw h-8vh d-center border-dark radius-2 shadow-2 fs-0-75rem fw-700 snackbar z-10000"}
        action={
          <>
            <Icons
              key={"Check"}
              name={"Check"}
              className={"w-24px h-24px primary"}
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
              className={"w-24px h-24px danger"}
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

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {confirmNode()}
    </>
  );
};
