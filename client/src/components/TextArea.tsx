// TextArea.tsx

import { TextField } from "@imports/ImportMuis";
import { Div, Br } from "@imports/ImportComponents";

// -------------------------------------------------------------------------------------------------
export const TextArea = (props: any) => (
  <Div className={"w-100p mt-10"}>
    <Div
      className={"d-left fs-0-9rem fw-400"}
      style={{ color: "#484848de" }}
    >
      {props?.label ? props?.required ? `${props?.label} *` : props?.label : ""}
    </Div>
    <Br px={10} />
    <TextField
      {...props}
      label={""}
      select={props?.select || false}
      variant={props?.variant || "outlined"}
      type={props?.type || "text"}
      size={props?.size || "small"}
      fullWidth={props?.fullWidth || true}
      multiline={props?.multiline || true}
      className={props?.className || ""}
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
        },
      }}
    />
  </Div>
);