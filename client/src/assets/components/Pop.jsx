// PopAlert.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Popover, bindPopover} from "../../import/ImportMuis.jsx";
import {usePopupState} from 'material-ui-popup-state/hooks';

// ------------------------------------------------------------------------------------------------>
export const PopAlert = ({ elementId, contents, children }) => {

  const popupState = usePopupState({ variant: "popover", popupId: "popupState" });

  return (
    <Div>
      {children({
        openPopup: (anchorEl) => {
          popupState.setAnchorEl(anchorEl);
          popupState.open();
        },
        closePopup: () => popupState.close()
      })}
      <Popover
        {...bindPopover(popupState)}
        id={"popover"}
        open={popupState.isOpen}
        anchorEl={popupState.anchorEl}
        onClose={() => {
          popupState.close();
          setTimeout(() => document.getElementById(elementId)?.focus(), 0);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 125
        }}
        slotProps={{
          paper: {
            style: {
              border: '2px solid red',
              boxShadow: '0px 0px 10px rgba(255, 0, 0, 0.5)'
            }
          }
        }}
      >
        {contents}
      </Popover>
    </Div>
  );
};

// ------------------------------------------------------------------------------------------------>
export const PopUp = ({ elementId, contents, children }) => {

    const popupState = usePopupState({ variant: "popover", popupId: "popupState" });

    return (
      <Div>
        {children({
          openPopup: (anchorEl) => {
            popupState.setAnchorEl(anchorEl);
            popupState.open();
          },
          closePopup: () => popupState.close()
        })}
        <Popover
          {...bindPopover(popupState)}
          id={"popover"}
          open={popupState.isOpen}
          anchorEl={popupState.anchorEl}
          onClose={() => {
            popupState.close();
            setTimeout(() => document.getElementById(elementId)?.focus(), 0);
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          slotProps={{
            paper: {style: {
              border: '0.2px solid rgba(0, 0, 0, 0.2)',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
              padding: "10px 10px 10px 10px",
            }}
          }}
        >
          {contents}
        </Popover>
      </Div>
    );
  }

// ------------------------------------------------------------------------------------------------>
export const PopDown = ({ elementId, contents, children }) => {

  const popupState = usePopupState({ variant: "popover", popupId: "popupState" });

  return (
    <Div>
      {children({
        openPopup: (anchorEl) => {
          popupState.setAnchorEl(anchorEl);
          popupState.open();
        },
        closePopup: () => popupState.close()
      })}
      <Popover
        {...bindPopover(popupState)}
        id={"popover"}
        open={popupState.isOpen}
        anchorEl={popupState.anchorEl}
        onClose={() => {
          popupState.close();
          setTimeout(() => document.getElementById(elementId)?.focus(), 0);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        slotProps={{
          paper: {style: {
            border: '0.2px solid rgba(0, 0, 0, 0.2)',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
            padding: "10px 10px 10px 10px",
          }}
        }}
      >
        {contents}
      </Popover>
    </Div>
  );
};