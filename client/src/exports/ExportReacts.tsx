/**
 * @file ExportReacts.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

// react ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export type {
  JSX,
} from "react";
export {
  useState,
  useEffect,
  useCallback,
  useRef,
  createRef,
  memo,
  useMemo,
  useId,
} from "react";
export {
  default as React,
} from "react";

// react-dom ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export {
  createRoot,
} from "react-dom/client";

// react-router ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export {
  useNavigate,
  useLocation,
  BrowserRouter,
  Routes,
  Route,
  type Location,
  type NavigateFunction,
} from "react-router";
