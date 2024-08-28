// Select.jsx

import { TextField } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Select = ({
  ...props
}) => {

  return (
    <TextField
      {...props}
      select={props?.select || true}
      variant={props?.variant || "outlined"}
      type={props?.type || "text"}
      size={props?.size || "small"}
      fullWidth={props?.fullWidth || true}
      style={{
        fontSize: "0.8rem",
      }}
      slotProps={{
        ...props?.slotProps,
        input: {
          ...props?.slotProps?.input,
          className: (
            props?.inputClassName || ""
          ),
          readOnly: (
            props?.readOnly || false
          ),
          startAdornment: (
            typeof props?.startAdornment === "string" ? (
              <div className={"w-16 h-16"}>{props?.startAdornment}</div>
            ) : (
              props?.startAdornment
            )
          ),
          endAdornment: (
            typeof props?.endAdornment === "string" ? (
              <div className={"fs-0-6rem"}>{props?.endAdornment}</div>
            ) : (
              props?.endAdornment
            )
          ),
        },
      }}
    />
  );
};