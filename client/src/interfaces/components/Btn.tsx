// Btn.tsx

import { Button } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Btn = (props: any) => (
  <Button
    {...props}
    size={props?.size || "small"}
    color={props?.color || "primary"}
    variant={props?.variant || "contained"}
    style={{
      ...props?.style,
      padding: props?.style?.padding || "2px 8px",
      textTransform: props?.style?.textTransform || "none",
      whiteSpace: props?.style?.whiteSpace || "nowrap",
      overflow: props?.style?.overflow || "hidden",
      textOverflow: props?.style?.textOverflow || "ellipsis",
      fontSize: props?.style?.fontSize || "0.9rem",
      position: "relative",
    }}
  />
);