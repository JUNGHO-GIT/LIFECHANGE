/**
 * @file useValidateUser.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, createRef, useCallback, useRef, useState } from "@exportReacts";
import { useStoreAlert, useStoreLanguage } from "@exportStores";
import { UserType } from "@exportSchemas";

// 구조 타입 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
type FieldRefs = Record<string, React.RefObject<unknown>>;
type FieldErrors = Record<string, boolean>;
type UserValidate = (
  OBJECT: UserType, extra: string, email: string
) => Promise<boolean>;

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const useValidateUser = () => {
  // 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();

  // 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const REFS: React.RefObject<FieldRefs[]> = useRef<FieldRefs[]>([]);
  const validate: React.RefObject<UserValidate> = useRef<UserValidate>(async () => false);
  const [ ERRORS, setERRORS ] = useState<FieldErrors[]>([]);

  // alert 표시 및 focus ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const alert = useCallback((field: string, msg: string, idx: number) => {
    setALERT({
      open: true,
      msg: translate(msg),
      severity: `error`,
    });
    field && setTimeout(() => {
      (REFS?.current?.[idx]?.[field]?.current as { focus?: () => void } | undefined)?.focus?.();
    }, 0);
    field && setERRORS((prev) => {
      const updatedErrors: FieldErrors[] = [...prev];
      updatedErrors[idx] = {
        ...updatedErrors[idx],
        [field]: true,
      };
      return updatedErrors;
    });
  }, [ setALERT, translate ]);

  // 이메일 형식 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const validateEmail = (email: string) => {
    const emailRegex: RegExp = /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  // 8자 이상, 문자, 숫자, 특수문자 포함 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const validatePw = (password: string) => {
    const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!#$%&*?@])[\d!#$%&*?@A-Za-z]{8,}$/;
    return passwordRegex.test(password);
  };

  // 7. validate ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  validate.current = async (OBJECT, extra, email) => {
    // 7-1. login
    if (extra === `login`) {
      const target: string[] = [
        `user_id`,
        `user_pw`,
      ];
      REFS.current = (
        Array.from({ length: 1 }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: 1 }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );

      if (!OBJECT.user_id) {
        alert(`user_id`, `errorUserId`, 0);
        return false;
      }
      if (!validateEmail(OBJECT.user_id)) {
        alert(`user_id`, `errorUserIdAt`, 0);
        return false;
      }
      if (!OBJECT.user_pw) {
        alert(`user_pw`, `errorUserPw`, 0);
        return false;
      }
      return true;
    }

    // 7-2. signup
    if (extra === `signup`) {
      const target: string[] = [
        `user_id`,
        `user_id_sended`,
        `user_id_verified`,
        `user_pw`,
        `user_pw_verified`,
        `user_initScale`,
        `user_initAvgKcalIntake`,
        `user_initProperty`,
      ];
      REFS.current = (
        Array.from({ length: 1 }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: 1 }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );

      if (email === `send`) {
        if (!OBJECT.user_id) {
          alert(`user_id`, `errorUserId`, 0);
          return false;
        }
        if (!validateEmail(OBJECT.user_id)) {
          alert(`user_id`, `errorUserIdAt`, 0);
          return false;
        }
      }
      else if (email === `verify`) {
        if (!OBJECT.user_verify_code) {
          alert(`user_id_verified`, `errorUserVerifyCode`, 0);
          return false;
        }
      }
      else if (email === `save`) {
        if (!OBJECT.user_id) {
          alert(`user_id`, `errorUserId`, 0);
          return false;
        }
        if (!validateEmail(OBJECT.user_id)) {
          alert(`user_id`, `errorUserIdAt`, 0);
          return false;
        }
        if (!OBJECT.user_id_verified) {
          alert(`user_id_verified`, `errorUserIdVerified`, 0);
          return false;
        }
        if (!OBJECT.user_pw) {
          alert(`user_pw`, `errorUserPw`, 0);
          return false;
        }
        if (!validatePw(OBJECT.user_pw)) {
          alert(`user_pw`, `errorUserPwRule`, 0);
          return false;
        }
        if (!OBJECT.user_pw_verified) {
          alert(`user_pw_verified`, `errorUserPwVerified`, 0);
          return false;
        }
        if (OBJECT.user_pw !== OBJECT.user_pw_verified) {
          alert(`user_pw_verified`, `errorUserPwMatch`, 0);
          return false;
        }
        if (!OBJECT.user_initScale) {
          alert(`user_initScale`, `errorUserInitScale`, 0);
          return false;
        }
        if (!OBJECT.user_initAvgKcalIntake) {
          alert(`user_initAvgKcalIntake`, `errorUserInitAvgKcalIntake`, 0);
          return false;
        }
        if (!OBJECT.user_initProperty) {
          alert(`user_initProperty`, `errorUserInitProperty`, 0);
          return false;
        }
      }
      return true;
    }

    // 7-3. detail
    if (extra === `detail`) {
      const target: string[] = [
        `user_initScale`,
        `user_initAvgKcalIntake`,
        `user_initProperty`,
      ];
      REFS.current = (
        Array.from({ length: 1 }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: 1 }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );

      if (!OBJECT.user_initScale) {
        alert(`user_initScale`, `errorUserInitScale`, 0);
        return false;
      }
      if (!OBJECT.user_initAvgKcalIntake) {
        alert(`user_initAvgKcalIntake`, `errorUserInitAvgKcalIntake`, 0);
        return false;
      }
      if (!OBJECT.user_initProperty) {
        alert(`user_initProperty`, `errorUserInitProperty`, 0);
        return false;
      }
      return true;
    }

    // 7-4. resetPw, delete
    if (extra === `resetPw` || extra === `delete`) {
      const target: string[] = [
        `user_id`,
        `user_id_sended`,
        `user_id_verified`,
        `user_pw`,
        `user_pw_verified`,
      ];
      REFS.current = (
        Array.from({ length: 1 }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: 1 }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );

      if (email === `send`) {
        if (!OBJECT.user_id) {
          alert(`user_id`, `errorUserId`, 0);
          return false;
        }
        if (!validateEmail(OBJECT.user_id)) {
          alert(`user_id`, `errorUserIdAt`, 0);
          return false;
        }
      }
      else if (email === `verify`) {
        if (!OBJECT.user_verify_code) {
          alert(`user_id_verified`, `errorUserVerifyCode`, 0);
          return false;
        }
      }
      else if (email === `save`) {
        if (!OBJECT.user_id) {
          alert(`user_id`, `errorUserId`, 0);
          return false;
        }
        if (!validateEmail(OBJECT.user_id)) {
          alert(`user_id`, `errorUserIdAt`, 0);
          return false;
        }
        if (!OBJECT.user_id_verified) {
          alert(`user_id_verified`, `errorUserIdVerified`, 0);
          return false;
        }
        if (!OBJECT.user_pw) {
          alert(`user_pw`, `errorUserPw`, 0);
          return false;
        }
        if (!validatePw(OBJECT.user_pw)) {
          alert(`user_pw`, `errorUserPwRule`, 0);
          return false;
        }
        if (!OBJECT.user_pw_verified) {
          alert(`user_pw_verified`, `errorUserPwVerified`, 0);
          return false;
        }
        if (OBJECT.user_pw !== OBJECT.user_pw_verified) {
          alert(`user_pw_verified`, `errorUserPwMatch`, 0);
          return false;
        }
      }
      return true;
    }
    return false;
  };

  // 10. return ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};
