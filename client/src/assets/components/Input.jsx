// Input.jsx

import { TextField } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Input = ({
  ...props
}) => {

  return (
    <TextField
      {...props}
      select={ props?.select || false}
      variant={ props?.variant || "outlined"}
      type={ props?.type || "text"}
      size={ props?.size || "small"}
      fullWidth={ props?.fullWidth || true}
      slotProps={{
        ... props?.slotProps,
        input: {
          ... props?.slotProps?.input,
          className: (
            props?.inputclass || "fs-1-0rem d-left"
          ),
          readOnly: (
            props?.readOnly || false
          ),
          startAdornment: (
            props?.startadornment ? (
              typeof props?.startadornment === "string" ? (
                <div className={"fs-0-6rem"}>{props?.startadornment}</div>
              ) : (
                <div className={"me-2vw"}>{props?.startadornment}</div>
              )
            ) : (
              null
            )
          ),
          endAdornment: (
            props?.endadornment ? (
              typeof props?.endadornment === "string" ? (
                <div className={"fs-0-6rem"}>{props?.endadornment}</div>
              ) : (
                <div className={"ms-2vw"}>{props?.endadornment}</div>
              )
            ) : (
              null
            )
          ),
        },
      }}
    />
  );
};