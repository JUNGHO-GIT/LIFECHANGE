// Select.jsx

import { React } from "../../import/ImportReacts.jsx";
import { TextField } from "../../import/ImportMuis.jsx";
import PropTypes from "prop-types";

// -------------------------------------------------------------------------------------------------
export const Select = ({
  readOnly = false,
  startAdornment = null,
  endAdornment = null,
  ...props
}) => {

  // slotProps 수정
  const modifySlotProps = (props) => ({
    ...props.slotProps,

    // readonly, startAdornment, endAdornment 설정
    select: {
      ...props.slotProps?.input,
      readOnly: (props.readOnly ?? props.slotProps?.input?.readOnly) || false,
      startAdornment: (
        <div className={"fs-0-6rem"}>
          {props.startAdornment || props.slotProps?.input?.startAdornment}
        </div>
      ),
      endAdornment: (
        <div className={"fs-0-6rem"}>
          {props.endAdornment || props.slotProps?.input?.endAdornment}
        </div>
      ),
    },

    // shrink는 항상 true
    inputLabel: {
      ...props.slotProps?.inputLabel,
      shrink: true,
    },
  });

  return (
    <TextField
      {...props}
      select={true}
      variant={"outlined"}
      type={"text"}
      size={"small"}
      fullWidth={true}
      style={{
        textAlign: "left",
      }}
      slotProps={modifySlotProps({
        ...props,
        readOnly,
        startAdornment,
        endAdornment,
      })}
    />
  );
};

// -------------------------------------------------------------------------------------------------
Select.propTypes = {
  readOnly: PropTypes.bool,
  startAdornment: PropTypes.element,
  endAdornment: PropTypes.element,
};