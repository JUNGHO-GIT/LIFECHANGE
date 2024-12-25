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
      fontFamily:"Pretendard Variable, Pretendard, Noto Sans KR, Roboto, sans-serif"
    }}
  />
);