// Dropdown.jsx

import {React} from "../../import/ImportReacts";
import {Box, TextField, Typography} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
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
    </Box>
  );
};