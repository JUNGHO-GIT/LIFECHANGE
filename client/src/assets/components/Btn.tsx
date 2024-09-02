// Btn.tsx

import { Button } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Btn = (props: any) => {

  return (
    <Button
      {...props}
      size={props?.size || "small"}
      color={props?.color || "primary"}
      variant={props?.variant || "contained"}
      style={{
        ...props?.style,
        padding: props?.style?.padding || "2px 12px",
        textTransform: props?.style?.textTransform || "none",
        whiteSpace: props?.style?.whiteSpace || "nowrap",
        overflow: props?.style?.overflow || "hidden",
        textOverflow: props?.style?.textOverflow || "ellipsis",
        fontSize: props?.style?.fontSize || "0.9rem"
      }}
    />
  );
};