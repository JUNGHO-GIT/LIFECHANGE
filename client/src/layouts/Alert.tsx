// Alert.tsx

import { useEffect } from "@imports/ImportReacts";
import { Snackbar, Alert as MuiAlert } from "@imports/ImportMuis";
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

  // 7. snackbar -----------------------------------------------------------------------------------
  const snackbarNode = () => (
    <Snackbar
      open={ALERT.open}
      autoHideDuration={3000}
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
        className={"w-100p h-9vh d-center border-dark radius-1 shadow-4 fs-1-0rem fw-600 snackbar z-10000"}
        onClose={() => {
          setALERT({
            open: false
          });
        }}
      >
        {ALERT.msg}
      </MuiAlert>
    </Snackbar>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {snackbarNode()}
    </>
  );
};
