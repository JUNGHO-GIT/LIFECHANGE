/**
 * @file Alert.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Icons } from "@exportComponents";
import { MuiAlert, Snackbar } from "@exportMuis";
import { memo, useEffect } from "@exportReacts";
import { useStoreAlert } from "@exportStores";

// -------------------------------------------------------------------------------------------------
export const Alert = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { ALERT, setALERT } = useStoreAlert();

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    ALERT.open && (
      setALERT({
        open: true,
      })
    );
  }, [ALERT.open]);

  // 7. alert --------------------------------------------------------------------------------------
  const alertNode = () => (
    <Snackbar
      open={ALERT.open}
      autoHideDuration={ALERT.severity === `error` ? 4000 : 2000}
      anchorOrigin={{
        vertical: `top`,
        horizontal: `center`,
      }}
      style={{
        zIndex: 1_000_000,
      }}
      onClose={() => {
        setALERT({
          open: false,
        });
      }}
    >
      <MuiAlert
        severity={ALERT.severity === `error` ? `error` : `info`}
        variant={`standard`}
        className={`w-95vw d-center radius-3 border-light-1 shadow-1 fs-0-95rem fw-700 snackbar z-10000`}
        action={(
          <Icons
            key={`Check`}
            name={`Check`}
            className={`w-24px h-24px black`}
            onClick={() => {
              setALERT({
                open: false,
              });
            }}
          />
        )}
      >
        {ALERT.msg}
      </MuiAlert>
    </Snackbar>
  );

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {alertNode()}
    </>
  );
});
