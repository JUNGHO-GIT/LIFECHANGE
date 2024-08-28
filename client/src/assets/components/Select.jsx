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
      slotProps={{
        ...props?.slotProps,
        input: {
          ...props?.slotProps?.input,
          className: (
            props?.inputclass || "fs-0-8rem"
          ),
          readOnly: (
            props?.readOnly || false
          ),
          startadornment: (
            typeof props?.startadornment === "string" ? (
              <div className={"w-16 h-16"}>{props?.startadornment}</div>
            ) : (
              props?.startadornment
            )
          ),
          endadornment: (
            typeof props?.endadornment === "string" ? (
              <div className={"fs-0-6rem"}>{props?.endadornment}</div>
            ) : (
              props?.endadornment
            )
          ),
        },
      }}
    />
  );
};