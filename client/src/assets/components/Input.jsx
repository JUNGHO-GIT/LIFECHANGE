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
        readOnly || slotProps?.input?.readOnly
      ),
      startAdornment: (
        <div className={"fs-0-6rem"}>
          {startAdornment || slotProps?.input?.startAdornment}
        </div>
      ),
      endAdornment: (
        <div className={"fs-0-6rem"}>
          {endAdornment || slotProps?.input?.endAdornment}
        </div>
      ),
    },

    // shrink는 항상 true
    inputLabel: {
      ...slotProps?.inputLabel,
      shrink: true,
    },
  });

  return (
    <TextField
      {...props}
      select={false}
      variant={"outlined"}
      type={"text"}
      size={"small"}
      fullWidth={true}
      style={{
        textAlign: "left",
      }}
      slotProps={modifySlotProps(slotProps)}
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


