// PopUp.tsx

import { Popover, bindPopover, usePopupState } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const PopUp = (props: any) => {

  const popupState = usePopupState({
    variant: props?.variant || 'popover',
    popupId: props?.id || 'popover',
  });

  let popupStyle = {};
  if (props?.type === "innerCenter") {
    popupStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      border: '0.2px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      padding: "20px 10px",
    };
  }
  else if (props?.type === "alert") {
    popupStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      border: '1px solid red',
      boxShadow: '0px 0px 10px rgba(255, 0, 0, 0.5)',
      padding: "6px 6px 6px 6px",
    };
  }
  else if (props?.type === "chart") {
    popupStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      border: '0.2px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      padding: "6px 0px 6px 12px",
    };
  }
  else {
    popupStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      border: '0.2px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      padding: "12px 12px 12px 12px",
    };
  }

  // 1. 팝업 고정 ----------------------------------------------------------------------------------
  const chainedPopUp = () => (
    <>
    <Popover
      {...bindPopover(popupState)}
      id={"popover"}
      className={props?.className}
      open={popupState.isOpen}
      onClose={(event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason ==="backdropClick" || reason === "escapeKeyDown") {
          popupState.close();
        }
      }}
      anchorEl={popupState.anchorEl}
      anchorOrigin={{
        vertical: props?.position === "center" ? "center" : (
          props?.position === "top" ? "top" : "bottom"
        ),
        horizontal: props?.direction === "center" ? "center" : (
          props?.direction === "right" ? "right" : "left"
        )
      }}
      transformOrigin={{
        vertical: props?.position === "center" ? "center" : (
          props?.position === "top" ? "bottom" : "top"
        ),
        horizontal: props?.direction === "center" ? "center" : (
          props?.direction === "right" ? "left" : "right"
        )
      }}
      slotProps={{
        paper: {
          style: {
            ...popupStyle
          }
        }
      }}
    >
      {typeof props?.contents === "function"
        ? props?.contents({ closePopup: popupState.close })
        : props?.contents
      }
    </Popover>
    {props?.children({
      openPopup: (anchorEl: any) => {
        popupState.setAnchorEl(anchorEl);
        popupState.open();
      },
      closePopup: () => {
        popupState.close();
      }
    })}
    </>
  );

  // 2. 팝업 화면 정중앙 ---------------------------------------------------------------------------
  const innerCenterPopUp = () => (
    <>
    <Popover
      {...bindPopover(popupState)}
      id={"popover"}
      className={props?.className}
      open={popupState.isOpen}
      onClose={(event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason ==="backdropClick" || reason === "escapeKeyDown") {
          popupState.close();
        }
      }}
      anchorEl={null}
      anchorReference={"anchorPosition"}
      anchorPosition={{
        top: window.innerHeight / 2,
        left: window.innerWidth / 2
      }}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      slotProps={{
        paper: {
          style: {
            ...popupStyle
          }
        }
      }}
    >
      {
        typeof props?.contents === "function"
        ? props?.contents({ closePopup: popupState.close })
        : props?.contents
      }
    </Popover>
    {props?.children({
      openPopup: (anchorEl: any) => {
        popupState.setAnchorEl(anchorEl);
        popupState.open();
      },
      closePopup: () => {
        popupState.close();
      }
    })}
    </>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {props?.type === "innerCenter" && innerCenterPopUp()}
      {props?.type !== "innerCenter" && chainedPopUp()}
    </>
  );
};