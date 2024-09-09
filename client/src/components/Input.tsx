// Input.tsx

import { TextField } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Input = (props: any) => {
  return (
    <TextField
      {...props}
      select={false}
      type={props?.type || "text"}
      variant={props?.variant || "outlined"}
      size={props?.size || "small"}
      fullWidth={props?.fullWidth || true}
      className={props?.className || ""}
      inputRef={props?.inputRef || null}
      error={props?.error || false}
      slotProps={{
        input: {
          readOnly: (
            props?.readOnly || false
          ),
          className: (
            props?.inputclass?.includes("fs-") ? (
              `text-left ${props?.inputclass || ""}`
            ) : (
              `fs-1-0rem text-left ${props?.inputclass || ""}`
            )
          ),
          startAdornment: (
            props?.startadornment ? (
              typeof props?.startadornment === "string" ? (
                <div className={"fs-0-6rem"}>{props?.startadornment}</div>
              ) : (
                <div className={"me-2vw"}>{props?.startadornment}</div>
              )
            ) : null
          ),
          endAdornment: (
            props?.endadornment ? (
              typeof props?.endadornment === "string" ? (
                <div className={"fs-0-6rem"}>{props?.endadornment}</div>
              ) : (
                <div className={"ms-2vw"}>{props?.endadornment}</div>
              )
            ) : null
          ),
        },
        inputLabel: {
          shrink: (props?.shrink === "shrink" ? true : undefined),
        }
      }}
    />
  );
};