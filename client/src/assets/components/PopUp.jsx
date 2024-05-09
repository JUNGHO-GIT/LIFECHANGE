// PopUp.jsx

import {React} from "../../import/ImportReacts";
import {Popover, bindPopover, Box} from "../../import/ImportMuis";
import {usePopupState} from 'material-ui-popup-state/hooks';

// ------------------------------------------------------------------------------------------------>
export const PopUp = ({ elementId, contents, children }) => {

  const popupState = usePopupState({ variant: "popover", popupId: "popupState" });

  return (
    <Box>
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
    </Box>
  );
};