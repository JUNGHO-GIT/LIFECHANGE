// Bg.jsx

import { Badge } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Bg = ({
  ...props
}) => {

  return (
    <Badge
      {...props}
      showZero={props?.showZero || true}
      color={props?.color || "primary"}
      className={props?.className || "mt-n10 me-n5"}
      sx={{
        ...props?.sx,
        '& .MuiBadge-badge': {
          color: props?.sx?.color || "white",
          backgroundColor: props?.bgcolor || "black",
        },
      }}
    />
  );
};