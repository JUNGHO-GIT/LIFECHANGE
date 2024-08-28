// Input.jsx

import { TextField } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Input = ({
  ...props
}) => {

  return (
    <TextField
      {...props}
      select={props.select || false}
      variant={props.variant || "outlined"}
      type={props.type || "text"}
      size={props.size || "small"}
      fullWidth={props.fullWidth || true}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props.slotProps?.input,
          className: (
            props.inputclass || "fs-1-0rem"
          ),
          readOnly: (
            props.readOnly || false
          ),
          startAdornment: (
            typeof props.startadornment === "string" ? (
              <div className={"fs-0-6rem me-10"}>{props.startadornment}</div>
            ) : (
              <div className={"me-10"}>{props.startadornment}</div>
            )
          ),
          endAdornment: (
            typeof props.endadornment === "string" ? (
              <div className={"fs-0-6rem ms-10"}>{props.endadornment}</div>
            ) : (
              <div className={"ms-10"}>{props.endadornment}</div>
            )
          ),
        },
      }}
    />
  );
};