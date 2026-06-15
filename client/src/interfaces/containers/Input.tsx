/**
 * @file Input.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { memo } from "@exportReacts";
import { InputBase } from "@interfaces/containers/InputBase";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Input = memo((props: any) => {
  return (
    <InputBase {...props} asSelect={false} />
  );
});
