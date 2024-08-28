// Input.jsx

import { React } from "../../import/ImportReacts.jsx";
import { TextField } from "../../import/ImportMuis.jsx";
import PropTypes from "prop-types";

// -------------------------------------------------------------------------------------------------
export const Input = ({
  readOnly = false,
  startAdornment = null,
  endAdornment = null,
  ...props
}) => {

  return (
    <TextField
      {...props}
      select={false || props.select}
      variant={"outlined" || props.variant}
      type={"text" || props.type}
      size={"small" || props.size}
      fullWidth={true || props.fullWidth}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props.slotProps?.input,
          readOnly: (
            readOnly || props.slotProps?.input?.readOnly
          ),
          startAdornment: (
            <div className={"fs-0-6rem"}>{startAdornment}</div> ||
            props.slotProps?.input?.startAdornment
          ),
          endAdornment: (
            <div className={"fs-0-6rem"}>{endAdornment}</div> ||
            props.slotProps?.input?.endAdornment
          ),
        },
        inputLabel: {
          ...props.slotProps?.inputLabel,
          shrink: false || props.slotProps?.inputLabel?.shrink,
        },
      }}
    />
  );
};

// -------------------------------------------------------------------------------------------------
Input.propTypes = {
  readOnly: PropTypes.bool,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
};


