/**
 * @file Div.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { memo } from "@exportReacts";

// -------------------------------------------------------------------------------------------------
// - 숫자 문자열을 축약 없이 세자리 콤마 표기로 변환
const formatCompactNumber = (value: string | number) => {
  const numberValue = Number(String(value ?? `0`).replaceAll(`,`, ``).trim());

  if (!Number.isFinite(numberValue)) {
    return value;
  }

  return numberValue.toLocaleString(`en-US`, { maximumFractionDigits: 10 });
};

// -------------------------------------------------------------------------------------------------
export const Div = memo(({ children, compact, ...props }: any) => {
  const childrenEl = compact
    ? formatCompactNumber(children)
    : children;

  return (
    <div {...props}>
      {childrenEl}
    </div>
  );
});