// ImportLayouts.tsx

import { lazy } from "@importReacts";

// -------------------------------------------------------------------------------------------------
const Header = lazy(() => import("@interfaces/layouts/Header").then((module) => ({
  default: module.Header
})));
const TopNav = lazy(() => import("@interfaces/layouts/TopNav").then((module) => ({
  default: module.TopNav
})));
const BottomNav = lazy(() => import("@interfaces/layouts/BottomNav").then((module) => ({
  default: module.BottomNav
})));
const Loader = lazy(() => import("@interfaces/layouts/Loader").then((module) => ({
  default: module.Loader
})));
const FallBack = lazy(() => import("@interfaces/layouts/FallBack").then((module) => ({
  default: module.FallBack
})));
const Alert = lazy(() => import("@interfaces/layouts/Alert").then((module) => ({
  default: module.Alert
})));
const Confirm = lazy(() => import("@interfaces/layouts/Confirm").then((module) => ({
  default: module.Confirm
})));
const Dialog = lazy(() => import("@interfaces/layouts/Dialog").then((module) => ({
  default: module.Dialog
})));
const Empty = lazy(() => import("@interfaces/layouts/Empty").then((module) => ({
  default: module.Empty
})));
const Footer = lazy(() => import("@interfaces/layouts/Footer").then((module) => ({
  default: module.Footer
})));

// -------------------------------------------------------------------------------------------------
export {
  Header,
  TopNav,
  BottomNav,
  Loader,
  FallBack,
  Alert,
  Confirm,
  Dialog,
  Empty,
  Footer
};