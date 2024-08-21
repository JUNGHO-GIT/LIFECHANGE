// useValidate.jsx

import { useState, useEffect, useRef, createRef } from "../../import/ImportReacts.jsx";
import { useLanguage } from "../../import/ImportHooks.jsx";

// -------------------------------------------------------------------------------------------------
export const useValidate = (page, count) => {

  // 1. common -------------------------------------------------------------------------------------
  const { translate } = useLanguage();
  const [ERRORS, setERRORS] = useState({});
  const REFS = useRef({});

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (page === "userSignup") {
      setERRORS({
        user_id: false,
        user_id_sended: false,
        user_id_verified: false,
        user_pw: false,
        user_pw_verified: false,
        user_age: false,
        user_height: false,
        user_initScale: false,
        user_initProperty: false,
      });
      REFS.current = {
        user_id: createRef(),
        user_id_sended: createRef(),
        user_id_verified: createRef(),
        user_pw: createRef(),
        user_pw_verified: createRef(),
        user_age: createRef(),
        user_height: createRef(),
        user_initScale: createRef(),
        user_initProperty: createRef(),
      };
    }
  }, [page]);

  // 3. validate -----------------------------------------------------------------------------------
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // 4. validate -----------------------------------------------------------------------------------
  const validate = (OBJECT, extra) => {
    let foundError = false;
    let initRef = REFS.current;
    let initError = ERRORS;

    if (!initRef) {
      console.error("initRef is not defined");
      return;
    }

    if (count.newSectionCnt === 0) {
      alert(translate("errorCount"));
      foundError = true;
      return;
    }

    switch (page) {
      case ("userSignup"):
        if (extra === "send") {
          if (OBJECT.user_id === "" || !OBJECT.user_id) {
            alert(translate("errorUserId"));
            initRef.user_id.current && initRef.user_id.current?.focus();
            initError.user_id = true;
            foundError = true;
          }
          else if (validateEmail(OBJECT.user_id) === false) {
            alert(translate("errorUserIdAt"));
            initRef.user_id.current && initRef.user_id.current?.focus();
            initError.user_id = true;
            foundError = true;
          }
        }
        else if (extra === "save") {
          if (OBJECT.user_id === "" || !OBJECT.user_id) {
            alert(translate("errorUserId"));
            initRef.user_id.current && initRef.user_id.current?.focus();
            initError.user_id = true;
            foundError = true;
          }
          else if (validateEmail(OBJECT.user_id) === false) {
            alert(translate("errorUserIdAt"));
            initRef.user_id.current && initRef.user_id.current?.focus();
            initError.user_id = true;
            foundError = true;
          }
          else if (OBJECT.user_id.indexOf("@") === -1) {
            alert(translate("errorUserIdAt"));
            initRef.user_id.current && initRef.user_id.current?.focus();
            initError.user_id = true;
            foundError = true;
          }
          else if (OBJECT.user_id_verified === false || !OBJECT.user_id_verified) {
            alert(translate("errorUserIdVerified"));
            initRef.user_id_verified.current && initRef.user_id_verified.current?.focus();
            initError.user_id_verified = true;
            foundError = true;
          }
          else if (OBJECT.user_pw === "" || !OBJECT.user_pw) {
            alert(translate("errorUserPw"));
            initRef.user_pw.current && initRef.user_pw.current?.focus();
            initError.user_pw = true;
            foundError = true;
          }
          else if (OBJECT.user_pw_verified === false || !OBJECT.user_pw_verified) {
            alert(translate("errorUserPwVerified"));
            initRef.user_pw_verified.current && initRef.user_pw_verified.current?.focus();
            initError.user_pw_verified = true;
            foundError = true;
          }
          else if (OBJECT.user_pw !== OBJECT.user_pw_verified) {
            alert(translate("errorUserPwMatch"));
            initRef.user_pw_verified.current && initRef.user_pw_verified.current?.focus();
            initError.user_pw_verified = true;
            foundError = true;
          }
          else if (OBJECT.user_age === "" || !OBJECT.user_age) {
            alert(translate("errorUserAge"));
            initRef.user_age.current && initRef.user_age.current?.focus();
            initError.user_age = true;
            foundError = true;
          }
          else if (OBJECT.user_height === "" || !OBJECT.user_height) {
            alert(translate("errorUserHeight"));
            initRef.user_height.current && initRef.user_height.current?.focus();
            initError.user_height = true;
            foundError = true;
          }
          else if (OBJECT.user_initScale === "" || !OBJECT.user_initScale) {
            alert(translate("errorUserInitScale"));
            initRef.user_initScale.current && initRef.user_initScale.current?.focus();
            initError.user_initScale = true;
            foundError = true;
          }
          else if (OBJECT.user_initProperty === "" || !OBJECT.user_initProperty) {
            alert(translate("errorUserInitProperty"));
            initRef.user_initProperty.current && initRef.user_initProperty.current?.focus();
            initError.user_initProperty = true;
            foundError = true;
          }
        }
      break;

      case ("sleepSave"):


      default:
        console.error("page is not defined");
      break;
    }

    setERRORS(initError);

    return !foundError;
  };

  // 5. return -------------------------------------------------------------------------------------
  return {
    ERRORS,
    REFS,
    validate,
  };
};