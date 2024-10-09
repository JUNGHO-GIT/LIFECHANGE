// TextArea.tsx

import { TextField } from "@imports/ImportMuis";
import { Div, Br } from "@imports/ImportComponents";

// -------------------------------------------------------------------------------------------------
export const TextArea = (props: any) => (
  <TextField
    {...props}
    label={props?.label || ""}
    select={props?.select || false}
    variant={"outlined"}
    type={props?.type || "text"}
    size={props?.size || "small"}
    fullWidth={props?.fullWidth || true}
    multiline={props?.multiline || true}
    className={props?.className || ""}
    slotProps={{
      ...props?.slotProps,
      input: {
        readOnly: (
          props?.readOnly || false
        ),
        className: (
          props?.inputclass?.includes("fs-") ? (
            `text-left ${props?.inputclass}`
          ) : (
            `fs-1-0rem text-left ${props?.inputclass}`
          )
        ),
      },
      inputLabel: {
        ...props?.slotProps?.inputLabel,
        shrink: true
      }
    }}
  />
);