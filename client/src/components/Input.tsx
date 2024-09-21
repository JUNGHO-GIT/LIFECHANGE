// Input.tsx

import { TextField } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Input = (props: any) => (
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
        display: props?.readOnly && "none"
      },
      "& .MuiOutlinedInput-root": {
        cursor: props?.readOnly && "pointer",
        caretColor: props?.readOnly && "transparent",
      },
      "& .MuiOutlinedInput-input": {
        cursor: props?.readOnly && "pointer",
        caretColor: props?.readOnly && "transparent",
      },
      "& .MuiOutlinedInput-root.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          border: "2px solid #1976d2",
        }
      },
      "& .MuiOutlinedInput-root.Mui-error": {
        "& .MuiOutlinedInput-notchedOutline": {
          border: "2px solid #d32f2f",
        },
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#1976d2",
      },
      "& .MuiInputLabel-root.Mui-error": {
        color: "#d32f2f",
      },
    }}
    slotProps={{
      input: {
        readOnly: (
          props?.readOnly || props?.locked === "locked" || false
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
              <div className={props?.adornmentclass || "fs-0-6rem"}>
                {props?.startadornment}
              </div>
            ) : (
              <div className={props?.adornmentclass || "me-2vw"}>
                {props?.startadornment}
              </div>
            )
          ) : null
        ),
        endAdornment: (
          props?.endadornment ? (
            typeof props?.endadornment === "string" ? (
              <div className={props?.adornmentclass || "fs-0-6rem"}>
                {props?.endadornment}
              </div>
            ) : (
              <div className={props?.adornmentclass || "ms-2vw"}>
                {props?.endadornment}
              </div>
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