// Input.jsx

// Input.jsx

import { React } from "../../import/ImportReacts.jsx";
import { TextField } from "../../import/ImportMuis.jsx";
import PropTypes from "prop-types";

// -------------------------------------------------------------------------------------------------
export const Input = ({
  readOnly = false,
  startAdornment = null,
  endAdornment = null,
  slotProps = {},
  ...props
}) => {

  // slotProps 수정
  const modifySlotProps = (slotProps) => ({
    ...slotProps,
    input: {
      ...slotProps?.input,
      readOnly: (
        ( slotProps?.input?.readOnly && readOnly ) ||
        ( readOnly )
      ),
      startAdornment: (
        ( startAdornment ) &&
        ( <div className={"fs-0-6rem"}>{startAdornment}</div> )
      ),
      endAdornment: (
        ( endAdornment ) &&
        ( <div className={"fs-0-6rem"}>{endAdornment}</div> )
      ),
    },
    inputLabel: {
      ...slotProps?.inputLabel,
      shrink: false,
    },
  });

  return (
    <TextField
      {...props}
      select={false || props.select}
      variant={"outlined" || props.variant}
      type={"text" || props.type}
      size={"small" || props.size}
      fullWidth={true || props.fullWidth}
      slotProps={modifySlotProps(slotProps) || props.slotProps}
    />
  );
};

// -------------------------------------------------------------------------------------------------
Input.propTypes = {
  readOnly: PropTypes.bool,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  slotProps: PropTypes.object,
};


