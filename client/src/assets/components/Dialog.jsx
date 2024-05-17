// Dial.jsx

import React from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { usePopupState, bindTrigger } from 'material-ui-popup-state/hooks';

export const Dialog = ({ ...props }) => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoSpeedDial' });

  const handleOpen = (event, reason) => {
    if (reason === 'toggle') {
      popupState.open(event);
    }
  };

  const handleClose = (event, reason) => {
    if (reason !== 'toggle') {
      popupState.close();
    }
  };

  return (
    <SpeedDial
      {...bindTrigger(popupState)}
      ariaLabel={"Speed Dial"}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={popupState.isOpen}
      {...props}
    >
      {props.actions && props.actions.map((action, index) => (
        <SpeedDialAction
          key={index}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => {
            action.method();
            popupState.close();
          }}
        />
      ))}
    </SpeedDial>
  );
};
