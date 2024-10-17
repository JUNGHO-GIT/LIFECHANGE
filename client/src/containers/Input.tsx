// Input.tsx

import { TextField } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Input = (props: any) => (
  <TextField
    {...props}
    select={false}
    type={props?.type || "text"}
    variant={props?.variant || "outlined"}
    className={props?.className || ""}
    size={props?.size || "small"}
    fullWidth={props?.fullWidth || true}
    inputRef={props?.inputRef || null}
    error={props?.error || false}
    onClick={(e: React.MouseEvent) => {
      // 1. locked 인 경우
      if (props?.locked === "locked") {
        e.preventDefault();
        e.stopPropagation();
        const target = e.currentTarget;
        target.classList.add('shake');
        setTimeout(() => {
          target.classList.remove('shake');
        }, 700);
      }
      // 2. locked 아닌 경우
      else {
        props?.onClick && props?.onClick(e);
      }
    }}
    sx={{
      ...props?.sx,
      "& .MuiSelect-icon": {
        display: props?.disabled && "none"
      },
    }}
    slotProps={{
      ...props?.slotProps,
      input: {
        ...props?.slotProps?.input,
        readOnly: (
          (props?.readOnly || props?.className?.includes("pointer")) ? true : false
        ),
        disabled: (
          props?.disabled || props?.locked === "locked" || false
        ),
        className: (
          props?.inputclass?.includes("fs-") ? (
            `text-left ${props?.inputclass}`
          ) : (
            `fs-1-0rem text-left ${props?.inputclass}`
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
      htmlInput: {
        ...props?.slotProps?.htmlInput,
        className: props?.inputclass?.includes("pointer") ? "pointer" : "",
      },
      inputLabel: {
        ...props?.slotProps?.inputLabel,
        shrink: ((props?.shrink === "shrink" || props?.disabled) ? true : undefined),
      }
    }}
  />
);