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
    console.error(`[ErrorBoundary]`, error, info?.componentStack);
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
