// TextArea.tsx

import { TextField } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const TextArea = (props: any) => (
  <TextField
    {...props}
    select={false}
    multiline={true}
    type={props?.type || "text"}
    variant={props?.variant || "outlined"}
    className={props?.className || ""}
    size={props?.size || "small"}
    fullWidth={props?.fullWidth || true}
    inputRef={props?.inputRef || null}
    error={props?.error || false}
    slotProps={{
      ...props?.slotProps,
      input: {
        ...props?.slotProps?.input,
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
              <div className={props?.adornmentclass ? `${props?.adornmentclass} d-center fs-0-6rem` : "d-center fs-0-6rem"}>
                {props?.startadornment}
              </div>
            ) : (
              <div className={props?.adornmentclass ? `${props?.adornmentclass} d-center me-2vw` : "d-center me-2vw"}>
                {props?.startadornment}
              </div>
            )
          ) : null
        ),
        endAdornment: (
          props?.endadornment ? (
            typeof props?.endadornment === "string" ? (
              <div className={props?.adornmentclass ? `${props?.adornmentclass} d-center fs-0-6rem` : "d-center fs-0-6rem"}>
                {props?.endadornment}
              </div>
            ) : (
              <div className={props?.adornmentclass ? `${props?.adornmentclass} d-center ms-2vw` : "d-center ms-2vw"}>
                {props?.endadornment}
              </div>
            )
          ) : null
        ),
      },
      inputLabel: {
        ...props?.slotProps?.inputLabel,
        shrink: ((props?.shrink === "shrink" || props?.disabled) ? true : undefined),
      }
    }}
  />
);