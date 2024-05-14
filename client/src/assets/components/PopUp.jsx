// PopUp.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Popover, bindPopover} from "../../import/ImportMuis.jsx";
import {usePopupState} from 'material-ui-popup-state/hooks';

// ------------------------------------------------------------------------------------------------>
export const PopUp = ({...props}) => {

  const popupState = usePopupState({ variant: "popover", popupId: "popupState" });

  const popupStyle = props.type === "alert"
  ? ({
    border: '1px solid red',
    boxShadow: '0px 0px 10px rgba(255, 0, 0, 0.5)',
    padding: "10px 10px 10px 10px",
  }) : ({
    border: '0.2px solid rgba(0, 0, 0, 0.2)',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    padding: "10px 10px 10px 10px",
  });

  return (
    <>
    <Popover
      {...bindPopover(popupState)}
      id={"popover"}
      className={props.className}
      open={popupState.isOpen}
      anchorEl={popupState.anchorEl}
      onClose={() => {
        popupState.close();
      }}
      anchorOrigin={{
        vertical: props.position === "top" ? "top" : "bottom",
        horizontal: props.direction === "center" ? "center" : (
          props.direction === "right" ? "left" : "right"
        )
      }}
      transformOrigin={{
        vertical: props.position === "top" ? "bottom" : "top",
        horizontal: props.direction === "center" ? "center" : (
          props.direction === "right" ? "left" : "right"
        )
      }}
      slotProps={{
        paper: {
          style: popupStyle
        }
      }}
    >
      {props.contents}
    </Popover>
    {props.children({
      openPopup: (anchorEl) => {
        popupState.setAnchorEl(anchorEl);
        popupState.open();
      },
      closePopup: () => {
        popupState.close();
      }
    })}
    </>
  );
};