// Input.tsx

import { TextField } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Input = (props: any) => {
  return (
    <TextField
      {...props}
      select={props?.select || false}
      variant={props?.variant || "outlined"}
      type={props?.type || "text"}
      size={props?.size || "small"}
      fullWidth={props?.fullWidth || true}
      className={props?.className || ""}
      slotProps={{
        input: {
          className: (
            props?.inputclass?.includes("fs-") ? (
              `text-left ${props?.inputclass || ""}`
            ) : (
              `fs-1-0rem text-left ${props?.inputclass || ""}`
            )
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