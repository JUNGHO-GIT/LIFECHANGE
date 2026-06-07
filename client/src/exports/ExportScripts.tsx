/**
 * @file ExportScripts.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export { registerInterceptor } from "@assets/scripts/interceptor";
// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export {
  getLocal,
  getSession,
  setLocal,
  setSession,
} from "@assets/scripts/storage";
// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export { sync } from "@assets/scripts/sync";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export {
  formatDate,
  formatY,
  handleNumberInput,
  insertComma,
} from "@assets/scripts/utils";
