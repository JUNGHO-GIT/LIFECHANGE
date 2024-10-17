// Alert.tsx

import { useEffect } from "@imports/ImportReacts";
import { Snackbar, Alert as MuiAlert } from "@imports/ImportMuis";
import { Icons } from "@imports/ImportComponents";
import { useAlertStore } from "@imports/ImportStores";

// -------------------------------------------------------------------------------------------------
export const Alert = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { ALERT, setALERT } = useAlertStore();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (ALERT.open) {
      setALERT({
        open: true
      });
    }
  }, [ALERT.open]);

  // 7. alert --------------------------------------------------------------------------------------
  const alertNode = () => (
    <Snackbar
      open={ALERT.open}
      autoHideDuration={1000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      onClose={() => {
        setALERT({
          open: false
        });
      }}
    >
      <MuiAlert
        severity={ALERT.severity === "error" ? "error" : "info"}
        variant={"standard"}
        className={"w-95vw h-9vh d-center border-dark radius-1 shadow-2 fs-1-0rem fw-700 snackbar z-10000"}
        action={
          <>
            <Icons
              key={"Check"}
              name={"Check"}
              className={"w-24 h-24 black"}
              onClick={() => {
                setALERT({
                  open: false
                });
              }}
            />
          </>
        }
      >
        {ALERT.msg}
      </MuiAlert>
    </Snackbar>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {alertNode()}
    </>
  );
};
