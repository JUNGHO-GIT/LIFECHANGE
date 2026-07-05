/**
 * @file Btn.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { Button } from "@exportMuis";
import { memo } from "@exportReacts";

// -------------------------------------------------------------------------------------------------
export const Btn = memo((props: any) => {
  const style = props?.style ? { ...props.style } : undefined;

  return (
    <Button
      {...props}
      size={props?.size ?? `small`}
      color={props?.color ?? `primary`}
      variant={props?.variant ?? `contained`}
      style={style}
    />
  );
});
