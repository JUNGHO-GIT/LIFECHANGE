// useValidateUser.tsx

import { createRef, useCallback, useRef, useState } from "@importReacts";
import { useStoreAlert, useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
export const useValidateUser = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();

	// 2-2. useState -------------------------------------------------------------------------------
  const REFS = useRef<any[]>([]);
  const [ERRORS, setERRORS] = useState<any[]>([]);
  const validate = useRef<Function>(() => {});

	// alert 표시 및 focus ---------------------------------------------------------------------------
	const alert = useCallback((field: string, msg: string, idx: number) => {
		setALERT({
			open: true,
			msg: translate(msg),
			severity: "error",
		});
		field && setTimeout(() => {
			REFS?.current?.[idx]?.[field]?.current?.focus();
		}, 0);
		field && setERRORS((prev) => {
			const updatedErrors = [...prev];
			updatedErrors[idx] = {
				...updatedErrors[idx],
				[field]: true,
			};
			return updatedErrors;
		});
	}, [setALERT, translate]);

  // 이메일 형식 -----------------------------------------------------------------------------------
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // 8자 이상, 문자, 숫자, 특수문자 포함 -----------------------------------------------------------
  const validatePw = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  }

	// 7. validate -----------------------------------------------------------------------------------
	validate.current = async (OBJECT: any, extra: string, email: string) => {

		// 7-1. login ----------------------------------------------------------------------------------
		if (extra === "login") {
      const target = [
        "user_id",
        "user_pw",
      ];
      REFS.current = (
        Array.from({ length: 1}, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: createRef()
          }), {})
        ))
      );
      setERRORS (
        Array.from({ length: 1}, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: false
          }), {})
        ))
      );

      if (!OBJECT.user_id) {
        return alert("user_id", "errorUserId", 0);
      }
      else if (!validateEmail(OBJECT.user_id)) {
        return alert("user_id", "errorUserIdAt", 0);
      }
      else if (!OBJECT.user_pw) {
        return alert("user_pw", "errorUserPw", 0);
      }
      return true;
		}

		// 7-2. signup ---------------------------------------------------------------------------------
		if (extra === "signup") {
      const target = [
        "user_id",
        "user_id_sended",
        "user_id_verified",
        "user_pw",
        "user_pw_verified",
        "user_initScale",
        "user_initAvgKcalIntake",
        "user_initProperty",
      ];
      REFS.current = (
        Array.from({ length: 1}, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: createRef()
          }), {})
        ))
      );
      setERRORS (
        Array.from({ length: 1}, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: false
          }), {})
        ))
      );

      if (email === "send") {
        if (!OBJECT.user_id) {
          return alert("user_id", "errorUserId", 0);
        }
        else if (!validateEmail(OBJECT.user_id)) {
          return alert("user_id", "errorUserIdAt", 0);
        }
      }
      else if (email === "verify") {
        if (!OBJECT.user_verify_code) {
          return alert("user_id_verified", "errorUserVerifyCode", 0);
        }
      }
      else if (email === "save") {
        if (!OBJECT.user_id) {
          return alert("user_id", "errorUserId", 0);
        }
        else if (!validateEmail(OBJECT.user_id)) {
          return alert("user_id", "errorUserIdAt", 0);
        }
        else if (!OBJECT.user_id_verified) {
          return alert("user_id_verified", "errorUserIdVerified", 0);
        }
        else if (!OBJECT.user_pw) {
          return alert("user_pw", "errorUserPw", 0);
        }
        else if (!validatePw(OBJECT.user_pw)) {
          return alert("user_pw", "errorUserPwRule", 0);
        }
        else if (!OBJECT.user_pw_verified) {
          return alert("user_pw_verified", "errorUserPwVerified", 0);
        }
        else if (OBJECT.user_pw !== OBJECT.user_pw_verified) {
          return alert("user_pw_verified", "errorUserPwMatch", 0);
        }
        else if (!OBJECT.user_initScale) {
          return alert("user_initScale", "errorUserInitScale", 0);
        }
        else if (!OBJECT.user_initAvgKcalIntake) {
          return alert("user_initAvgKcalIntake", "errorUserInitAvgKcalIntake", 0);
        }
        else if (!OBJECT.user_initProperty) {
          return alert("user_initProperty", "errorUserInitProperty", 0);
        }
      }
      return true;
		}

		// 7-3. detail ---------------------------------------------------------------------------------
		if (extra === "detail") {
      const target = [
        "user_initScale",
        "user_initAvgKcalIntake",
        "user_initProperty",
      ];
      REFS.current = (
        Array.from({ length: 1}, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: createRef()
          }), {})
        ))
      );
      setERRORS (
        Array.from({ length: 1}, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: false
          }), {})
        ))
      );

      if (!OBJECT.user_initScale) {
        return alert("user_initScale", "errorUserInitScale", 0);
      }
      else if (!OBJECT.user_initAvgKcalIntake) {
        return alert("user_initAvgKcalIntake", "errorUserInitAvgKcalIntake", 0);
      }
      else if (!OBJECT.user_initProperty) {
        return alert("user_initProperty", "errorUserInitProperty", 0);
      }
      return true;
		}

		// 7-4. resetPw, delete ------------------------------------------------------------------------
		if (extra === "resetPw" || extra === "delete") {
      const target = [
        "user_id",
        "user_id_sended",
        "user_id_verified",
        "user_pw",
        "user_pw_verified",
      ];
      REFS.current = (
        Array.from({ length: 1}, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: createRef()
          }), {})
        ))
      );
      setERRORS (
        Array.from({ length: 1}, (_, _idx) => (
          target.reduce((acc, cur) => ({
            ...acc,
            [cur]: false
          }), {})
        ))
      );

      if (email === "send") {
        if (!OBJECT.user_id) {
          return alert("user_id", "errorUserId", 0);
        }
        else if (!validateEmail(OBJECT.user_id)) {
          return alert("user_id", "errorUserIdAt", 0);
        }
      }
      else if (email === "verify") {
        if (!OBJECT.user_verify_code) {
          return alert("user_id_verified", "errorUserVerifyCode", 0);
        }
      }
      else if (email === "save") {
        if (!OBJECT.user_id) {
          return alert("user_id", "errorUserId", 0);
        }
        else if (!validateEmail(OBJECT.user_id)) {
          return alert("user_id", "errorUserIdAt", 0);
        }
        else if (!OBJECT.user_id_verified) {
          return alert("user_id_verified", "errorUserIdVerified", 0);
        }
        else if (!OBJECT.user_pw) {
          return alert("user_pw", "errorUserPw", 0);
        }
        else if (!validatePw(OBJECT.user_pw)) {
          return alert("user_pw", "errorUserPwRule", 0);
        }
        else if (!OBJECT.user_pw_verified) {
          return alert("user_pw_verified", "errorUserPwVerified", 0);
        }
        else if (OBJECT.user_pw !== OBJECT.user_pw_verified) {
          return alert("user_pw_verified", "errorUserPwMatch", 0);
        }
      }
			return true;
		}
	};

	// 10. return ----------------------------------------------------------------------------------
	return {
		ERRORS: ERRORS,
		REFS: REFS.current,
		validate: validate.current,
	};
};