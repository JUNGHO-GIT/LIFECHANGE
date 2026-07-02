/**
 * @file Confirm.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Icons } from "@exportComponents";
import { MuiAlert, Snackbar } from "@exportMuis";
import { memo } from "@exportReacts";
import { useStoreConfirm } from "@exportStores";

// -------------------------------------------------------------------------------------------------
export const Confirm = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { CONFIRM, setCONFIRM } = useStoreConfirm();

  // 7. confirm ------------------------------------------------------------------------------------
  const confirmNode = () => (
    <Snackbar
      open={CONFIRM.open}
      anchorOrigin={{
        vertical: `top`,
        horizontal: `center`,
      }}
      style={{
        zIndex: 1_000_000,
      }}
      onClose={() => {
        setCONFIRM({
          open: false,
        });
      }}
    >
      <MuiAlert
        severity={`success`}
        variant={`standard`}
        className={`w-95vw d-center radius-3 border-light-1 shadow-1 fs-0-95rem fw-700 snackbar z-10000`}
        action={(
          <>
            <Icons
              key={`Check`}
              name={`Check`}
              className={`w-24px h-24px primary`}
              onClick={() => {
                setCONFIRM({
                  open: false,
                });
                CONFIRM.callback?.(true);
              }}
            />
            <Icons
              key={`X`}
              name={`X`}
              className={`w-24px h-24px danger`}
              onClick={() => {
                setCONFIRM({
                  open: false,
                });
                CONFIRM.callback?.(false);
              }}
            />
          </>
        )}
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
});
