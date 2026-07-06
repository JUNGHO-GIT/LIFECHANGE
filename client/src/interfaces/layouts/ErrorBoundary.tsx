/**
 * @file ErrorBoundary.tsx
 * @description foo
 * @author Jungho
 * @since 2026-06-06
 */

import { Box, Button } from "@exportMuis";
import { useStoreLanguage } from "@exportStores";
import { Component, type ErrorInfo, type ReactNode } from "react";

// -------------------------------------------------------------------------------------------------
declare interface ErrorBoundaryProps {
  children: ReactNode;
}

declare interface ErrorBoundaryState {
  hasError: boolean;
}

// -------------------------------------------------------------------------------------------------
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // 1. state ---------------------------------------------------------------------------------------
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // 2. derive --------------------------------------------------------------------------------------
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // 3. catch ----------------------------------------------------------------------------------------
  override componentDidCatch(error: Error, info: ErrorInfo): void {
    const componentStack: string = info?.componentStack ?? ``;
    const normalizedError: Error = error instanceof Error ? error : new Error(String(error));
    // console.* 는 프로덕션 빌드(vite dropConsole)에서 제거되므로 표준 reportError 로 실제 에러를 남긴다.
    // reportError 는 console.* 가 아니라 minify 제거 대상이 아니어서 배포 환경 콘솔/에러 리스너에 그대로 노출된다.
    const reportFn: ((reported: unknown) => void) | undefined = (globalThis as { reportError?: (reported: unknown) => void }).reportError;
    reportFn?.(normalizedError);
    console.error(`[ErrorBoundary]`, normalizedError, componentStack);
  }

  // 7. fallback -------------------------------------------------------------------------------------
  fallbackNode(): ReactNode {
    const { translate } = useStoreLanguage.getState();
    return (
      <Box
        className={`d-center fs-0-9rem fw-500`}
        style={{
          flexDirection: `column`,
          width: `100vw`,
          height: `100vh`,
          gap: `16px`,
        }}
      >
        <Box className={`fs-1-2rem fw-700 dark`}>{translate(`errorBoundaryTitle`)}</Box>
        <Box className={`fs-0-9rem fw-500`}>{translate(`errorBoundaryDesc`)}</Box>
        <Button
          size={`small`}
          color={`primary`}
          variant={`contained`}
          onClick={() => {
            window.location.reload();
          }}
        >
          {translate(`refresh`)}
        </Button>
      </Box>
    );
  }

  // 10. render --------------------------------------------------------------------------------------
  override render(): ReactNode {
    if (this.state.hasError) {
      return this.fallbackNode();
    }
    return this.props.children;
  }
}
