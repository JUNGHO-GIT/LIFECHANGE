// useValidateUser.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
export const useValidateUser= () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH,
  } = useCommonValue();
  const {
    translate
  } = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const REFS: any = useRef<any>({});
  const [ERRORS, setERRORS] = useState<any>({});
  const validate = useRef<any>(() => {});

  // alert 표시 및 focus ---------------------------------------------------------------------------
  const showAlertAndFocus = (field: string, msg: string, idx: number) => {
    alert(translate(msg));
    REFS.current?.[idx]?.[field]?.current?.focus();
    setERRORS({
      [idx]: {
        [field]: true,
      },
    });
    return false;
  };

  // 오류항목 초기화 -------------------------------------------------------------------------------
  const clearError = (field: string, idx: number) => {
    setERRORS((prev: any) => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [field]: false,
      },
    }));
  };

  // 이메일 형식 -----------------------------------------------------------------------------------
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // 8자 이상, 문자, 숫자, 특수문자 포함 -----------------------------------------------------------
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    // 1. login
    if (PATH.includes("user/login")) {
      const target = [
        "user_id",
        "user_pw",
      ];
      setERRORS(target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: false
        });
        return acc;
      }, []));
      REFS.current = (target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: createRef()
        });
        return acc;
      }, []));
      validate.current = (OBJECT: any) => {
        if (!OBJECT.user_id) {
          return showAlertAndFocus("user_id", "errorUserId", 0);
        }
        else if (!OBJECT.user_pw) {
          return showAlertAndFocus("user_pw", "errorUserPw", 0);
        }
        else {
          return true;
        }
      };
    }

    // 2. signup
    else if (PATH.includes("user/signup")) {
      const target = [
        "user_id",
        "user_id_sended",
        "user_id_verified",
        "user_pw",
        "user_pw_verified",
        "user_age",
        "user_initScale",
        "user_initProperty",
      ];
      setERRORS(target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: false
        });
        return acc;
      }, []));
      REFS.current = (target.reduce((acc: any[], cur: string) => {
        acc.push({
          [cur]: createRef()
        });
        return acc;
      }, []));
      validate.current = (OBJECT: any, extra: string) => {
        if (extra === "send") {
          if (!OBJECT.user_id) {
            return showAlertAndFocus("user_id", "errorUserId", 0);
          }
          else if (!validateEmail(OBJECT.user_id)) {
            return showAlertAndFocus("user_id", "errorUserIdAt", 0);
          }
          else {
            return true;
          }
        }
        else if (extra === "verify") {
          if (!OBJECT.user_verify_code) {
            return showAlertAndFocus("user_id_verified", "errorUserVerifyCode", 0);
          }
          else {
            return true;
          }
        }
        else if (extra === "save") {
          if (!OBJECT.user_id) {
            return showAlertAndFocus("user_id", "errorUserId", 0);
          }
          else if (!validateEmail(OBJECT.user_id)) {
            return showAlertAndFocus("user_id", "errorUserIdAt", 0);
          }
          else if (!OBJECT.user_id_verified) {
            return showAlertAndFocus("user_id_verified", "errorUserIdVerified", 0);
          }
          else if (!OBJECT.user_pw) {
            return showAlertAndFocus("user_pw", "errorUserPw", 0);
          }
          else if (!validatePassword(OBJECT.user_pw)) {
            return showAlertAndFocus("user_pw", "errorUserPwRule", 0);
          }
          else if (!OBJECT.user_pw_verified) {
            return showAlertAndFocus("user_pw_verified", "errorUserPwVerified", 0);
          }
          else if (OBJECT.user_pw !== OBJECT.user_pw_verified) {
            return showAlertAndFocus("user_pw_verified", "errorUserPwMatch", 0);
          }
          else if (!OBJECT.user_age) {
            return showAlertAndFocus("user_age", "errorUserAge", 0);
          }
          else if (!OBJECT.user_initScale) {
            return showAlertAndFocus("user_initScale", "errorUserInitScale", 0);
          }
          else if (!OBJECT.user_initProperty) {
            return showAlertAndFocus("user_initProperty", "errorUserInitProperty", 0);
          }
          else {
            return true;
          }
        }
      };
    }

    // 3. resetPw
    else if (PATH.includes("user/resetPw")) {
      const target = [
        "user_id",
        "user_id_sended",
        "user_id_verified",
        "user_pw",
        "user_pw_verified",
      ];
      setERRORS (
        target.reduce((acc: any, cur: string) => ({
          ...acc,
          [cur]: false,
        }), {})
      );
      REFS.current = (
        target.reduce((acc: any, cur: string) => ({
          ...acc,
          [cur]: createRef(),
        }), {})
      );
      validate.current = (OBJECT: any, extra: string) => {
        if (extra === "send") {
          if (!OBJECT.user_id) {
            return showAlertAndFocus("user_id", "errorUserId", 0);
          }
          else if (!validateEmail(OBJECT.user_id)) {
            return showAlertAndFocus("user_id", "errorUserIdAt", 0);
          }
          else {
            return true;
          }
        }
        else if (extra === "verify") {
          if (!OBJECT.user_verify_code) {
            return showAlertAndFocus("user_id_verified", "errorUserVerifyCode", 0);
          }
          else {
            return true;
          }
        }
        else if (extra === "save") {
          if (!OBJECT.user_id) {
            return showAlertAndFocus("user_id", "errorUserId", 0);
          }
          else if (!validateEmail(OBJECT.user_id)) {
            return showAlertAndFocus("user_id", "errorUserIdAt", 0);
          }
          else if (!OBJECT.user_id_verified) {
            return showAlertAndFocus("user_id_verified", "errorUserIdVerified", 0);
          }
          else if (!OBJECT.user_pw) {
            return showAlertAndFocus("user_pw", "errorUserPw", 0);
          }
          else if (!validatePassword(OBJECT.user_pw)) {
            return showAlertAndFocus("user_pw", "errorUserPwRule", 0);
          }
          else if (!OBJECT.user_pw_verified) {
            return showAlertAndFocus("user_pw_verified", "errorUserPwVerified", 0);
          }
          else if (OBJECT.user_pw !== OBJECT.user_pw_verified) {
            return showAlertAndFocus("user_pw_verified", "errorUserPwMatch", 0);
          }
          else {
            return true;
          }
        }
      };
    }
    // 4. delete
    else if (PATH.includes("user/delete")) {
      const target = [
        "user_pw",
      ];
      setERRORS (
        target.reduce((acc: any, cur: string) => ({
          ...acc,
          [cur]: false,
        }), {})
      );
      REFS.current = (
        target.reduce((acc: any, cur: string) => ({
          ...acc,
          [cur]: createRef(),
        }), {})
      );
      validate.current = (OBJECT: any) => {
        if (!OBJECT.user_pw) {
          return showAlertAndFocus("user_pw", "errorUserPw", 0);
        }
        else {
          return true;
        }
      };
    }

    // 5. detail
    else if (PATH.includes("user/detail")) {
      const target = [
        "user_age",
        "user_initScale",
        "user_initProperty",
      ];
      setERRORS (
        target.reduce((acc: any, cur: string) => ({
          ...acc,
          [cur]: false,
        }), {})
      );
      REFS.current = (
        target.reduce((acc: any, cur: string) => ({
          ...acc,
          [cur]: createRef(),
        }), {})
      );
      validate.current = (OBJECT: any) => {
        if (!OBJECT.user_age) {
          return showAlertAndFocus("user_age", "errorUserAge", 0);
        }
        else if (!OBJECT.user_initScale) {
          return showAlertAndFocus("user_initScale", "errorUserInitScale", 0);
        }
        else if (!OBJECT.user_initProperty) {
          return showAlertAndFocus("user_initProperty", "errorUserInitProperty", 0);
        }
        else {
          return true;
        }
      }
    }

    // 6. category
    else if (PATH.includes("user/category")) {
      const target = [
        "category1",
        "category2",
        "category3",
      ];
      setERRORS (
        target.reduce((acc: any, cur: string) => ({
          ...acc,
          [cur]: false,
        }), {})
      );
      REFS.current = (
        target.reduce((acc: any, cur: string) => ({
          ...acc,
          [cur]: createRef(),
        }), {})
      );
      validate.current = (OBJECT: any) => {
        if (!OBJECT.user_category) {
          return showAlertAndFocus("user_category", "errorUserCategory", 0);
        }
        else {
          return true;
        }
      }
    }
  }, [PATH]);

  // 10. return ------------------------------------------------------------------------------------
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};