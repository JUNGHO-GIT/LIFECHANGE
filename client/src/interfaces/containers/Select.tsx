/**
 * @file Select.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { memo } from "@exportReacts";
import { InputBase } from "@interfaces/containers/InputBase";

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const Select = memo((props: any) => {
  return (
    <InputBase {...props} asSelect={true} />
  );
});
