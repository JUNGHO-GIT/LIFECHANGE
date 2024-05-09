// Pop.jsx

import {React} from "../../import/ImportReacts";
import {Box, TextField, Typography} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
import {Popover, bindPopover} from "../../import/ImportMuis";
import { usePopupState } from 'material-ui-popup-state/hooks';

// ------------------------------------------------------------------------------------------------>
export const Pop = ({ children, elementId, alertText }) => {

  const popupState = usePopupState({ variant: 'popover', popupId: 'popupState' });

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
        id="popover"
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
          horizontal: 130
        }}
      >
        <Typography variant="body1" sx={{ p: 2 }}>
          {alertText}
        </Typography>
      </Popover>
    </Box>
  );
};