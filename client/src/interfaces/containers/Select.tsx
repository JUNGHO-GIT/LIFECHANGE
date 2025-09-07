// Select.tsx

import { TextField } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Select = (props: any) => (
  <TextField
    {...props}
    select={props?.children ? true : false}
    size={props?.size || "small"}
    type={props?.type || "text"}
    variant={props?.variant || "outlined"}
    className={props?.className || ""}
    fullWidth={props?.fullWidth || true}
    inputRef={props?.inputRef || null}
    error={props?.error || false}
		value={props?.value || ""}
    onClick={(e: React.MouseEvent) => {
      // 1. locked or disabled 경우
			if (props?.locked === "locked" || props?.disabled) {
        e.preventDefault();
        e.stopPropagation();
        const target = e.currentTarget;
        target.classList.add('shake');
        setTimeout(() => {
          target.classList.remove('shake');
        }, 700);
      }
      // 2. locked or disabled 아닌 경우
      else if (props?.locked !== "locked" && !props?.disabled) {
        props?.onClick && props?.onClick(e);
      }
    }}
    sx={{
      ...props?.sx,
      "& .MuiSelect-icon": {
        display: props?.disabled && "none"
      },
      "& .MuiInputBase-root": {
        cursor : (
          props?.readOnly && (
            props?.onClick ? "pointer" : "not-allowed"
          )
        ),
        backgroundColor: (
					props?.disabled ? "#f7f7f7" : (
						props?.readOnly && (
							props?.onClick ? "transparent" : "#f7f7f7"
						)
					)
				),
        "&:hover": {
          backgroundColor: (
						props?.disabled ? "#f7f7f7" : (
							props?.readOnly && (
								props?.onClick ? "transparent" : "#f7f7f7"
							)
						)
          ),
        },
        "&:focus": {
          backgroundColor: (
						props?.disabled ? "#f7f7f7" : (
							props?.readOnly && (
								props?.onClick ? "transparent" : "#f7f7f7"
							)
						)
          ),
        }
      },
    }}
    slotProps={{
      ...props?.slotProps,
      input: {
        ...props?.slotProps?.input,
        readOnly: (
          (props?.readOnly || props?.locked === "locked") ? true : false
        ),
        className: (
          props?.inputclass?.includes("fs-") ? (
            `text-left ${props?.inputclass || ""}`
          ) : (
            `fs-0-75rem text-left ${props?.inputclass || ""}`
          )
        ),
        startAdornment: (
          props?.startadornment ? (
            typeof props?.startadornment === "string" ? (
              <div className={`d-center fs-0-6rem ${props?.adornmentclass || ""}`}>
                {props?.startadornment}
              </div>
            ) : (
              <div className={`d-center ${props?.adornmentclass || ""} mr-2vw`}>
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
              <div className={`d-center ${props?.adornmentclass || ""} ml-2vw`}>
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