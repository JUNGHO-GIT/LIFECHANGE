// Alert.tsx

import { useEffect } from "@imports/ImportReacts";
import { Snackbar, Alert as MuiAlert } from "@imports/ImportMuis";
import { useAlertStore } from "@imports/ImportStores";

// -------------------------------------------------------------------------------------------------
export const Alert = () => {
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
        vertical: "bottom",
        horizontal: "center"
      }}
      onClose={() => {
        setALERT({
          open: false
        });
      }}
    >
      <MuiAlert
        severity={ALERT.severity}
        variant={"standard"}
        className={"w-100p border-dark radius-1 shadow-4 snackbar"}
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
