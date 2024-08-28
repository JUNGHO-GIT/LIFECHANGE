// Btn.jsx

import { React } from "../../import/ImportReacts.jsx";
import { Button } from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Btn = ({
  ...props
}) => {

  return (
    <Button
      {...props}
      size={props.size || "small"}
      color={props.color || "primary"}
      variant={props.variant || "contained"}
      style={{
        lineHeight: "1.4",
        padding: "4px 10px",
        textTransform: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "0.8rem"
      }}
    />
  );
};