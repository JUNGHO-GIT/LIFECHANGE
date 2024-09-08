// TextArea.tsx

import { TextField } from "@imports/ImportMuis";
import { Div, Br } from "@imports/ImportComponents";

// -------------------------------------------------------------------------------------------------
export const TextArea = (props: any) => {
  return (
    <>
      <Div className={"d-left black-50 fs-0-9rem fw-400 mt-15"}>
        {props?.required ? `${props?.label} *` : props?.label}
      </Div>
      <Br px={10} />
      <TextField
        {...props}
        select={props?.select || false}
        variant={props?.variant || "outlined"}
        type={props?.type || "text"}
        size={props?.size || "small"}
        fullWidth={props?.fullWidth || true}
        multiline={props?.multiline || true}
        rows={props?.rows || 4}
        className={props?.className || ""}
        label={""}
        slotProps={{
          ...props?.slotProps,
          input: {
            className: (
              props?.inputclass?.includes("fs-") ? (
                `text-left ${props?.inputclass}`
              ) : (
                `fs-1-0rem text-left ${props?.inputclass}`
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
        }}
      />
    </>
  );
};