// Alert.tsx

import { useEffect } from "@importReacts";
import { useStoreAlert } from "@importStores";
import { Icons } from "@importComponents";
import { Snackbar, Alert as MuiAlert } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Alert = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { ALERT, setALERT } = useStoreAlert();

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
      style={{
        zIndex: 1000000
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
        className={"w-95vw h-8vh d-center border-dark radius-2 shadow-2 fs-1-0rem fw-700 snackbar z-10000"}
        action={
          <>
            <Icons
              key={"Check"}
              name={"Check"}
              className={"w-24px h-24px black"}
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
