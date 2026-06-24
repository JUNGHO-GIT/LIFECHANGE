/**
 * @file PopUp.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { memo, useCallback, useMemo, useId } from "@exportReacts";
import { bindPopover, PopoverOrigin, usePopupState, PopupState } from "@exportMuis";
import { Popover } from "@exportComponents";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const PopUp = memo((props: any) => {

  // 1. Popup State ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const id: string = useId();
  const popupState: PopupState = usePopupState({
    variant: `popover`,
    popupId: props?.id ?? id,
  });

  // 2. popupStyle ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const popupStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = {
      display: `flex`,
      flexDirection: `column`,
      justifyContent: `center`,
      alignItems: `center`,
    };

    switch (props?.type) {
      case `innerCenter`:
        return {
          ...baseStyle,
          border: `0.2px solid rgba(0, 0, 0, 0.2)`,
          boxShadow: `0px 0px 10px rgba(0, 0, 0, 0.5)`,
          padding: `20px`,
        };
      case `alert`:
        return {
          ...baseStyle,
          border: `1px solid red`,
          boxShadow: `0px 0px 10px rgba(255, 0, 0, 0.5)`,
          padding: `6px`,
        };
      case `chart`:
        return {
          ...baseStyle,
          border: `0.2px solid rgba(0, 0, 0, 0.2)`,
          boxShadow: `0px 0px 10px rgba(0, 0, 0, 0.5)`,
          padding: `6px 0px 6px 12px`,
        };
      case `modal`:
        return {
          ...baseStyle,
          border: `0.2px solid rgba(0, 0, 0, 0.2)`,
          boxShadow: `0px 0px 10px rgba(0, 0, 0, 0.5)`,
          padding: `10px`,
        };
      default:
        return baseStyle;
    }
  }, [props?.type]);

  // 4. handle ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const handleClose = useCallback((_event: any, reason: string) => {
    if (reason === `backdropClick`) {
      popupState.close();
    }
  }, [popupState]);

  const openPopup = useCallback((anchorEl: any) => {
    popupState.setAnchorEl(anchorEl);
    popupState.open();
  }, [popupState]);

  const closePopup = useCallback(() => {
    popupState.close();
  }, [popupState]);

  // 4. memoized values ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const popupContents = useMemo(() => (
    typeof props?.contents === `function`
      ? props?.contents({ closePopup: closePopup })
      : props?.contents
  ), [ props?.contents, closePopup ]);

  const popupChildren = useMemo(() => (
    props?.children({ openPopup: openPopup, closePopup: closePopup })
  ), [ props?.children, openPopup, closePopup ]);

  const anchorOrigin = useMemo<PopoverOrigin>(() => ({
    vertical: props?.position === `center` ? `center` : (
      props?.position === `top` ? `top` : `bottom`
    ),
    horizontal: props?.direction === `center` ? `center` : (
      props?.direction === `right` ? `right` : `left`
    ),
  }), [ props?.position, props?.direction ]);

  const transformOrigin = useMemo<PopoverOrigin>(() => ({
    vertical: props?.position === `center` ? `center` : (
      props?.position === `top` ? `bottom` : `top`
    ),
    horizontal: props?.direction === `center` ? `center` : (
      props?.direction === `right` ? `left` : `right`
    ),
  }), [ props?.position, props?.direction ]);

  const innerCenterAnchorPosition = useMemo(() => ({
    top: typeof window !== `undefined` ? window.innerHeight / 2 : 0,
    left: typeof window !== `undefined` ? window.innerWidth / 2 : 0,
  }), []);

  // 5. chainedPopUp ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const chainedPopUp = useMemo(() => (
    <>
      <Popover
        {...bindPopover(popupState)}
        open={popupState.isOpen}
        anchorEl={popupState.anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        keepMounted={false}
        disableRestoreFocus={false}
        slotProps={{
          paper: {
            sx: popupStyle,
          },
        }}
        children={(
          popupContents
        )}
      />
      {popupChildren}
    </>
  ), [
    popupState, handleClose, anchorOrigin, transformOrigin, popupStyle, popupContents, popupChildren,
  ]);

  // 6. innerCenterPopUp ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const innerCenterPopUp = useMemo(() => (
    <>
      <Popover
        {...bindPopover(popupState)}
        open={popupState.isOpen}
        anchorEl={null}
        onClose={handleClose}
        anchorReference={`anchorPosition`}
        anchorPosition={innerCenterAnchorPosition}
        anchorOrigin={{
          vertical: `center`,
          horizontal: `center`,
        }}
        transformOrigin={{
          vertical: `center`,
          horizontal: `center`,
        }}
        keepMounted={false}
        disableRestoreFocus={false}
        slotProps={{
          paper: {
            sx: popupStyle,
          },
        }}
        children={(
          popupContents
        )}
      />
      {popupChildren}
    </>
  ), [
    popupState, handleClose, innerCenterAnchorPosition, popupStyle, popupContents, popupChildren,
  ]);

  // 10. return ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  return (
    <>
      {props?.type === `innerCenter` && innerCenterPopUp}
      {props?.type !== `innerCenter` && chainedPopUp}
    </>
  );
});
