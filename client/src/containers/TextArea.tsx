// TextArea.tsx

import { TextField } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const TextArea = (props: any) => (
  <TextField
    {...props}
    select={false}
    multiline={true}
    id={props?.id || `id-${Math.random().toString(36).slice(2, 11)}`}
    name={props?.name || `name-${Math.random().toString(36).slice(2, 11)}`}
    size={props?.size || "small"}
    type={props?.type || "text"}
    variant={props?.variant || "outlined"}
    className={props?.className || ""}
    fullWidth={props?.fullWidth || true}
    inputRef={props?.inputRef || null}
    error={props?.error || false}
    slotProps={{
      ...props?.slotProps,
      input: {
        ...props?.slotProps?.input,
        readOnly: (
          (props?.readOnly || props?.locked === "locked") ? true : false
        ),
        className: (
          props?.inputclass?.includes("fs-") ? (
            `text-left ${props?.inputclass}`
          ) : (
            `fs-0-9rem text-left ${props?.inputclass}`
          )
        ),
        startAdornment: (
          props?.startadornment ? (
            typeof props?.startadornment === "string" ? (
              <div className={`d-center fs-0-6rem ${props?.adornmentclass || ""}`}>
                {props?.startadornment}
              </div>
            ) : (
              <div className={`d-center ${props?.adornmentclass || ""} me-2vw`}>
                {props?.startadornment}
              </div>
            )
          ) : null
        ),
        endAdornment: (
          props?.endadornment ? (
            typeof props?.endadornment === "string" ? (
              <div className={`d-center fs-0-6rem ${props?.adornmentclass || ""}`}>
                {props?.endadornment}
              </div>
            ) : (
              <div className={`d-center ${props?.adornmentclass || ""} ms-2vw`}>
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