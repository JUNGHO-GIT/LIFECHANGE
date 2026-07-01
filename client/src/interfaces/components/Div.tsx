/**
 * @file Div.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { memo } from "@exportReacts";

// -------------------------------------------------------------------------------------------------
// - 숫자 문자열을 k, m, b 단위로 축약
const formatCompactNumber = (value: string | number) => {
  const numberValue = Number(String(value ?? `0`).replaceAll(`,`, ``).trim());
  const absoluteValue = Math.abs(numberValue);

  if (!Number.isFinite(numberValue) || absoluteValue < 1_000) {
    return value;
  }

  if (absoluteValue >= 1_000_000_000) {
    return `${(numberValue / 1_000_000_000).toFixed(1).replace(/\.0$/, ``)}b`;
  }

  if (absoluteValue >= 1_000_000) {
    return `${(numberValue / 1_000_000).toFixed(1).replace(/\.0$/, ``)}m`;
  }

  return `${(numberValue / 1_000).toFixed(1).replace(/\.0$/, ``)}k`;
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